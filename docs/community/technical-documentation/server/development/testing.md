---
id: testing-guide
title: Testing Guide
description: Comprehensive testing strategy with unit tests, integration tests, and performance testing
path: ['/community/development/technical-documentation/server/development/testing']
keywords: ['testing', 'unit-tests', 'integration-tests', 'performance', 'quality-assurance', 'rust', 'pianorhythm']
tags:
  - testing
  - unit-tests
  - integration-tests
  - performance
  - quality-assurance
  - rust
  - development
  - best-practices
---

# Testing Guide

This guide covers the comprehensive testing strategy for PianoRhythm Server, including unit tests, integration tests, performance tests, and testing best practices.

## 🧪 Testing Philosophy

### Testing Pyramid
- **Unit Tests** (70%) - Fast, isolated component testing
- **Integration Tests** (20%) - API and service integration testing
- **End-to-End Tests** (10%) - Full system workflow testing

### Testing Principles
- **Fast Feedback** - Tests should run quickly during development
- **Reliable** - Tests should be deterministic and not flaky
- **Maintainable** - Tests should be easy to understand and modify
- **Comprehensive** - Critical paths should have good test coverage

## 🏗️ Test Structure

### Test Organization
```
src/
├── lib.rs
├── main.rs
├── actors/
│   ├── mod.rs
│   ├── pianorhythm_state.rs
│   └── tests/                    # Unit tests for actors
│       ├── mod.rs
│       └── pianorhythm_state_tests.rs
├── routes/
│   ├── mod.rs
│   ├── api.rs
│   └── tests/                    # Unit tests for routes
│       └── api_tests.rs
└── tests/                        # Integration tests
    ├── common/
    │   ├── mod.rs
    │   └── test_helpers.rs
    ├── api_tests.rs
    ├── websocket_tests.rs
    └── performance_tests.rs
```

### Test Configuration
```toml
# Cargo.toml
[dev-dependencies]
actix-test = "0.1.2"
actix-codec = "0.5.1"
awc = "3.2.0"
test-log = "0.2.13"
test-env-helpers = "0.2.2"
tokio-test = "0.4"
mockall = "0.11"
wiremock = "0.5"
criterion = "0.5"
```

## 🔬 Unit Testing

### Actor Testing
```rust
// src/actors/tests/pianorhythm_state_tests.rs
#[cfg(test)]
mod tests {
    use super::*;
    use crate::actors::pianorhythm_state::PianoRhythmState;
    use crate::connections::stores::memory::MemoryStore;
    use std::sync::Arc;

    fn create_test_state() -> PianoRhythmState<MemoryStore> {
        let config = Arc::new(get_test_configuration());
        let store = MemoryStore::new();
        PianoRhythmState::new(config, store)
    }

    #[tokio::test]
    async fn test_save_user() {
        let state = create_test_state();
        let user_dbo = create_test_user();

        let result = state.save_user(&user_dbo);
        assert!(result.is_ok());

        let retrieved_user = state.get_user(&user_dbo.socket_id).unwrap();
        assert_eq!(retrieved_user.username, user_dbo.username);
    }

    #[tokio::test]
    async fn test_add_user_to_room() {
        let state = create_test_state();
        let room_dbo = create_test_room();
        let user_dbo = create_test_user();

        // Save room and user first
        state.save_room(&room_dbo).unwrap();
        state.save_user(&user_dbo).unwrap();

        let result = state.add_user_to_room(&room_dbo.room_id, &user_dbo.socket_id);
        assert!(result.is_ok());

        let users_in_room = state.get_users_in_room(&room_dbo.room_id).unwrap();
        assert_eq!(users_in_room.len(), 1);
        assert_eq!(users_in_room[0].socket_id, user_dbo.socket_id);
    }
}
```

### Route Testing
```rust
// src/routes/tests/api_tests.rs
#[cfg(test)]
mod tests {
    use super::*;
    use actix_web::{test, web, App};
    use crate::routes::api;

    #[actix_web::test]
    async fn test_validate_token_success() {
        let app = test::init_service(
            App::new()
                .service(api::validate_token)
        ).await;

        let req = test::TestRequest::get()
            .uri("/validate-token")
            .insert_header(("Authorization", "Bearer valid-jwt-token"))
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_success());
    }

    #[actix_web::test]
    async fn test_validate_token_unauthorized() {
        let app = test::init_service(
            App::new()
                .service(api::validate_token)
        ).await;

        let req = test::TestRequest::get()
            .uri("/validate-token")
            .to_request();

        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), 401);
    }
}
```

### Mock Testing
```rust
// Using mockall for mocking dependencies
use mockall::predicate::*;
use mockall::mock;

mock! {
    DatabaseService {
        async fn get_user(&self, user_id: &str) -> Result<UserDbo, DatabaseError>;
        async fn save_user(&self, user: &UserDbo) -> Result<(), DatabaseError>;
    }
}

#[tokio::test]
async fn test_user_service_with_mock() {
    let mut mock_db = MockDatabaseService::new();
    mock_db
        .expect_get_user()
        .with(eq("test_user"))
        .times(1)
        .returning(|_| Ok(create_test_user()));

    let user_service = UserService::new(Box::new(mock_db));
    let result = user_service.get_user("test_user").await;
    
    assert!(result.is_ok());
}
```

## 🔗 Integration Testing

### API Integration Tests
```rust
// tests/api_tests.rs
use actix_web::{test, web, App};
use pianorhythm::create_app;
use test_env_helpers::*;

#[actix_web::test]
async fn test_user_registration_flow() {
    let app = test::init_service(create_app().await).await;

    // Test user registration
    let registration_data = json!({
        "username": "testuser",
        "email": "test@example.com",
        "password": "securepassword"
    });

    let req = test::TestRequest::post()
        .uri("/api/auth/register")
        .set_json(&registration_data)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    // Test user login
    let login_data = json!({
        "username": "testuser",
        "password": "securepassword"
    });

    let req = test::TestRequest::post()
        .uri("/api/auth/login")
        .set_json(&login_data)
        .to_request();

    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());

    let body: serde_json::Value = test::read_body_json(resp).await;
    assert!(body["data"]["token"].is_string());
}
```

### WebSocket Integration Tests
```rust
// tests/websocket_tests.rs
use actix_codec::Framed;
use actix_web::{test, web, App};
use awc::ws::{Codec, Frame, Message};
use futures_util::{SinkExt, StreamExt};

#[actix_web::test]
async fn test_websocket_connection() {
    let mut srv = actix_test::start(|| {
        App::new().service(web::resource("/ws").route(web::get().to(websocket_handler)))
    });

    let mut framed = srv.ws_at("/ws").await.unwrap();

    // Send test message
    framed
        .send(Message::Text("test message".into()))
        .await
        .unwrap();

    // Receive response
    let item = framed.next().await.unwrap().unwrap();
    match item {
        Frame::Text(txt) => {
            assert_eq!(txt, "echo: test message");
        }
        _ => panic!("Unexpected frame type"),
    }
}
```

### Database Integration Tests
```rust
// tests/database_tests.rs
use mongodb::{Client, options::ClientOptions};
use pianorhythm::connections::mongo_services::users_service::UsersService;

#[tokio::test]
async fn test_user_crud_operations() {
    let client_options = ClientOptions::parse("mongodb://localhost:27017").await.unwrap();
    let client = Client::with_options(client_options).unwrap();
    let db = client.database("pianorhythm_test");
    
    let users_service = UsersService::new(client, &db);
    
    // Create user
    let user = create_test_user();
    let result = users_service.create_user(&user).await;
    assert!(result.is_ok());
    
    // Read user
    let retrieved_user = users_service.get_user(&user.user_id).await.unwrap();
    assert_eq!(retrieved_user.username, user.username);
    
    // Update user
    let mut updated_user = retrieved_user;
    updated_user.username = "updated_username".to_string();
    let result = users_service.update_user(&updated_user).await;
    assert!(result.is_ok());
    
    // Delete user
    let result = users_service.delete_user(&user.user_id).await;
    assert!(result.is_ok());
}
```

## ⚡ Performance Testing

### Benchmark Tests
```rust
// benches/performance_benchmarks.rs
use criterion::{black_box, criterion_group, criterion_main, Criterion};
use pianorhythm::actors::pianorhythm_state::PianoRhythmState;

fn benchmark_user_operations(c: &mut Criterion) {
    let state = create_test_state();
    let user = create_test_user();

    c.bench_function("save_user", |b| {
        b.iter(|| {
            state.save_user(black_box(&user)).unwrap();
        })
    });

    c.bench_function("get_user", |b| {
        state.save_user(&user).unwrap();
        b.iter(|| {
            state.get_user(black_box(&user.socket_id)).unwrap();
        })
    });
}

criterion_group!(benches, benchmark_user_operations);
criterion_main!(benches);
```

### Load Testing
```rust
// tests/load_tests.rs
use std::time::Duration;
use tokio::time::sleep;

#[tokio::test]
#[ignore] // Run with --ignored flag
async fn test_concurrent_websocket_connections() {
    let server_url = "ws://localhost:8080/api/websocket/test";
    let concurrent_connections = 100;
    
    let mut handles = Vec::new();
    
    for i in 0..concurrent_connections {
        let handle = tokio::spawn(async move {
            let (ws_stream, _) = tokio_tungstenite::connect_async(server_url)
                .await
                .expect("Failed to connect");
            
            // Simulate user activity
            sleep(Duration::from_secs(30)).await;
        });
        handles.push(handle);
    }
    
    // Wait for all connections to complete
    for handle in handles {
        handle.await.unwrap();
    }
}
```

## 🛠️ Test Utilities

### Test Helpers
```rust
// tests/common/test_helpers.rs
use pianorhythm::models::*;
use pianorhythm::config::*;
use uuid::Uuid;

pub fn create_test_user() -> UserDbo {
    UserDbo {
        user_id: Uuid::new_v4().to_string(),
        username: "testuser".to_string(),
        user_tag: "testuser#1234".to_string(),
        socket_id: Uuid::new_v4().to_string(),
        room_id: None,
        status: UserStatus::Online,
        roles: UserRoles::default(),
        settings: UserSettings::default(),
        billing_settings: UserBillingSettings::default(),
        last_seen: chrono::Utc::now(),
    }
}

pub fn create_test_room() -> RoomStateDbo {
    RoomStateDbo {
        room_id: Uuid::new_v4().to_string(),
        room_name: "Test Room".to_string(),
        room_owner: "testuser".to_string(),
        room_type: RoomType::Public,
        settings: RoomSettings::default(),
        created_at: chrono::Utc::now(),
        last_activity: chrono::Utc::now(),
    }
}

pub fn get_test_configuration() -> PianoRhythmConfig {
    PianoRhythmConfig {
        server_name: "test".to_string(),
        redis_url: "redis://localhost:6379".to_string(),
        redis_prefix: "pianorhythm_test".to_string(),
        // ... other test configuration
    }
}
```

### Test Database Setup
```rust
// tests/common/test_db.rs
use once_cell::sync::Lazy;
use std::sync::Mutex;

static TEST_DB_COUNTER: Lazy<Mutex<u32>> = Lazy::new(|| Mutex::new(0));

pub fn get_test_db_name() -> String {
    let mut counter = TEST_DB_COUNTER.lock().unwrap();
    *counter += 1;
    format!("pianorhythm_test_{}", *counter)
}

pub async fn setup_test_database() -> mongodb::Database {
    let client_options = mongodb::options::ClientOptions::parse("mongodb://localhost:27017")
        .await
        .unwrap();
    let client = mongodb::Client::with_options(client_options).unwrap();
    let db_name = get_test_db_name();
    client.database(&db_name)
}

pub async fn cleanup_test_database(db: &mongodb::Database) {
    db.drop(None).await.unwrap();
}
```

## 🚀 Running Tests

### Test Commands
```bash
# Run all tests
cargo test

# Run unit tests only
cargo test --lib

# Run integration tests only
cargo test --test integration

# Run specific test
cargo test test_user_authentication

# Run tests with output
cargo test -- --nocapture

# Run ignored tests (like load tests)
cargo test -- --ignored

# Run tests with coverage
cargo tarpaulin --out Html

# Run benchmarks
cargo bench
```

### Test Scripts
```bash
#!/bin/bash
# scripts/run-tests.sh

echo "Starting test databases..."
docker run -d --name redis-test -p 6380:6379 redis:7-alpine
docker run -d --name mongo-test -p 27018:27017 mongo:7

echo "Waiting for databases to start..."
sleep 5

echo "Running unit tests..."
cargo test --lib

echo "Running integration tests..."
MONGODB_URL=mongodb://localhost:27018/test \
REDIS_URL=redis://localhost:6380 \
cargo test --test integration

echo "Running performance tests..."
cargo bench

echo "Cleaning up test databases..."
docker stop redis-test mongo-test
docker rm redis-test mongo-test

echo "All tests completed!"
```

## 📊 Test Coverage

### Coverage Configuration
```toml
# tarpaulin.toml
[tool.tarpaulin.coverage]
exclude = [
    "src/main.rs",
    "src/bin/*",
    "tests/*",
    "benches/*"
]
ignore-panics = true
count = true
line = true
branch = true
```

### Coverage Reports
```bash
# Generate HTML coverage report
cargo tarpaulin --out Html

# Generate XML coverage report (for CI)
cargo tarpaulin --out Xml

# Upload to codecov
bash <(curl -s https://codecov.io/bash)
```

---

This testing guide provides a comprehensive framework for ensuring code quality and reliability in PianoRhythm Server through thorough testing at all levels.
