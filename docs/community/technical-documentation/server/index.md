# PianoRhythm Server Documentation

Welcome to the comprehensive technical documentation for PianoRhythm Server. This documentation covers all aspects of the server architecture, APIs, deployment, and development.

## 📖 Documentation Structure

### 🏗️ Architecture
Understanding the system design and core components:

- **[Overview](./architecture/overview.md)** - High-level system architecture and design principles
- **[Actor System](./architecture/actors.md)** - Detailed actor system documentation
- **[State Management](./architecture/state-management.md)** - Redis-based state management and caching

### 🔌 API Reference
Complete API documentation for integration:

- **[API Overview](./api/README.md)** - API architecture and authentication
- **[WebSocket API](./api/websocket.md)** - Real-time WebSocket communication
- **[REST Endpoints](./api/rest-endpoints.md)** - HTTP REST API reference

### 🚀 Deployment
Production deployment and operations:

- **[Docker Deployment](./deployment/docker.md)** - Containerized deployment with Docker
- **[Kubernetes Deployment](./deployment/kubernetes.md)** - Scalable Kubernetes deployment
- **[Environment Configuration](./deployment/environment.md)** - Configuration management and secrets

### 💻 Development
Development guides and best practices:

- **[Development Setup](./development/setup.md)** - Local development environment setup
- **[Testing Guide](./development/testing.md)** - Testing strategies and tools
- **[Contributing Guidelines](./development/contributing.md)** - Code standards and contribution workflow

## 🎯 Quick Navigation

### For New Developers
1. Start with [Architecture Overview](./architecture/overview.md) to understand the system
2. Follow [Development Setup](./development/setup.md) to get your environment ready
3. Review [API Overview](./api/README.md) to understand the interfaces
4. Check [Testing Guide](./development/testing.md) to run and write tests

### For DevOps Engineers
1. Review [Docker Deployment](./deployment/docker.md) for containerization
2. Study [Kubernetes Deployment](./deployment/kubernetes.md) for orchestration
3. Configure [Environment Variables](./deployment/environment.md) for your setup

### For API Consumers
1. Start with [API Overview](./api/README.md) for authentication and general concepts
2. Reference [REST Endpoints](./api/rest-endpoints.md) for HTTP APIs
3. Study [WebSocket API](./api/websocket.md) for real-time features

### For System Architects
1. Deep dive into [Architecture Overview](./architecture/overview.md)
2. Understand [Actor System](./architecture/actors.md) design patterns
3. Review [State Management](./architecture/state-management.md) strategies

## 🔍 Key Concepts

### Real-time Architecture
The server is built around real-time communication using:
- **WebSocket connections** for low-latency client communication
- **Actor-based messaging** for scalable concurrent processing
- **Redis pub/sub** for distributed messaging across server instances

### Scalability Design
- **Horizontal scaling** through stateless server instances
- **Redis clustering** for distributed state management
- **Kubernetes orchestration** for container management
- **Load balancing** for traffic distribution

### Security Model
- **JWT authentication** with Ed25519 signatures
- **Role-based authorization** (Guest, Member, Pro, Moderator, Admin)
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization

## 📊 Monitoring and Observability

The server includes comprehensive monitoring:
- **Prometheus metrics** for performance monitoring
- **Structured logging** with JSON format
- **Sentry integration** for error tracking
- **Health check endpoints** for load balancers

## 🛠️ Development Tools

Key tools and technologies used:
- **Rust** - Systems programming language
- **Actix Web** - High-performance web framework
- **Redis** - In-memory data structure store
- **MongoDB** - Document database
- **Protobuf** - Binary serialization
- **Docker** - Containerization
- **Kubernetes** - Container orchestration

## 📝 Documentation Standards

This documentation follows these principles:
- **Comprehensive** - Covers all aspects of the system
- **Up-to-date** - Maintained alongside code changes
- **Practical** - Includes working examples and code snippets
- **Accessible** - Written for different skill levels and roles

## 🔄 Keeping Documentation Updated

When making changes to the server:
1. Update relevant documentation files
2. Add new sections for new features
3. Update API documentation for interface changes
4. Review and update deployment guides as needed

## 📞 Getting Help

If you can't find what you're looking for:
1. Check the specific section most relevant to your needs
2. Search through the documentation using your browser's find function
3. Create an issue on GitHub for documentation improvements
4. Ask questions in the development Discord channel

---

*This documentation is maintained by the PianoRhythm development team and updated regularly to reflect the current state of the system.*
