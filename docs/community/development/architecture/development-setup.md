# Development Setup

This guide will help you set up a complete development environment for PianoRhythm, including all dependencies, tools, and configurations needed for frontend, backend, and core engine development.

## Prerequisites

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+ recommended)
- **Memory**: 8GB RAM minimum, 16GB recommended
- **Storage**: 10GB free space for dependencies and build artifacts
- **Network**: Stable internet connection for package downloads

### Required Software

#### 1. Node.js & Package Manager

```bash
# Install Node.js 19.2.0 or higher
# Download from: https://nodejs.org/

# Verify installation
node --version  # Should be 19.2.0+
npm --version   # Should be 9.0.0+

# Install pnpm (recommended package manager)
npm install -g pnpm@9.4.0

# Verify pnpm installation
pnpm --version  # Should be 9.4.0
```

#### 2. Rust Toolchain (for Core Development)

```bash
# Install Rust via rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install nightly toolchain (required for PianoRhythm core)
rustup install nightly
rustup default nightly

# Add WebAssembly target
rustup target add wasm32-unknown-unknown

# Verify installation
rustc --version  # Should include "nightly"
cargo --version
```

#### 3. wasm-bindgen CLI

```bash
# Install wasm-bindgen CLI
cargo install wasm-bindgen-cli

# Verify installation
wasm-bindgen --version
```

#### 4. Additional Tools

```bash
# Git (for version control)
git --version  # Should be 2.30.0+

# Protocol Buffers compiler (optional, for proto development)
# Windows: Download from https://github.com/protocolbuffers/protobuf/releases
# macOS: brew install protobuf
# Linux: sudo apt-get install protobuf-compiler

protoc --version  # Should be 3.20.0+
```

## Project Setup

### 1. Clone Repository

```bash
# Clone the main repository
git clone https://github.com/PianoRhythm/pianorhythm-ssr.git
cd pianorhythm-ssr

# Check repository structure
ls -la
# Should see: pianorhythm_core/, src/, package.json, etc.
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# This will install:
# - Frontend dependencies (SolidJS, Hope UI, etc.)
# - Development tools (Vitest, Cypress, TypeScript)
# - Build tools (Vinxi, Vite, etc.)
```

### 3. Build Core Engine

```bash
# Navigate to core directory
cd pianorhythm_core

# Build the Rust core for development
chmod +x ./build-core-wasm-debug.cmd
./build-core-wasm-debug.cmd

# Build the 3D renderer (optional)
chmod +x ./build-bevy-renderer-wasm-webgpu-debug.cmd
./build-bevy-renderer-wasm-webgpu-debug.cmd

# Return to project root
cd ..
```

### 4. Environment Configuration

Create environment files for different environments:

```bash
# Create .env.local for local development
cat > .env.local << EOF
NODE_ENV=local-dev
DEBUG=true
VITE_VERSION=0.10.0-dev
PIANORHYTHM_SERVER_URL=http://localhost:7000
PR_ASSETS_URL=http://localhost:3000
PIANORHYTHM_MONGODB_URI=mongodb://localhost:27017
EOF
```

## Development Workflow

### 1. Start Development Server

```bash
# Start the development server
pnpm run dev:local

# The application will be available at:
# http://localhost (port 80)
```

**Development Server Features:**
- Hot module replacement (HMR)
- TypeScript compilation
- SASS processing
- Protocol buffer compilation
- Source maps for debugging

### 2. Development Scripts

```bash
# Frontend development
pnpm run dev:local     # Local development with hot reload
pnpm run dev:dev       # Development environment

# Building
pnpm run build:production  # Production build
pnpm run build:staging     # Staging build

# Testing
pnpm test              # Run unit tests
pnpm test-watch        # Watch mode for tests
pnpm test-ui           # Visual test interface
pnpm cy:open           # Open Cypress for e2e tests

# Desktop app (Tauri)
pnpm run tauri:dev     # Desktop development
pnpm run tauri         # Tauri CLI commands
```

### 3. Core Engine Development

```bash
# Navigate to core directory
cd pianorhythm_core

# Development builds (faster compilation)
./build-core-wasm-debug.cmd      # Core engine debug build
./build-synth-wasm-release.cmd   # Audio synthesizer build

# Release builds (optimized)
./build-core-release.sh          # Core engine release build
./build-bevy-renderer-wasm-webgpu.sh  # 3D renderer build

# Run Rust tests
./run-tests.cmd

# Update Rust toolchain
./update_rust.cmd
./update_wasm_bindgen_cli.cmd
```

## IDE Configuration

### 1. Visual Studio Code (Recommended)

Install recommended extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "rust-lang.rust-analyzer",
    "ms-vscode.vscode-typescript-next",
    "solidjs.solid-js",
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

Workspace settings:

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "rust-analyzer.cargo.target": "wasm32-unknown-unknown",
  "rust-analyzer.checkOnSave.command": "clippy",
  "files.associations": {
    "*.proto": "proto3"
  }
}
```

### 2. TypeScript Configuration

The project uses strict TypeScript configuration:

```json
// tsconfig.json highlights
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "jsx": "preserve",
    "jsxImportSource": "solid-js"
  }
}
```

## Database Setup

### 1. MongoDB (Local Development)

```bash
# Install MongoDB Community Edition
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow official MongoDB installation guide

# Start MongoDB service
# Windows: Start as Windows service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"
```

### 2. Database Initialization

```bash
# The application will automatically create the database
# and collections on first run

# Optional: Import sample data
mongosh pianorhythm < scripts/sample-data.js
```

## Testing Setup

### 1. Unit Testing with Vitest

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test-watch

# Run tests with UI
pnpm test-ui

# Update test snapshots
pnpm test-update-snapshots

# Run tests with coverage
pnpm test -- --coverage
```

### 2. E2E Testing with Cypress

```bash
# Start test server
pnpm cy:vite

# Open Cypress test runner (in another terminal)
pnpm cy:open

# Run headless tests
pnpm cy:run
```

### 3. Test Configuration

Vitest configuration includes:

```typescript
// vitest.config.ts highlights
export default defineConfig({
  test: {
    globals: true,
    setupFiles: [
      '@vitest/web-worker',
      'fake-indexeddb/auto',
      './tests/vitest.setup.ts'
    ],
    exclude: [
      '**/pianorhythm_core/**',
      '**/cypress/**'
    ]
  }
});
```

## Debugging

### 1. Frontend Debugging

```typescript
// Enable debug logging
localStorage.setItem('debug', 'pianorhythm:*');

// Browser DevTools
// - Sources tab for breakpoints
// - Console for logs
// - Network tab for API calls
// - Application tab for storage
```

### 2. Core Engine Debugging

```bash
# Build debug version of core
cd pianorhythm_core
./build-core-wasm-debug.cmd

# Enable Rust logging in browser console
# Debug logs will appear in browser console
```

### 3. Server-Side Debugging

```bash
# Enable server debug logging
DEBUG=true pnpm run dev:local

# Node.js debugging
node --inspect-brk node_modules/.bin/vinxi dev
```

## Common Issues & Solutions

### 1. WASM Build Issues

```bash
# Clear WASM build cache
cd pianorhythm_core
rm -rf target/
rm -rf pkg/

# Rebuild from scratch
./build-core-wasm-debug.cmd
```

### 2. Node.js Memory Issues

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm run dev:local
```

### 3. Port Conflicts

```bash
# Check what's using port 80
# Windows: netstat -ano | findstr :80
# macOS/Linux: lsof -i :80

# Use different port
pnpm run dev:local -- --port 3000
```

### 4. Package Installation Issues

```bash
# Clear package cache
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules
pnpm install
```

## Performance Optimization

### 1. Development Build Performance

```bash
# Use faster TypeScript compilation
export TSC_COMPILE_ON_ERROR=true

# Skip type checking during development
export SKIP_TYPE_CHECK=true
```

### 2. Hot Reload Optimization

```typescript
// Exclude heavy modules from HMR
// vite.config.ts
export default defineConfig({
  server: {
    watch: {
      ignored: [
        '**/pianorhythm_core/**',
        '**/node_modules/**'
      ]
    }
  }
});
```

## Next Steps

### For New Developers

1. **Read Architecture Overview**: Start with [Architecture Overview](architecture-overview.md)
2. **Understand Frontend**: Review [Frontend Architecture](frontend-architecture.md)
3. **Learn Testing**: Follow [Testing Guide](testing-guide.md)
4. **Explore Core Engine**: Study [Core Business Logic](core-business-logic.md)

### For Contributors

1. **Follow Coding Standards**: Use ESLint and Prettier configurations
2. **Write Tests**: Add tests for new features
3. **Update Documentation**: Keep docs current with code changes
4. **Test Across Platforms**: Verify changes work on different OS/browsers

### Useful Resources

- **SolidJS Documentation**: https://solidjs.com/docs
- **Rust Book**: https://doc.rust-lang.org/book/
- **WebAssembly Guide**: https://rustwasm.github.io/docs/book/
- **Bevy Engine**: https://bevyengine.org/learn/
- **Protocol Buffers**: https://developers.google.com/protocol-buffers

## Support

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Discord**: Join the community for real-time help
- **Documentation**: Comprehensive guides in the `docs/` folder
