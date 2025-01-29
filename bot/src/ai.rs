use std::collections::HashMap;
use std::env;
use std::ops::Add;

use futures_util::stream::StreamExt;
use futures_util::TryStreamExt;
use langchain_rust::agent::AgentError;
use langchain_rust::chain::{
    Chain, ConversationalRetrieverChain, ConversationalRetrieverChainBuilder,
};
use langchain_rust::document_loaders::InputFormat::Markdown;
use langchain_rust::document_loaders::{Loader, PandocLoader};
use langchain_rust::llm::{OpenAI, OpenAIConfig, OpenAIModel};
use langchain_rust::memory::SimpleMemory;
use langchain_rust::prompt::HumanMessagePromptTemplate;
use langchain_rust::schemas::{Document, Message};
use langchain_rust::vectorstore::qdrant::Store;
use langchain_rust::vectorstore::{Retriever, VecStoreOptions};
use langchain_rust::{
    embedding::openai::openai_embedder::OpenAiEmbedder,
    fmt_message, fmt_template, message_formatter, prompt_args, template_jinja2,
    vectorstore::qdrant::{Qdrant, StoreBuilder},
    vectorstore::VectorStore,
};
use regex::Regex;
use serde_json::json;
use walkdir::WalkDir;

#[derive(Clone)]
struct SourceDirectory<'a> {
    path: String,
    category: &'a str,
}

struct DocumentOutput<'a> {
    document: Document,
    source: SourceDirectory<'a>,
    page_content: String,
}

pub fn create_client() -> Qdrant {
    Qdrant::from_url(
        &env::var("PIANORHYTHM_QDRANT_HOST").unwrap_or("http://127.0.0.1:6334".to_string()),
    )
    .build()
    .unwrap()
}

pub async fn setup() -> (OpenAI<OpenAIConfig>, OpenAIConfig) {
    use langchain_rust::vectorstore::VecStoreOptions;
    let API_KEY = env::var("OPENAI_API_KEY").unwrap_or_default();
    let client = create_client();

    let mut all_docs: Vec<DocumentOutput> = vec![];

    let collection_exists = client
        .collection_exists("langchain-rs")
        .await
        .unwrap_or_default();

    let root_directory = if cfg!(debug_assertions) {
        ".."
    } else {
        "pianorhythm-docs-bot-sources"
    };

    let directories = vec![
        SourceDirectory {
            path: format!("{}/docs", root_directory),
            category: "documentation",
        },
        SourceDirectory {
            path: format!("{}/changelog", root_directory),
            category: "changelogs",
        },
        SourceDirectory {
            path: format!("{}/blog", root_directory),
            category: "blog",
        },
    ];

    if !collection_exists {
        let date_and_version_re = Regex::new(r"(\d{4}-\d{2}-\d{2})-(\d+\.\d+\.\d+)").unwrap();

        for source in directories {
            // Read the directory and collect all file paths
            let file_paths = WalkDir::new(source.path.clone())
                .into_iter()
                .filter_map(|entry| entry.ok()) // Ignore errors
                .filter(|entry| entry.path().is_file()) // Only include files
                .filter(|entry| {
                    matches!(
                        entry.path().extension().and_then(|s| s.to_str()),
                        Some("md" | "mdx")
                    )
                }) // Only include .md or .mdx files
                .map(|entry| entry.path().to_path_buf()) // Collect paths
                .collect::<Vec<_>>();

            log::info!(
                "[{}] A total of {} documents ready to be processed. Path: {}",
                source.category,
                file_paths.len(),
                source.path,
            );

            for path in file_paths {
                let lossy_path = path.to_string_lossy().to_string();
                log::debug!("Processing: {}", lossy_path);

                let mut meta = HashMap::new();
                meta.insert("source".to_string(), json!(source.category));

                let loader = PandocLoader::from_path(Markdown.to_string(), lossy_path.clone())
                    .await
                    .expect("Failed to create PandocLoader");

                let mut docs = loader
                    .load()
                    .await
                    .unwrap()
                    .filter_map(|document| async move { document.ok() })
                    .map(|document| DocumentOutput {
                        page_content: document.page_content.clone(),
                        source: source.clone(),
                        document,
                    })
                    .collect::<Vec<_>>()
                    .await;

                for mut output in docs.iter_mut() {
                    if let Some(captures) = date_and_version_re.captures(&lossy_path) {
                        let date = captures.get(1).map_or("", |m| m.as_str());
                        let semver = captures.get(2).map_or("", |m| m.as_str());

                        meta.insert("date".to_string(), json!(date));
                        meta.insert("version".to_string(), json!(semver));
                    }

                    if let Ok(version_re) = Regex::new(r"version:\s*([\d.]+)") {
                        if let Some(captures) = version_re.captures(&output.page_content) {
                            if let Some(value) = captures.get(1) {
                                meta.insert("version".to_string(), json!(value.as_str()));
                            }
                        }
                    }

                    if let Ok(regex_value) = Regex::new(r"title:\s*(.+)") {
                        if let Some(captures) = regex_value.captures(&output.page_content) {
                            if let Some(value) = captures.get(1) {
                                meta.insert("title".to_string(), json!(value.as_str()));
                            }
                        }
                    }

                    if let Ok(regex_value) = Regex::new(r"keywords:\s*\[(.+)\]") {
                        if let Some(captures) = regex_value.captures(&output.page_content) {
                            if let Some(keywords) = captures.get(1) {
                                let keywords_list: Vec<&str> =
                                    keywords.as_str().split(',').map(|s| s.trim()).collect();
                                meta.insert("keywords".to_string(), json!(keywords_list));
                            }
                        }
                    }

                    output.document.metadata = meta.clone();

                    if lossy_path.contains("versions.md") {
                        let changelogs = all_docs
                            .iter()
                            .filter(|x| x.source.category == "changelogs")
                            .filter_map(|x| x.document.metadata.get("version"))
                            .collect::<Vec<_>>();

                        let versions = changelogs
                            .iter()
                            .filter_map(|x| x.as_str())
                            .collect::<Vec<_>>()
                            .join(",");

                        output.document.page_content += &format!(
                            "total_versions: {}\nall_versions:[{}]",
                            changelogs.len(),
                            versions
                        );
                    }
                }

                all_docs.extend(docs);
            }
        }

        if all_docs.is_empty() {
            warn!("Empty docs...");
        }
    }

    let config = OpenAIConfig::default().with_api_key(API_KEY);

    if !all_docs.is_empty() {
        let mut store = create_store(config.clone(), false).await;

        let mut docs: Vec<Document> = vec![];
        for doc in all_docs {
            docs.push(doc.document);
        }

        store
            .add_documents(&docs, &VecStoreOptions::default())
            .await
            .unwrap();
    }

    //We can then initialize the model:
    let llm = OpenAI::default()
        .with_config(config.clone())
        .with_model(OpenAIModel::Gpt4oMini.to_string());

    (llm, config.clone())
}

pub async fn create_store(config: OpenAIConfig, recreate_collection: bool) -> Store {
    StoreBuilder::new()
        .embedder(OpenAiEmbedder::default().with_config(config))
        .client(create_client())
        .recreate_collection(recreate_collection)
        .collection_name("langchain-rs")
        .build()
        .await
        .unwrap()
}

pub fn create_chain(
    input: InputVariables,
    llm: OpenAI<OpenAIConfig>,
    store: Store,
) -> ConversationalRetrieverChain {
    let message = format!("You'll be given the user's Usertag (referred to as username, usertag or name) which is {} and their SocketID (unique session identifier) which is {}, if applicable. Otherwise, it'll be 'None'.\
    You are allowed to give them their socketID value if requested.",
                          input.usertag.unwrap_or("None".to_string()),
                          input.socket_id.unwrap_or("None".to_string()),
    );

    let prompt = message_formatter![
        fmt_message!(Message::new_system_message("You are a super helpful assistant for a piano based web application called PianoRhythm, developed by someone named Oak. You'll be talking to users of the application.")),
        fmt_message!(Message::new_system_message(message)),
        fmt_template!(HumanMessagePromptTemplate::new(
                    template_jinja2!("
Use the following pieces of context to answer the question at the end. The questions or statements are being given by users of PianoRhythm.
If you don't know the answer, just say that you don't know (in a nice way), DON'T try to make up an answer. Keep answers short and concise.
Assume everything asked is within the context of PianoRhythm.
Any first person references in the context means that it was the developer, Oak, making them. So, refer to Oak for any answers directly from him.

{{context}}

Question:{{question}}
Helpful Answer:

        ",
        "context","question"))),
    ];

    ConversationalRetrieverChainBuilder::new()
        .llm(llm)
        .rephrase_question(true)
        .memory(SimpleMemory::new().into())
        .retriever(Retriever::new(store, 10))
        .prompt(prompt)
        .build()
        .expect("Error building ConversationalChain")
}

#[derive(Clone)]
pub struct InputVariables {
    pub question: String,
    pub usertag: Option<String>,
    pub socket_id: Option<String>,
}

impl InputVariables {
    pub fn new(question: String) -> Self {
        Self {
            question,
            usertag: None,
            socket_id: None,
        }
    }

    pub fn with_user_tag(&mut self, usertag: String) -> &mut Self {
        self.usertag = Some(usertag);
        self
    }

    pub fn with_socket_id(&mut self, socket_id: String) -> &mut Self {
        self.socket_id = Some(socket_id);
        self
    }
}

pub async fn chain_give_input(
    chain: &ConversationalRetrieverChain,
    input: InputVariables,
) -> Result<String, AgentError> {
    let prompt_input = prompt_args! {
        "question" => input.question,
    };

    Ok(chain.invoke(prompt_input).await?)
}
