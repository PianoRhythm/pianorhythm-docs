use std::time::Duration;

use actix::{Actor, Context, Handler, Message, ResponseFuture, Supervised, SystemService};
use expiringmap::ExpiringMap;
use langchain_rust::chain::ConversationalRetrieverChain;
use langchain_rust::llm::{OpenAI, OpenAIConfig};
use langchain_rust::vectorstore::qdrant::Store;
use serde::Deserialize;

use crate::ai;
use crate::ai::InputVariables;

pub struct ChatBotActor {
    users: ExpiringMap<String, ConversationalRetrieverChain>,
}

impl Default for ChatBotActor {
    fn default() -> Self {
        Self {
            users: ExpiringMap::new()
        }
    }
}

#[derive(Deserialize, Debug)]
pub struct AskQuestionResponse {
    pub response: String,
}

pub struct AskQuestionLLM {
    pub config: OpenAIConfig,
    pub llm: OpenAI<OpenAIConfig>,
}

#[derive(Message)]
#[rtype(result = "AskQuestionResponse")]
pub struct AskQuestion {
    pub question: String,
    pub usertag: String,
    pub socket_id: String,
    pub data: AskQuestionLLM,
}

impl Actor for ChatBotActor {
    type Context = Context<Self>;
}

impl Supervised for ChatBotActor {}

impl SystemService for ChatBotActor {
    fn service_started(&mut self, _: &mut Context<Self>) {
        log::info!("Chat bot Service started.");
    }
}

impl Handler<AskQuestion> for ChatBotActor {
    type Result = ResponseFuture<AskQuestionResponse>;

    fn handle(&mut self, msg: AskQuestion, _ctx: &mut Self::Context) -> Self::Result {
        log::debug!("Input: {} | {}", msg.usertag, msg.socket_id);

        let input = InputVariables::new(msg.question)
            .with_user_tag(msg.usertag)
            .with_socket_id(msg.socket_id)
            .clone();

        Box::pin(async move {
            let store = ai::create_store(msg.data.config, false).await;
            let conversation_chain = ai::create_chain(input.clone(), msg.data.llm, store);
            let result = ai::chain_give_input(&conversation_chain, input.clone()).await;
            let response = result.unwrap_or("Sorry, something went wrong. Try again later.".to_string());
            AskQuestionResponse { response }
        })
    }
}