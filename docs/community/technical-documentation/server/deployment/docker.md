---
id: docker-deployment-guide
title: Docker Deployment Guide
description: Containerized deployment with Docker and Docker Compose for PianoRhythm Server
path: ['/community/development/technical-documentation/server/deployment/docker']
keywords: ['docker', 'containers', 'deployment', 'docker-compose', 'containerization', 'orchestration', 'pianorhythm']
tags:
  - docker
  - containers
  - deployment
  - docker-compose
  - containerization
  - orchestration
  - devops
---

# Docker Deployment Guide

This guide covers deploying PianoRhythm Server using Docker containers, including single-container deployment and multi-container orchestration with Docker Compose.

## 🐳 Docker Overview

### Container Architecture
- **Application Container** - PianoRhythm Server binary
- **Redis Container** - State management and caching
- **MongoDB Container** - Persistent data storage
- **Nginx Container** - Reverse proxy and load balancing

### Image Information
- **Base Image**: `rust:1.77-slim` (build stage)
- **Runtime Image**: `debian:bookworm-slim`
- **Final Size**: ~50MB (optimized)
- **Architecture**: Multi-arch (amd64, arm64)

## 🏗️ Building the Docker Image

### Using the Dockerfile
```bash
# Build the image
docker build -t pianorhythm-server:latest .

# Build with specific tag
docker build -t pianorhythm-server:v0.2.0 .

# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t pianorhythm-server:latest .
```

### Multi-stage Build Process
The Dockerfile uses multi-stage builds for optimization:

1. **Build Stage** - Compile Rust application
2. **Runtime Stage** - Create minimal runtime image
3. **Final Stage** - Copy binary and set up runtime environment

### Build Arguments
```bash
# Custom build arguments
docker build \
  --build-arg RUST_VERSION=1.77 \
  --build-arg BUILD_MODE=release \
  -t pianorhythm-server:latest .
```

## 🚀 Single Container Deployment

### Basic Container Run
```bash
# Run with environment variables
docker run -d \
  --name pianorhythm-server \
  -p 8080:8080 \
  -e REDIS_URL=redis://redis:6379 \
  -e MONGODB_URL=mongodb://mongo:27017/pianorhythm \
  -e JWT_SECRET=your-secret-key \
  pianorhythm-server:latest
```

### With Volume Mounts
```bash
# Mount configuration and logs
docker run -d \
  --name pianorhythm-server \
  -p 8080:8080 \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/secrets:/app/secrets \
  pianorhythm-server:latest
```

### Environment Variables
```bash
# Complete environment setup
docker run -d \
  --name pianorhythm-server \
  -p 8080:8080 \
  -e RUST_LOG=info \
  -e SERVER_NAME=production \
  -e REDIS_URL=redis://redis:6379 \
  -e MONGODB_URL=mongodb://mongo:27017/pianorhythm \
  -e JWT_SECRET=your-jwt-secret \
  -e STRIPE_SECRET_KEY=sk_live_... \
  -e SENTRY_DSN=https://...@sentry.io/... \
  pianorhythm-server:latest
```

## 🐙 Docker Compose Deployment

### Basic Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  pianorhythm-server:
    build: .
    ports:
      - "8080:8080"
    environment:
      - RUST_LOG=info
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://mongo:27017/pianorhythm
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - redis
      - mongo
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE=pianorhythm
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  redis_data:
  mongo_data:
```

### Production Docker Compose
Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - pianorhythm-server
    restart: unless-stopped

  pianorhythm-server:
    image: pianorhythm-server:latest
    expose:
      - "8080"
    environment:
      - RUST_LOG=warn
      - SERVER_NAME=production
      - REDIS_URL=redis://redis:6379
      - MONGODB_URL=mongodb://mongo:27017/pianorhythm
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      - redis
      - mongo
    restart: unless-stopped
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  mongo:
    image: mongo:7
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
      - MONGO_INITDB_DATABASE=pianorhythm
    volumes:
      - mongo_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    restart: unless-stopped

volumes:
  redis_data:
  mongo_data:
```

### Environment File (.env)
```bash
# Database
MONGO_PASSWORD=secure_mongo_password
REDIS_PASSWORD=secure_redis_password

# Application
JWT_SECRET=your-super-secret-jwt-key
SERVER_NAME=production

# External Services
STRIPE_SECRET_KEY=sk_live_...
SENTRY_DSN=https://...@sentry.io/...
DISCORD_BOT_TOKEN=...

# Logging
SEQ_URL=http://seq:5341
```

## 🔧 Configuration Management

### Configuration Files
Mount configuration files as volumes:

```yaml
volumes:
  - ./config/app.toml:/app/config/app.toml:ro
  - ./config/logging.toml:/app/config/logging.toml:ro
```

### Secrets Management
Use Docker secrets for sensitive data:

```yaml
secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
  stripe_key:
    file: ./secrets/stripe_key.txt

services:
  pianorhythm-server:
    secrets:
      - jwt_secret
      - stripe_key
```

### Health Checks
```yaml
services:
  pianorhythm-server:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 📊 Monitoring and Logging

### Logging Configuration
```yaml
services:
  pianorhythm-server:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Centralized logging with Seq
  seq:
    image: datalust/seq:latest
    ports:
      - "5341:80"
    environment:
      - ACCEPT_EULA=Y
    volumes:
      - seq_data:/data
```

### Monitoring Stack
```yaml
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
```

## 🔒 Security Considerations

### Network Security
```yaml
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true

services:
  nginx:
    networks:
      - frontend
      - backend
  
  pianorhythm-server:
    networks:
      - backend
```

### Resource Limits
```yaml
services:
  pianorhythm-server:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### User Security
```dockerfile
# In Dockerfile
RUN addgroup --system --gid 1001 pianorhythm
RUN adduser --system --uid 1001 --gid 1001 pianorhythm
USER pianorhythm
```

## 🚀 Deployment Commands

### Development Deployment
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f pianorhythm-server

# Stop environment
docker-compose down
```

### Production Deployment
```bash
# Deploy production stack
docker-compose -f docker-compose.prod.yml up -d

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale pianorhythm-server=3

# Rolling update
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d --no-deps pianorhythm-server
```

### Maintenance Commands
```bash
# Backup data
docker run --rm -v mongo_data:/data -v $(pwd):/backup mongo:7 \
  mongodump --host mongo --out /backup/mongo-backup

# Restore data
docker run --rm -v mongo_data:/data -v $(pwd):/backup mongo:7 \
  mongorestore --host mongo /backup/mongo-backup

# Clean up
docker system prune -a
docker volume prune
```

---

This Docker deployment guide provides a solid foundation for containerized deployment of PianoRhythm Server in both development and production environments.
