---
id: api-documentation
title: API Documentation
description: API architecture, authentication, and general usage patterns for PianoRhythm Server
path: ['/community/development/technical-documentation/server/api']
keywords: ['api', 'rest', 'websocket', 'authentication', 'jwt', 'endpoints', 'integration', 'pianorhythm']
tags:
  - api
  - rest
  - websocket
  - authentication
  - jwt
  - endpoints
  - integration
  - server
---

# API Documentation

PianoRhythm Server provides both REST and WebSocket APIs for comprehensive client integration. This document covers the API architecture, authentication, and general usage patterns.

## 🔌 API Overview

### API Types
- **REST API** - HTTP endpoints for standard operations
- **WebSocket API** - Real-time bidirectional communication
- **GraphQL** - (Future) Flexible query interface

### Base URLs
- **Production**: `https://api.pianorhythm.io`
- **Staging**: `https://staging-api.pianorhythm.io`
- **Development**: `http://localhost:8080`

## 🔐 Authentication

### JWT Token Authentication
All authenticated endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Token Structure
```json
{
  "sub": "user_id",
  "username": "user123",
  "roles": ["member", "pro"],
  "exp": 1640995200,
  "iat": 1640908800
}
```

### Authentication Flow
1. **Login** - POST `/api/auth/login` with credentials
2. **Token Receipt** - Server returns JWT token
3. **Token Usage** - Include token in subsequent requests
4. **Token Refresh** - Use refresh token before expiration

### Role-Based Access Control
- **Guest** - Limited read-only access
- **Member** - Standard user features
- **Pro** - Premium features and rooms
- **Moderator** - Moderation capabilities
- **Admin** - Full system access

## 📡 REST API

### General Patterns

#### Request Format
```http
POST /api/endpoint
Content-Type: application/json
Authorization: Bearer <token>

{
  "parameter": "value"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "result": "data"
  },
  "message": "Operation completed successfully"
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "username",
      "issue": "Username already exists"
    }
  }
}
```

### Core Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout
- `GET /api/auth/validate-token` - Token validation

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/{user_id}` - Get public user info
- `POST /api/users/avatar` - Upload avatar image
- `GET /api/users/friends` - Get friends list

#### Rooms
- `GET /api/rooms` - List public rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/{room_id}` - Get room details
- `PUT /api/rooms/{room_id}` - Update room settings
- `DELETE /api/rooms/{room_id}` - Delete room

#### Billing (Pro Members)
- `GET /api/billing/products` - Available products
- `POST /api/billing/checkout` - Create checkout session
- `POST /api/billing/portal` - Customer portal access
- `POST /api/billing/cancel` - Cancel subscription

### Rate Limiting
- **General Endpoints**: 100 requests per minute
- **Authentication**: 10 requests per minute
- **File Uploads**: 5 requests per minute
- **Billing**: 20 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 🔄 WebSocket API

### Connection Establishment
```javascript
const ws = new WebSocket('wss://api.pianorhythm.io/api/websocket/{encrypted_payload}');
```

### Message Format
All WebSocket messages use Protocol Buffers for efficient serialization:

```protobuf
message ServerMessage {
  ServerMessageType messageType = 1;
  oneof message {
    CreateRoomCommand createRoomCommand = 2;
    JoinRoomCommand joinRoomCommand = 3;
    ChatMessage chatMessage = 4;
    MidiMessage midiMessage = 5;
    // ... other message types
  }
}
```

### Message Types
- **Room Management** - Create, join, leave rooms
- **Chat Messages** - Text communication
- **MIDI Messages** - Musical note data
- **User Commands** - Avatar, settings, etc.
- **System Messages** - Heartbeat, errors, notifications

### Connection Lifecycle
1. **Connection** - WebSocket established
2. **Authentication** - User credentials validated
3. **Session Start** - User session initialized
4. **Message Exchange** - Bidirectional communication
5. **Heartbeat** - Keep-alive mechanism
6. **Disconnection** - Graceful or unexpected closure

## 📊 Data Models

### User Model
```json
{
  "user_id": "uuid",
  "username": "string",
  "user_tag": "string",
  "email": "string",
  "roles": ["string"],
  "is_member": "boolean",
  "is_pro": "boolean",
  "avatar_url": "string",
  "created_at": "datetime",
  "last_seen": "datetime"
}
```

### Room Model
```json
{
  "room_id": "string",
  "room_name": "string",
  "room_owner": "string",
  "room_type": "public|private|pro",
  "max_users": "number",
  "current_users": "number",
  "has_password": "boolean",
  "created_at": "datetime",
  "settings": {
    "allow_chat": "boolean",
    "allow_guests": "boolean",
    "auto_moderation": "boolean"
  }
}
```

### Chat Message Model
```json
{
  "message_id": "string",
  "user_id": "string",
  "username": "string",
  "message": "string",
  "timestamp": "datetime",
  "message_type": "user|system|bot"
}
```

## 🔍 Error Handling

### HTTP Status Codes
- `200 OK` - Successful operation
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Categories
- **Validation Errors** - Invalid input data
- **Authentication Errors** - Login/token issues
- **Authorization Errors** - Permission denied
- **Resource Errors** - Not found or unavailable
- **Rate Limit Errors** - Too many requests
- **Server Errors** - Internal system issues

### Error Response Examples
```json
{
  "success": false,
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "The specified room does not exist",
    "details": {
      "room_id": "invalid_room_123"
    }
  }
}
```

## 📈 API Versioning

### Version Strategy
- **URL Versioning** - `/api/v1/endpoint`
- **Header Versioning** - `API-Version: v1`
- **Backward Compatibility** - Maintain previous versions

### Current Versions
- **v1** - Current stable version
- **v2** - (Future) Enhanced features

## 🔧 SDK and Libraries

### Official SDKs
- **JavaScript/TypeScript** - Web and Node.js
- **C#** - Unity and .NET applications
- **Python** - Server integrations
- **Rust** - High-performance clients

### Community Libraries
- **React Hooks** - React integration
- **Vue Composables** - Vue.js integration
- **Angular Services** - Angular integration

## 📊 API Monitoring

### Metrics Tracked
- **Request Volume** - Requests per second/minute
- **Response Times** - Average and percentile latencies
- **Error Rates** - Error percentage by endpoint
- **Authentication Success** - Login success rates

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Comprehensive system status
- `GET /metrics` - Prometheus metrics endpoint

## 🔮 Future API Features

### Planned Enhancements
- **GraphQL API** - Flexible query interface
- **Webhook Support** - Event notifications
- **Batch Operations** - Multiple operations in single request
- **Real-time Subscriptions** - Server-sent events

### API Evolution
- **Breaking Changes** - Communicated 90 days in advance
- **Deprecation Policy** - 6-month deprecation period
- **Migration Guides** - Detailed upgrade instructions

---

For detailed endpoint documentation, see:
- [REST Endpoints](./rest-endpoints)
- [WebSocket API](./websocket)
