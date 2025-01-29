#[macro_use]
extern crate log;
extern crate pretty_env_logger;

use std::ops::Deref;

use actix::Addr;
use actix::SystemService;
use actix_web::web::Data;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use futures_util::SinkExt;
use langchain_rust::llm::OpenAI;
use langchain_rust::llm::OpenAIConfig;
use serde::Deserialize;

use crate::ai_actor::ChatBotActor;

mod ai;
mod ai_actor;

#[derive(Deserialize)]
struct ChatRequest {
    usertag: Option<String>,
    socket_id: Option<String>,
    question: String,
}

#[post("/chat")]
async fn chat(
    request: web::Json<ChatRequest>,
    chat_bot: Data<Addr<ChatBotActor>>,
    llm: Data<OpenAI<OpenAIConfig>>,
    config: Data<OpenAIConfig>,
) -> impl Responder {
    if request.question.is_empty() {
        return HttpResponse::BadRequest().body("No question provided");
    }

    let result = chat_bot
        .send(ai_actor::AskQuestion {
            question: request.question.clone(),
            usertag: request.usertag.clone().unwrap_or("unknown".to_string()),
            socket_id: request.socket_id.clone().unwrap_or("unknown".to_string()),
            data: ai_actor::AskQuestionLLM {
                config: config.into_inner().deref().clone(),
                llm: llm.into_inner().deref().clone(),
            },
        })
        .await;

    let response = result
        .map(|x| x.response)
        .unwrap_or("Failed to get a response.".to_string());
    HttpResponse::Ok().body(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let log_level = if cfg!(debug_assertions) {
        "debug"
    } else {
        "info"
    };
    unsafe {
        std::env::set_var(
            "RUST_LOG", format!("{log_level}, h2=warn, hyper_util=warn, reqwest=warn, tower=warn, langchain_rust=warn"),
        );
    }

    pretty_env_logger::init();

    let (llm, config) = ai::setup().await;
    info!("Starting server...");

    HttpServer::new(move || {
        App::new()
            .service(chat)
            .app_data(web::JsonConfig::default().limit(1024 * 1024 * 10))
            .app_data(Data::new(llm.clone()))
            .app_data(Data::new(config.clone()))
            .app_data(Data::new(ChatBotActor::from_registry()))
    })
    .bind(("0.0.0.0", if cfg!(debug_assertions) { 8080 } else { 80 }))?
    .run()
    .await
}
