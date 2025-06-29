# Development Setup Guide

This guide will help you set up a local development environment for PianoRhythm Server, including all dependencies, tools, and configuration needed for development.

## 🛠️ Prerequisites

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Network**: Stable internet connection for dependencies

### Required Software

#### Rust Development Environment
```bash
# Install Rust using rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Restart shell or source the environment
source ~/.cargo/env

# Verify installation
rustc --version
cargo --version

# Install required Rust version (see rust-toolchain.toml)
rustup install 1.77
rustup default 1.77
```

#### Database Systems
```bash
# Redis (using Docker)
docker run -d --name redis-dev -p 6379:6379 redis:7-alpine

# MongoDB (using Docker)
docker run -d --name mongo-dev -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Or install locally:
# - Redis: https://redis.io/download
# - MongoDB: https://www.mongodb.com/try/download/community
```

#### Development Tools
```bash
# Git (if not already installed)
# Windows: https://git-scm.com/download/win
# macOS: brew install git
# Linux: sudo apt-get install git

# Docker (optional but recommended)
# https://docs.docker.com/get-docker/

# VS Code (recommended IDE)
# https://code.visualstudio.com/
```

## 📥 Project Setup

### Clone Repository
```bash
# Clone the repository
git clone https://github.com/PianoRhythm/pianorhythm-server.git
cd pianorhythm-server

# Check out development branch (if applicable)
git checkout develop
```

### Install Dependencies
```bash
# Install Rust dependencies
cargo build

# Install development dependencies
cargo install cargo-watch    # Auto-rebuild on file changes
cargo install cargo-audit     # Security audit
cargo install cargo-tarpaulin # Code coverage
```

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
# Use your preferred editor (nano, vim, code, etc.)
code .env
```

### Sample Development .env File
```bash
# .env
RUST_LOG=debug
SERVER_NAME=development
PORT=8080
HOST=127.0.0.1

# Database URLs
MONGODB_URL=mongodb://admin:password@localhost:27017/pianorhythm_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=dev-jwt-secret-change-in-production
SESSION_SECRET=dev-session-secret-change-in-production

# External Services (use test keys)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
DISCORD_BOT_TOKEN=your_test_bot_token_here

# Logging
SEQ_URL=http://localhost:5341
LOG_LEVEL=debug
LOG_FORMAT=text

# Development flags
ENABLE_CORS=true
COOKIE_SECURE=false
```

## 🚀 Running the Development Server

### Start Required Services
```bash
# Start Redis (if using Docker)
docker start redis-dev

# Start MongoDB (if using Docker)
docker start mongo-dev

# Optional: Start Seq for logging
docker run -d --name seq-dev -p 5341:80 -e ACCEPT_EULA=Y datalust/seq:latest
```

### Run the Server
```bash
# Standard run
cargo run

# Run with auto-reload on file changes
cargo watch -x run

# Run with specific log level
RUST_LOG=debug cargo run

# Run tests
cargo test

# Run with release optimizations (slower compile, faster runtime)
cargo run --release
```

### Verify Installation
```bash
# Check server health
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","timestamp":"2024-01-01T00:00:00Z"}
```

## 🔧 IDE Configuration

### VS Code Setup
Install recommended extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "rust-lang.rust-analyzer",
    "vadimcn.vscode-lldb",
    "serayuzgur.crates",
    "tamasfe.even-better-toml",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code Settings
```json
// .vscode/settings.json
{
  "rust-analyzer.cargo.features": "all",
  "rust-analyzer.checkOnSave.command": "clippy",
  "rust-analyzer.cargo.loadOutDirsFromCheck": true,
  "rust-analyzer.procMacro.enable": true,
  "files.watcherExclude": {
    "**/target/**": true
  }
}
```

### Debug Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lldb",
      "request": "launch",
      "name": "Debug PianoRhythm Server",
      "cargo": {
        "args": ["build", "--bin=pianorhythm"],
        "filter": {
          "name": "pianorhythm",
          "kind": "bin"
        }
      },
      "args": [],
      "cwd": "${workspaceFolder}",
      "env": {
        "RUST_LOG": "debug"
      }
    }
  ]
}
```

## 🧪 Development Workflow

### Code Quality Tools
```bash
# Format code
cargo fmt

# Lint code
cargo clippy

# Check for security vulnerabilities
cargo audit

# Run all tests
cargo test

# Run tests with coverage
cargo tarpaulin --out Html

# Check documentation
cargo doc --open
```

### Git Hooks Setup
```bash
# Install pre-commit hooks
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
cargo fmt --all -- --check
cargo clippy -- -D warnings
cargo test
EOF

chmod +x .git/hooks/pre-commit
```

### Development Scripts
Create helpful development scripts:

```bash
# scripts/dev-setup.sh
#!/bin/bash
echo "Setting up development environment..."

# Start services
docker start redis-dev mongo-dev seq-dev 2>/dev/null || {
    echo "Starting Docker services..."
    docker run -d --name redis-dev -p 6379:6379 redis:7-alpine
    docker run -d --name mongo-dev -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        mongo:7
    docker run -d --name seq-dev -p 5341:80 -e ACCEPT_EULA=Y datalust/seq:latest
}

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 5

# Run database migrations/setup
cargo run --bin setup-db

echo "Development environment ready!"
```

```bash
# scripts/test-all.sh
#!/bin/bash
echo "Running comprehensive tests..."

# Format check
cargo fmt --all -- --check || exit 1

# Lint check
cargo clippy -- -D warnings || exit 1

# Unit tests
cargo test --lib || exit 1

# Integration tests
cargo test --test integration || exit 1

# Documentation tests
cargo test --doc || exit 1

echo "All tests passed!"
```

## 🐛 Debugging

### Logging Configuration
```rust
// For detailed debugging, set in your .env:
RUST_LOG=debug,pianorhythm=trace,actix_web=debug

// Or set specific modules:
RUST_LOG=pianorhythm::websocket=trace,pianorhythm::actors=debug
```

### Common Debug Commands
```bash
# Debug with specific log levels
RUST_LOG=trace cargo run

# Debug with backtrace on panic
RUST_BACKTRACE=1 cargo run

# Debug with full backtrace
RUST_BACKTRACE=full cargo run

# Profile memory usage
cargo run --features=profiling

# Debug WebSocket connections
websocat ws://localhost:8080/api/websocket/test_payload
```

### Database Debugging
```bash
# Connect to MongoDB
docker exec -it mongo-dev mongosh -u admin -p password

# Connect to Redis
docker exec -it redis-dev redis-cli

# View Redis keys
docker exec -it redis-dev redis-cli KEYS "pianorhythm:*"
```

## 🔄 Hot Reloading

### Cargo Watch Configuration
```bash
# Watch for changes and restart
cargo watch -x run

# Watch specific files
cargo watch -w src -x run

# Clear screen on restart
cargo watch -c -x run

# Run tests on change
cargo watch -x test
```

### Custom Watch Script
```bash
# scripts/watch.sh
#!/bin/bash
cargo watch \
  --clear \
  --watch src \
  --watch Cargo.toml \
  --shell 'cargo run || echo "Build failed"'
```

## 📊 Performance Profiling

### Development Profiling
```bash
# Install profiling tools
cargo install flamegraph
cargo install cargo-profdata

# Generate flame graph
cargo flamegraph --bin pianorhythm

# Profile with perf (Linux)
perf record --call-graph=dwarf cargo run --release
perf report
```

## 🧪 Testing Setup

### Test Database Setup
```bash
# Create test database
docker run -d --name mongo-test -p 27018:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# Test environment variables
export MONGODB_URL_TEST=mongodb://admin:password@localhost:27018/pianorhythm_test
export REDIS_URL_TEST=redis://localhost:6380
```

### Running Specific Tests
```bash
# Run unit tests only
cargo test --lib

# Run integration tests
cargo test --test integration

# Run specific test
cargo test test_user_authentication

# Run tests with output
cargo test -- --nocapture

# Run tests in parallel
cargo test -- --test-threads=4
```

---

This development setup guide provides everything needed to get started with PianoRhythm Server development, from initial setup to advanced debugging and profiling techniques.
