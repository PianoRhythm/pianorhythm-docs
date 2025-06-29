---
id: state-management-architecture
title: State Management Architecture
description: Redis-based state management, data models, and performance optimizations
path: ['/community/development/technical-documentation/server/architecture/state-management']
keywords: ['state-management', 'redis', 'mongodb', 'caching', 'data-models', 'performance', 'pianorhythm']
tags:
  - state-management
  - redis
  - mongodb
  - caching
  - data-models
  - performance
  - server
---

# State Management Architecture

PianoRhythm Server implements a sophisticated state management system using Redis as the primary state store, with MongoDB for persistent data. This document details the state management architecture, data models, and caching strategies.

## 🎯 State Management Overview

### Design Principles
- **Single Source of Truth** - Redis serves as the authoritative state store
- **Performance First** - In-memory operations for real-time requirements
- **Persistence** - MongoDB backup for data durability
- **Consistency** - Atomic operations and transactions where needed

### State Categories
- **Session State** - User connections and temporary data
- **Game State** - Room data, user positions, real-time interactions
- **Social State** - Friend relationships, chat messages, user status
- **Configuration State** - Server settings, room configurations

## 🏗️ Redis Architecture

### Data Structure Strategy
```
pianorhythm:
├── users:{user_id}                    # Hash - User session data
├── rooms:{room_id}                    # Hash - Room configuration
├── rooms:online                       # Sorted Set - Active rooms
├── rooms:users:{room_id}              # Sorted Set - Users in room
├── rooms:chat:{room_id}               # Sorted Set - Chat messages
├── users:friends:{user_id}            # Set - Friend relationships
├── users:online                       # Sorted Set - Online users
└── server:settings                    # Hash - Server configuration
```

### Key Naming Conventions
- **Prefix**: `pianorhythm:` - Namespace isolation
- **Entity Types**: `users:`, `rooms:`, `server:` - Clear categorization
- **Relationships**: `rooms:users:`, `users:friends:` - Relationship mapping
- **Collections**: `online`, `chat`, `typing` - Collection suffixes

## 📊 Data Models

### User State Model
```rust
pub struct UserDbo {
    pub user_id: UserId,
    pub username: String,
    pub user_tag: String,
    pub socket_id: SocketId,
    pub room_id: Option<RoomId>,
    pub status: UserStatus,
    pub roles: UserRoles,
    pub settings: UserSettings,
    pub billing_settings: UserBillingSettings,
    pub last_seen: DateTime<Utc>,
}
```

**Redis Storage**:
- **Key**: `pianorhythm:users:{user_id}`
- **Type**: Hash
- **TTL**: Session-based (extends on activity)

### Room State Model
```rust
pub struct RoomStateDbo {
    pub room_id: RoomId,
    pub room_name: String,
    pub room_owner: String,
    pub room_type: RoomType,
    pub settings: RoomSettings,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
}
```

**Redis Storage**:
- **Key**: `pianorhythm:rooms:{room_id}`
- **Type**: Hash
- **Additional**: Sorted set entries for discovery

### Chat Message Model
```rust
pub struct ChatMessageDbo {
    pub message_id: String,
    pub user_id: UserId,
    pub username: String,
    pub message: String,
    pub timestamp: DateTime<Utc>,
    pub message_type: ChatMessageType,
}
```

**Redis Storage**:
- **Key**: `pianorhythm:rooms:chat:{room_id}`
- **Type**: Sorted Set (scored by timestamp)
- **Retention**: Configurable message history limit

## 🔄 State Operations

### User State Operations

#### User Login
```rust
pub fn save_user(&self, user_dbo: &UserDbo) -> Result<(), StateError> {
    let mut pipeline = self.store.create_pipeline();
    
    // Save user data
    pipeline.hset_multiple(&user_key, &user_hash_data);
    
    // Add to online users
    pipeline.zadd("pianorhythm:users:online", &user_dbo.user_id, timestamp);
    
    // Set expiration
    pipeline.expire(&user_key, SESSION_TTL);
    
    pipeline.execute()
}
```

#### User Room Assignment
```rust
pub fn add_user_to_room(&self, room_id: &RoomId, socket_id: &SocketId) 
    -> Result<(RoomStateDbo, Vec<UserInfo>, Option<RoomId>), StateError> {
    
    let mut pipeline = self.store.create_pipeline();
    
    // Remove from previous room
    if let Some(prev_room) = self.get_user_room(socket_id)? {
        pipeline.zrem(&format!("pianorhythm:rooms:users:{}", prev_room), socket_id);
    }
    
    // Add to new room
    pipeline.zadd(&format!("pianorhythm:rooms:users:{}", room_id), socket_id, timestamp);
    
    // Update user's room assignment
    pipeline.hset(&format!("pianorhythm:users:{}", socket_id), "room_id", room_id);
    
    pipeline.execute()
}
```

### Room State Operations

#### Room Creation
```rust
pub fn save_room(&self, room_dbo: &RoomStateDbo) -> Result<(), StateError> {
    let mut pipeline = self.store.create_pipeline();
    
    // Save room data
    pipeline.hset_multiple(&room_key, &room_hash_data);
    
    // Add to online rooms
    pipeline.zadd("pianorhythm:rooms:online", &room_dbo.room_id, timestamp);
    
    // Add name mapping if named room
    if !room_dbo.room_name.is_empty() {
        pipeline.hset("pianorhythm:rooms:name-map", &room_dbo.room_name, &room_dbo.room_id);
    }
    
    pipeline.execute()
}
```

#### Chat Message Storage
```rust
pub fn save_chat_message(&self, room_id: &RoomId, message: &ChatMessageDbo) 
    -> Result<bool, StateError> {
    
    let chat_key = format!("pianorhythm:rooms:chat:{}", room_id);
    let message_json = serde_json::to_string(message)?;
    let score = message.timestamp.timestamp_millis() as f64;
    
    // Add message to sorted set
    self.store.zadd(&chat_key, &message_json, score)?;
    
    // Trim old messages (keep last 100)
    self.store.zremrangebyrank(&chat_key, 0, -101)?;
    
    Ok(true)
}
```

## 🚀 Performance Optimizations

### Connection Pooling
```rust
pub struct RedisDBStore {
    pool: r2d2::Pool<RedisConnectionManager>,
    config: Arc<PianoRhythmConfig>,
}

impl RedisDBStore {
    pub fn new(pool: r2d2::Pool<RedisConnectionManager>) -> Self {
        Self { pool, config }
    }
    
    fn get_connection(&self) -> Result<r2d2::PooledConnection<RedisConnectionManager>, StateError> {
        self.pool.get().map_err(|e| StateError::ConnectionError(e.to_string()))
    }
}
```

### Pipeline Operations
```rust
pub fn create_pipeline(&self) -> RedisPipeline {
    RedisPipeline::new(self.get_connection()?)
}

// Batch multiple operations
let mut pipeline = state.create_pipeline();
pipeline.hset("key1", "field1", "value1");
pipeline.zadd("key2", "member1", 1.0);
pipeline.expire("key1", 3600);
pipeline.execute()?; // Single round-trip
```

### Caching Strategies

#### Hot Data Caching
- **User Sessions** - Cached for session duration
- **Active Rooms** - Cached with activity-based TTL
- **Friend Lists** - Cached with manual invalidation

#### Cache Invalidation
```rust
pub fn invalidate_user_cache(&self, user_id: &UserId) {
    // Remove from cache
    self.store.del(&format!("pianorhythm:cache:user:{}", user_id));
    
    // Publish invalidation event
    self.publish_cache_invalidation("user", user_id);
}
```

## 🔄 Data Synchronization

### Redis to MongoDB Sync
```rust
pub async fn sync_user_to_mongodb(&self, user_dbo: &UserDbo) -> Result<(), StateError> {
    // Update MongoDB with current Redis state
    self.users_service.update_user(user_dbo).await?;
    
    // Log sync operation
    debug!("Synced user {} to MongoDB", user_dbo.user_id);
    
    Ok(())
}
```

### Cross-Server Synchronization
```rust
pub fn publish_state_change(&self, change: StateChange) {
    let channel = format!("pianorhythm:state-changes:{}", self.config.server_name);
    let message = serde_json::to_string(&change).unwrap();
    
    self.store.publish(&channel, message);
}
```

## 🛡️ Data Consistency

### Atomic Operations
```rust
pub fn atomic_room_join(&self, user_id: &UserId, room_id: &RoomId) -> Result<(), StateError> {
    let mut pipeline = self.store.create_pipeline();
    pipeline.atomic(); // Start transaction
    
    // Check room capacity
    let current_users = pipeline.zcard(&format!("pianorhythm:rooms:users:{}", room_id));
    
    // Conditional operations based on capacity
    pipeline.execute_conditional(|results| {
        let user_count: i64 = results[0];
        user_count < MAX_ROOM_CAPACITY
    })
}
```

### Conflict Resolution
- **Last Write Wins** - For user preferences and settings
- **Merge Strategy** - For complex state objects
- **Version Vectors** - For distributed conflict detection

## 📊 Monitoring and Metrics

### Redis Metrics
- **Connection Pool Usage** - Monitor pool exhaustion
- **Command Latency** - Track operation performance
- **Memory Usage** - Monitor Redis memory consumption
- **Hit/Miss Ratios** - Cache effectiveness metrics

### State Metrics
```rust
pub struct StateMetrics {
    pub active_users: i64,
    pub active_rooms: i64,
    pub total_connections: i64,
    pub cache_hit_rate: f64,
    pub average_response_time: Duration,
}
```

## 🔧 Configuration

### Redis Configuration
```toml
[redis]
url = "redis://localhost:6379"
pool_size = 20
timeout = 5000
retry_attempts = 3
```

### State Management Configuration
```rust
pub struct StateConfig {
    pub session_ttl: Duration,
    pub room_ttl: Duration,
    pub chat_history_limit: usize,
    pub cache_size_limit: usize,
}
```

---

This state management architecture provides high-performance, consistent, and scalable data operations while maintaining data integrity and supporting real-time multiplayer gaming requirements.
