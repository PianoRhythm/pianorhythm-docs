---
id: environment-configuration-guide
title: Environment Configuration Guide
description: Configuration management, environment variables, and secrets for all deployment scenarios
path: ['/community/development/technical-documentation/server/deployment/environment']
keywords: ['environment', 'configuration', 'variables', 'secrets', 'settings', 'deployment', 'security', 'pianorhythm']
tags:
  - environment
  - configuration
  - variables
  - secrets
  - settings
  - deployment
  - security
  - devops
---

# Environment Configuration Guide

This guide covers all environment variables, configuration files, and deployment-specific settings for PianoRhythm Server across different environments.

## 🔧 Environment Variables

### Core Application Settings

#### Server Configuration
```bash
# Server identification and basic settings
SERVER_NAME=production                    # Server instance name
RUST_LOG=info                            # Logging level (error, warn, info, debug, trace)
PORT=8080                                # HTTP server port
HOST=0.0.0.0                            # Bind address

# Performance settings
MAX_CONNECTIONS=1000                     # Maximum concurrent connections
HEARTBEAT_INTERVAL=30s                   # WebSocket heartbeat interval
HEARTBEAT_TIMEOUT=60s                    # WebSocket timeout
```

#### Database Configuration
```bash
# MongoDB settings
MONGODB_URL=mongodb://localhost:27017/pianorhythm
MONGODB_DB=pianorhythm
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
MONGODB_CONNECT_TIMEOUT=10s
MONGODB_SERVER_SELECTION_TIMEOUT=30s

# Redis settings
REDIS_URL=redis://localhost:6379
REDIS_PREFIX=pianorhythm
REDIS_POOL_SIZE=20
REDIS_TIMEOUT=5s
REDIS_RETRY_ATTEMPTS=3
```

#### Authentication & Security
```bash
# JWT configuration
JWT_SECRET=your-super-secret-jwt-signing-key
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Session configuration
SESSION_SECRET=your-session-secret-key
SESSION_TIMEOUT=24h
COOKIE_SECURE=true                       # HTTPS only cookies
COOKIE_SAME_SITE=strict                  # CSRF protection
```

### External Service Integration

#### Stripe Billing
```bash
# Stripe configuration
STRIPE_SECRET_KEY=sk_live_...            # Live secret key
STRIPE_PUBLISHABLE_KEY=pk_live_...       # Live publishable key
STRIPE_WEBHOOK_SECRET=whsec_...          # Webhook endpoint secret
STRIPE_SUCCESS_URL=https://app.pianorhythm.io/success
STRIPE_CANCEL_URL=https://app.pianorhythm.io/cancel
```

#### Discord Integration
```bash
# Discord bot configuration
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-discord-server-id
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

#### Email Service
```bash
# SMTP configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_ADDRESS=noreply@pianorhythm.io
SMTP_FROM_NAME=PianoRhythm
```

#### Cloud Storage (AWS S3)
```bash
# S3 configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=pianorhythm-assets
S3_PUBLIC_URL=https://assets.pianorhythm.io
```

### Monitoring & Observability

#### Sentry Error Tracking
```bash
# Sentry configuration
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=v0.2.0
SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### Structured Logging (Seq)
```bash
# Seq logging configuration
SEQ_URL=http://localhost:5341
SEQ_API_KEY=your-seq-api-key
LOG_LEVEL=info
LOG_FORMAT=json                          # json or text
```

#### Prometheus Metrics
```bash
# Metrics configuration
METRICS_ENABLED=true
METRICS_PORT=9090
METRICS_PATH=/metrics
```

## 🌍 Environment-Specific Configurations

### Development Environment
```bash
# .env.development
RUST_LOG=debug
SERVER_NAME=development
MONGODB_URL=mongodb://localhost:27017/pianorhythm_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-not-for-production
STRIPE_SECRET_KEY=sk_test_...
COOKIE_SECURE=false
SENTRY_ENVIRONMENT=development
```

### Staging Environment
```bash
# .env.staging
RUST_LOG=info
SERVER_NAME=staging
MONGODB_URL=mongodb://mongo-staging:27017/pianorhythm
REDIS_URL=redis://redis-staging:6379
JWT_SECRET=${JWT_SECRET_STAGING}
STRIPE_SECRET_KEY=sk_test_...
COOKIE_SECURE=true
SENTRY_ENVIRONMENT=staging
```

### Production Environment
```bash
# .env.production
RUST_LOG=warn
SERVER_NAME=production
MONGODB_URL=${MONGODB_URL_PROD}
REDIS_URL=${REDIS_URL_PROD}
JWT_SECRET=${JWT_SECRET_PROD}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY_PROD}
COOKIE_SECURE=true
SENTRY_ENVIRONMENT=production
```

## 📁 Configuration Files

### Application Configuration (app.toml)
```toml
[server]
name = "pianorhythm-server"
version = "0.2.0"
port = 8080
host = "0.0.0.0"

[database]
mongodb_url = "mongodb://localhost:27017/pianorhythm"
redis_url = "redis://localhost:6379"

[auth]
jwt_expiration = "24h"
session_timeout = "24h"

[features]
enable_analytics = true
enable_billing = true
enable_discord = true

[limits]
max_connections = 1000
max_room_users = 50
max_message_length = 500
rate_limit_requests = 100
rate_limit_window = "1m"

[logging]
level = "info"
format = "json"
```

### Logging Configuration (logging.toml)
```toml
[appenders.stdout]
kind = "console"
encoder = "json"

[appenders.file]
kind = "file"
path = "logs/pianorhythm.log"
encoder = "json"

[appenders.seq]
kind = "seq"
url = "http://localhost:5341"
api_key = "${SEQ_API_KEY}"

[root]
level = "info"
appenders = ["stdout", "file", "seq"]

[loggers."pianorhythm::websocket"]
level = "debug"
additive = false
appenders = ["stdout"]
```

## 🐳 Docker Environment Configuration

### Docker Compose Environment
```yaml
# docker-compose.yml
version: '3.8'

services:
  pianorhythm-server:
    environment:
      - RUST_LOG=${RUST_LOG:-info}
      - SERVER_NAME=${SERVER_NAME:-docker}
      - MONGODB_URL=mongodb://mongo:27017/pianorhythm
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    env_file:
      - .env
```

### Kubernetes ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: pianorhythm-config
data:
  RUST_LOG: "info"
  SERVER_NAME: "kubernetes"
  HEARTBEAT_INTERVAL: "30s"
  MAX_CONNECTIONS: "1000"
  app.toml: |
    [server]
    name = "kubernetes"
    port = 8080
```

### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: pianorhythm-secrets
type: Opaque
data:
  JWT_SECRET: <base64-encoded-secret>
  MONGODB_URL: <base64-encoded-url>
  STRIPE_SECRET_KEY: <base64-encoded-key>
  SENTRY_DSN: <base64-encoded-dsn>
```

## 🔒 Security Configuration

### TLS/SSL Configuration
```bash
# TLS settings
TLS_CERT_PATH=/etc/ssl/certs/server.crt
TLS_KEY_PATH=/etc/ssl/private/server.key
TLS_MIN_VERSION=1.2
TLS_CIPHER_SUITES=ECDHE-RSA-AES256-GCM-SHA384,ECDHE-RSA-AES128-GCM-SHA256

# CORS settings
CORS_ALLOWED_ORIGINS=https://app.pianorhythm.io,https://pianorhythm.io
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Authorization,Content-Type,X-Requested-With
CORS_MAX_AGE=3600
```

### Rate Limiting Configuration
```bash
# Rate limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_BURST=20
RATE_LIMIT_WHITELIST=127.0.0.1,::1

# API-specific rate limits
AUTH_RATE_LIMIT=10                       # Login attempts per minute
UPLOAD_RATE_LIMIT=5                      # File uploads per minute
WEBSOCKET_RATE_LIMIT=1000               # Messages per minute
```

## 🔧 Configuration Validation

### Environment Validation Script
```bash
#!/bin/bash
# validate-env.sh

required_vars=(
    "JWT_SECRET"
    "MONGODB_URL"
    "REDIS_URL"
    "SERVER_NAME"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var is not set"
        exit 1
    fi
done

echo "All required environment variables are set"
```

### Configuration Testing
```rust
// src/config/validation.rs
pub fn validate_config() -> Result<(), ConfigError> {
    // Validate JWT secret length
    if env::var("JWT_SECRET")?.len() < 32 {
        return Err(ConfigError::InvalidJwtSecret);
    }
    
    // Validate database connections
    test_mongodb_connection()?;
    test_redis_connection()?;
    
    // Validate external services
    if env::var("STRIPE_SECRET_KEY")?.starts_with("sk_live_") {
        validate_stripe_connection()?;
    }
    
    Ok(())
}
```

## 📊 Configuration Management Best Practices

### Secret Management
1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive data
3. **Rotate secrets regularly** (JWT, API keys, passwords)
4. **Use secret management tools** (HashiCorp Vault, AWS Secrets Manager)

### Environment Separation
1. **Separate configurations** for each environment
2. **Use different databases** for dev/staging/prod
3. **Different API keys** for external services
4. **Environment-specific logging levels**

### Configuration Deployment
1. **Validate configuration** before deployment
2. **Use configuration templates** for consistency
3. **Document all configuration options**
4. **Monitor configuration changes**

---

This environment configuration guide ensures proper setup and security across all deployment scenarios for PianoRhythm Server.
