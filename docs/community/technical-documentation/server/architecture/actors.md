---
id: actor-system-architecture
title: Actor System Architecture
description: Detailed actor system documentation with message flows and supervision strategies
path: ['/community/development/technical-documentation/server/architecture/actors']
keywords: ['actors', 'actix', 'concurrency', 'message-passing', 'supervision', 'rust', 'pianorhythm']
tags:
  - actors
  - actix
  - concurrency
  - message-passing
  - supervision
  - rust
  - server
---

# Actor System Architecture

PianoRhythm Server uses the Actix actor framework to implement a robust, concurrent, and scalable architecture. This document details the actor system design, individual actors, and their interactions.

## 🎭 Actor Model Overview

### Core Principles
- **Message Passing** - Actors communicate exclusively through messages
- **Isolation** - Each actor has its own state and memory space
- **Supervision** - Actors can supervise and restart child actors
- **Location Transparency** - Actors can be local or distributed

### Benefits
- **Concurrency** - Natural concurrent processing without locks
- **Fault Tolerance** - Actor failures don't affect other actors
- **Scalability** - Easy to distribute across multiple threads/machines
- **Maintainability** - Clear separation of concerns

## 🏗️ Actor Hierarchy

```
System
├── PianoRhythmState (Central State Manager)
├── UserManager (User Session Management)
├── RoomManager (Room Lifecycle Management)
├── ConnectionManager (WebSocket Connections)
├── Analytics Actors
│   ├── AnalyticsTracker
│   ├── UserStatsTracker
│   └── SheetMusicStatsTracker
├── Monitoring Actors
│   ├── StatusPageMonitor
│   ├── SentryActor
│   └── SeqLoggerActor
└── Utility Actors
    ├── SearchProviderAPI
    └── GhostActorTracker
```

## 🎯 Core Actors

### PianoRhythmState
**Purpose**: Central state management and Redis operations

**Responsibilities**:
- User state management (online status, room assignments)
- Room state management (room data, user lists, settings)
- Chat message storage and retrieval
- Friend relationships and social features
- Server-wide configuration and settings

**Key Messages**:
- `GetUser(socket_id)` - Retrieve user information
- `SaveUser(user_dbo)` - Persist user data
- `AddUserToRoom(room_id, socket_id)` - Room assignment
- `SaveChatMessage(room_id, message)` - Chat persistence

**State Storage**:
- Redis for real-time data and caching
- MongoDB for persistent data backup

### UserManager
**Purpose**: User authentication, session management, and lifecycle

**Responsibilities**:
- User authentication and JWT validation
- Session creation and management
- User profile updates
- Friend request processing
- User role and permission management

**Key Messages**:
- `AuthenticateUser(credentials)` - User login
- `UpdateUserProfile(user_id, profile_data)` - Profile updates
- `ProcessFriendRequest(from_user, to_user)` - Social features
- `ValidateUserPermissions(user_id, action)` - Authorization

**Integration Points**:
- MongoDB Users Service for persistent data
- JWT token validation and generation
- OAuth2 providers (Discord, etc.)

### RoomManager
**Purpose**: Room lifecycle management and user assignment

**Responsibilities**:
- Room creation and deletion
- User joining and leaving rooms
- Room settings and configuration
- Room password validation
- Room type enforcement (public, private, pro-only)

**Key Messages**:
- `CreateRoom(room_settings)` - New room creation
- `JoinRoom(user_id, room_id, password)` - User room entry
- `LeaveRoom(user_id, room_id)` - User room exit
- `UpdateRoomSettings(room_id, settings)` - Room configuration

**Business Logic**:
- Room capacity limits
- Pro membership validation
- Password protection
- Maintenance mode handling

### ConnectionManager
**Purpose**: WebSocket connection lifecycle and message routing

**Responsibilities**:
- WebSocket connection establishment
- Message serialization/deserialization
- Connection health monitoring
- Message routing to appropriate actors
- Connection cleanup on disconnect

**Key Messages**:
- `NewConnection(websocket, user_info)` - Connection establishment
- `MessageReceived(connection_id, message)` - Incoming message
- `SendMessage(connection_id, message)` - Outgoing message
- `ConnectionClosed(connection_id)` - Cleanup handling

## 📊 Analytics Actors

### AnalyticsTracker
**Purpose**: General event tracking and metrics collection

**Responsibilities**:
- User action tracking
- Performance metrics collection
- Business intelligence data gathering
- Event aggregation and reporting

**Tracked Events**:
- User login/logout events
- Room creation and joining
- Feature usage statistics
- Error rates and performance metrics

### UserStatsTracker
**Purpose**: Individual user statistics and achievements

**Responsibilities**:
- User performance tracking
- Achievement calculation
- Leaderboard maintenance
- Progress tracking

**Metrics Tracked**:
- Total notes played
- Accuracy percentages
- Time spent in rooms
- Social interaction metrics

### SheetMusicStatsTracker
**Purpose**: Music-specific analytics and performance data

**Responsibilities**:
- Song popularity tracking
- Difficulty analysis
- Performance statistics per song
- Music recommendation data

## 🔍 Monitoring Actors

### StatusPageMonitor
**Purpose**: System health monitoring and status reporting

**Responsibilities**:
- Health check execution
- Service availability monitoring
- Performance threshold monitoring
- Status page updates

**Monitored Services**:
- Redis connectivity and performance
- MongoDB connectivity and performance
- External API availability
- Server resource utilization

### SentryActor
**Purpose**: Error tracking and alerting

**Responsibilities**:
- Error capture and reporting
- Performance monitoring
- Alert generation for critical issues
- Error context enrichment

**Integration**:
- Sentry.io service integration
- Automatic error reporting
- Performance transaction tracking

### SeqLoggerActor
**Purpose**: Structured logging aggregation

**Responsibilities**:
- Log message formatting
- Log level filtering
- Centralized log shipping
- Log correlation and context

## 🔄 Message Flow Patterns

### Request-Response Pattern
```rust
// User requests room information
let room_info = room_manager
    .send(GetRoomInfo { room_id })
    .await?;
```

### Fire-and-Forget Pattern
```rust
// Analytics tracking (no response needed)
analytics_tracker.do_send(TrackEvent {
    event_type: EventType::UserLogin,
    user_id,
    timestamp: Utc::now(),
});
```

### Publish-Subscribe Pattern
```rust
// State changes broadcast to interested actors
state_manager.do_send(PublishStateChange {
    change_type: StateChangeType::UserJoinedRoom,
    data: room_update,
});
```

## 🛡️ Error Handling and Supervision

### Supervision Strategy
- **One-for-One** - Individual actor restart on failure
- **All-for-One** - Restart all actors if critical actor fails
- **Rest-for-One** - Restart failed actor and dependents

### Error Recovery
- **Automatic Restart** - Failed actors restart automatically
- **State Recovery** - Actors restore state from persistent storage
- **Circuit Breaker** - Prevent cascading failures

### Monitoring and Alerting
- **Actor Health Checks** - Regular health monitoring
- **Performance Metrics** - Actor processing time and throughput
- **Error Rate Tracking** - Monitor and alert on error spikes

## 🚀 Performance Optimization

### Message Optimization
- **Message Pooling** - Reuse message objects
- **Batch Processing** - Group related messages
- **Priority Queues** - Critical messages processed first

### Actor Optimization
- **Actor Pooling** - Multiple instances for high-load actors
- **Load Balancing** - Distribute messages across actor instances
- **Resource Management** - Monitor and limit actor resource usage

### Scaling Strategies
- **Horizontal Scaling** - Add more actor instances
- **Vertical Scaling** - Increase actor processing capacity
- **Geographic Distribution** - Deploy actors closer to users

## 🔧 Configuration and Tuning

### Actor Configuration
```rust
// Example actor configuration
UserManager::start_in_arbiter(&arbiter, |_| {
    UserManager::new(config.clone())
        .with_mailbox_capacity(1000)
        .with_timeout(Duration::from_secs(30))
});
```

### Performance Tuning
- **Mailbox Size** - Balance memory usage and message throughput
- **Timeout Settings** - Prevent hanging operations
- **Thread Pool Size** - Optimize for CPU core count

---

The actor system provides a robust foundation for concurrent, fault-tolerant processing while maintaining clear separation of concerns and enabling horizontal scalability.
