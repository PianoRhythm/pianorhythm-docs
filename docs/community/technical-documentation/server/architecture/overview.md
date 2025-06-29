# Architecture Overview

PianoRhythm Server is designed as a high-performance, real-time multiplayer gaming server built with modern Rust technologies. This document provides a comprehensive overview of the system architecture, design principles, and key components.

## 🎯 Design Principles

### Real-time First
- **Low-latency communication** through WebSocket connections
- **Event-driven architecture** for immediate response to user actions
- **Optimized message serialization** using Protocol Buffers

### Scalability
- **Horizontal scaling** through stateless server instances
- **Actor-based concurrency** for efficient resource utilization
- **Distributed state management** using Redis clustering

### Reliability
- **Fault tolerance** through supervisor patterns
- **Graceful degradation** when external services are unavailable
- **Comprehensive error handling** and recovery mechanisms

### Performance
- **Zero-copy operations** where possible
- **Connection pooling** for database and cache connections
- **Efficient memory management** with Rust's ownership system

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Load Balancer │    │   Load Balancer │
│    (Ingress)    │    │    (Ingress)    │    │    (Ingress)    │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Server Instance │    │ Server Instance │    │ Server Instance │
│      (Pod)      │    │      (Pod)      │    │      (Pod)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────┬───────────┴──────────┬───────────┘
                     │                      │
                     ▼                      ▼
           ┌─────────────────┐    ┌─────────────────┐
           │  Redis Cluster  │    │ MongoDB Cluster │
           │   (State/Cache) │    │  (Persistence)  │
           └─────────────────┘    └─────────────────┘
```

## 🔧 Core Components

### 1. Web Server Layer (Actix Web)
- **HTTP/HTTPS endpoints** for REST API
- **WebSocket upgrade handling** for real-time connections
- **Middleware stack** for authentication, CORS, rate limiting
- **Static file serving** for assets and documentation

### 2. Actor System (Actix)
The server uses an actor-based architecture for concurrent processing:

#### Core Actors
- **`PianoRhythmState`** - Central state management actor
- **`UserManager`** - User session and authentication management
- **`RoomManager`** - Room lifecycle and user assignment
- **`ConnectionManager`** - WebSocket connection handling

#### Specialized Actors
- **`AnalyticsTracker`** - Event tracking and metrics collection
- **`UserStatsTracker`** - User statistics and achievements
- **`SheetMusicStatsTracker`** - Music performance analytics
- **`StatusPageMonitor`** - System health monitoring
- **`SentryActor`** - Error reporting and alerting
- **`SeqLoggerActor`** - Structured logging aggregation

### 3. State Management Layer
- **Redis** - Primary state store for real-time data
- **MongoDB** - Persistent storage for user data, rooms, and history
- **In-memory caches** - Hot data caching for performance

### 4. Communication Layer
- **WebSocket Protocol** - Real-time bidirectional communication
- **Protocol Buffers** - Efficient binary message serialization
- **Redis Pub/Sub** - Inter-server messaging for scaling

## 📊 Data Flow Architecture

### Client Connection Flow
```
Client → Load Balancer → Server Instance → WebSocket Handler → Actor System
```

### Message Processing Flow
```
WebSocket Message → Deserialization → Actor Routing → Business Logic → State Update → Response
```

### State Synchronization Flow
```
State Change → Redis Update → Pub/Sub Notification → Other Instances → Client Updates
```

## 🔐 Security Architecture

### Authentication Layer
- **JWT tokens** with Ed25519 signatures
- **Session management** with secure cookies
- **OAuth2 integration** for third-party authentication

### Authorization Layer
- **Role-based access control** (RBAC)
- **Resource-level permissions** for rooms and features
- **Rate limiting** per user and endpoint

### Data Protection
- **Input validation** and sanitization
- **SQL injection prevention** through parameterized queries
- **XSS protection** through content security policies

## 🚀 Performance Characteristics

### Concurrency Model
- **Async/await** throughout the application
- **Actor isolation** prevents shared mutable state
- **Connection pooling** for database and Redis connections

### Memory Management
- **Zero-copy operations** for message passing
- **Efficient serialization** with Protocol Buffers
- **Automatic memory management** through Rust's ownership system

### Scalability Metrics
- **Horizontal scaling** - Add more server instances
- **Vertical scaling** - Increase resources per instance
- **Database scaling** - MongoDB sharding and Redis clustering

## 🔄 Event-Driven Architecture

### Event Types
- **User Events** - Login, logout, profile updates
- **Room Events** - Creation, updates, user joins/leaves
- **Game Events** - MIDI messages, chat messages, commands
- **System Events** - Health checks, metrics, alerts

### Event Processing
1. **Event Reception** - WebSocket or HTTP endpoint
2. **Validation** - Input validation and authentication
3. **Actor Routing** - Message sent to appropriate actor
4. **Business Logic** - Event processing and state updates
5. **State Persistence** - Updates saved to Redis/MongoDB
6. **Notification** - Other clients notified of changes

## 🔧 Configuration Management

### Environment-Based Configuration
- **Development** - Local development settings
- **Staging** - Pre-production testing environment
- **Production** - Live production configuration

### Configuration Sources
- **Environment variables** - Runtime configuration
- **Configuration files** - Static application settings
- **Kubernetes ConfigMaps** - Container orchestration config
- **Kubernetes Secrets** - Sensitive configuration data

## 📈 Monitoring and Observability

### Metrics Collection
- **Prometheus metrics** - Performance and business metrics
- **Custom metrics** - Application-specific measurements
- **System metrics** - CPU, memory, network usage

### Logging Strategy
- **Structured logging** - JSON-formatted log entries
- **Log levels** - Debug, info, warn, error categorization
- **Centralized logging** - Seq aggregation and analysis

### Error Tracking
- **Sentry integration** - Automatic error reporting
- **Error context** - Rich error information and stack traces
- **Performance monitoring** - Transaction tracing and profiling

## 🔮 Future Architecture Considerations

### Microservices Evolution
- **Service decomposition** - Breaking monolith into services
- **API gateway** - Centralized API management
- **Service mesh** - Inter-service communication

### Advanced Scaling
- **Auto-scaling** - Dynamic resource allocation
- **Multi-region deployment** - Global distribution
- **Edge computing** - Reduced latency through edge nodes

### Technology Evolution
- **WebAssembly** - Client-side performance improvements
- **GraphQL** - More flexible API queries
- **Event sourcing** - Complete event history tracking

---

This architecture provides a solid foundation for a scalable, real-time multiplayer gaming platform while maintaining flexibility for future enhancements and optimizations.
