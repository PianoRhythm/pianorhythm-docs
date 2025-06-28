---
id: architecture
title: Architecture
path: ['/architecture']
---

# PianoRhythm Technical Documentation

Welcome to the comprehensive technical documentation for PianoRhythm, a multiplayer social web application for real-time musical collaboration.

## 📚 Documentation Index

### Core Architecture
- **[Architecture Overview](architecture-overview.md)** - High-level system design and component relationships
- **[Core Business Logic](core-business-logic.md)** - pianorhythm_core Rust engine documentation
- **[Initialization System](initialization-system.md)** - Dependency-based startup architecture

### Frontend Development
- **[Frontend Architecture](frontend-architecture.md)** - SolidJS components, services, and state management
- **[Audio System](audio-system.md)** - Audio synthesis, WebAudio API, and audio processing
- **[UI Components](./ui-components.md)** - Hope UI components and styling system

### Backend & Infrastructure
- **[SSR Implementation](ssr-implementation.md)** - Server-side rendering with Vinxi and SolidJS
- **[Backend Services](backend-services.md)** - API endpoints, database, and authentication
- **[WebSocket Communication](websocket-communication.md)** - Real-time communication architecture

### Development & Operations
- **[Development Setup](development-setup.md)** - Local development environment and build processes
- **[Testing Guide](testing-guide.md)** - Unit tests, integration tests, and e2e testing
- **[Deployment Guide](deployment-guide.md)** - Production deployment and CI/CD
- **[Build System](build-system.md)** - Vinxi configuration and build processes

### Specialized Topics
- **[3D Rendering](./3d-rendering.md)** - Bevy Engine integration and WebGPU/WebGL2
- **[MIDI Integration](./midi-integration.md)** - Web MIDI API and device handling
- **[Protocol Buffers](./protocol-buffers.md)** - Message serialization and communication
- **[Desktop Application](./desktop-application.md)** - Tauri-based native wrapper

## 🚀 Quick Start

For new developers joining the project:

1. **Start with [Development Setup](development-setup.md)** to get your environment ready
2. **Read [Architecture Overview](architecture-overview.md)** to understand the system design
3. **Follow [Frontend Architecture](frontend-architecture.md)** to understand the SolidJS structure
4. **Review [Testing Guide](testing-guide.md)** to understand our testing practices

## 🔧 Key Technologies

- **Frontend**: SolidJS, TypeScript, Hope UI, Vinxi
- **Backend**: Bun/Node.js, MongoDB, WebSockets
- **Core Engine**: Rust, WebAssembly, Protocol Buffers
- **3D Rendering**: Bevy Engine, WebGPU/WebGL2
- **Audio**: Custom Rust synthesizer, Web Audio API
- **Testing**: Vitest, Solid Testing Library, Cypress
- **Deployment**: GitHub Pages, Docker, DigitalOcean

## 📖 Documentation Guidelines

When contributing to documentation:

1. **Keep it current** - Update docs when making code changes
2. **Use examples** - Include code snippets and practical examples
3. **Be comprehensive** - Cover both happy path and edge cases
4. **Link related topics** - Cross-reference related documentation
5. **Include diagrams** - Use Mermaid diagrams for complex flows

## 🤝 Contributing

See our main [Contributing Guide](../README.md#contributing) for general contribution guidelines.

For documentation-specific contributions:
- Follow the existing structure and formatting
- Test code examples before including them
- Update the index when adding new documentation files
- Use clear, concise language suitable for developers of all levels

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/PianoRhythm/pianorhythm-ssr/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PianoRhythm/pianorhythm-ssr/discussions)
- **Main Site**: [pianorhythm.io](https://pianorhythm.io)

---

**Last Updated**: 2025-06-28
