---
id: websocket-api-documentation
title: WebSocket API Documentation
description: Real-time WebSocket communication protocol, message types, and usage patterns
path: ['/community/development/technical-documentation/server/api/websocket']
keywords: ['websocket', 'real-time', 'protocol-buffers', 'messaging', 'communication', 'midi', 'chat', 'pianorhythm']
tags:
  - websocket
  - real-time
  - protocol-buffers
  - messaging
  - communication
  - midi
  - chat
  - api
---

# WebSocket API Documentation

The PianoRhythm WebSocket API enables real-time, bidirectional communication between clients and the server. This document details the WebSocket protocol, message types, and usage patterns.

## 🔌 Connection Establishment

### WebSocket Endpoint
```
wss://api.pianorhythm.io/api/websocket/{encrypted_payload}
```

### Encrypted Payload
The connection requires an encrypted payload containing user authentication data:

```javascript
const payload = {
  username: "user123",
  uuid: "user-uuid-here",
  socket_id: "unique-socket-id",
  is_member: true,
  token: "jwt-token-here"
};

const encryptedPayload = encrypt(JSON.stringify(payload));
const ws = new WebSocket(`wss://api.pianorhythm.io/api/websocket/${encryptedPayload}`);
```

### Connection Lifecycle
1. **WebSocket Handshake** - HTTP upgrade to WebSocket
2. **Payload Decryption** - Server decrypts authentication data
3. **User Authentication** - JWT token validation
4. **Session Initialization** - User session created
5. **Welcome Message** - Server sends user data
6. **Ready State** - Connection ready for messages

## 📨 Message Protocol

### Message Format
All messages use Protocol Buffers for efficient binary serialization:

```protobuf
message ServerMessage {
  ServerMessageType messageType = 1;
  oneof message {
    CreateRoomCommand createRoomCommand = 2;
    UpdateRoomCommand updateRoomCommand = 3;
    JoinRoomByName joinRoomByName = 4;
    RoomChatMessage roomChatMessage = 5;
    MidiMessage midiMessage = 6;
    ServerCommand serverCommand = 7;
    AvatarCommand avatarCommand = 8;
    // ... additional message types
  }
}
```

### Message Types

#### Room Management Messages
- `CreateRoomCommand` - Create a new room
- `UpdateRoomCommand` - Update room settings
- `JoinRoomByName` - Join room by name
- `JoinNextAvailableLobby` - Join any available lobby
- `LeaveRoom` - Leave current room

#### Communication Messages
- `RoomChatMessage` - Send chat message
- `RoomChatServerCommand` - Server chat commands
- `PrivateMessage` - Direct user messaging

#### Game Messages
- `MidiMessage` - Musical note data
- `AvatarCommand` - Avatar updates
- `UserStatusUpdate` - Status changes

#### System Messages
- `ServerCommand` - General server commands
- `HeartbeatMessage` - Connection keep-alive
- `ErrorMessage` - Error notifications

## 🎮 Room Management

### Creating a Room
```protobuf
message CreateRoomCommand {
  string room_name = 1;
  RoomType room_type = 2;
  string password = 3;
  RoomSettings settings = 4;
}
```

**Example Usage**:
```javascript
const createRoomMessage = {
  messageType: 'CreateRoomCommand',
  createRoomCommand: {
    room_name: 'My Piano Room',
    room_type: 'PUBLIC',
    password: '',
    settings: {
      max_users: 10,
      allow_chat: true,
      allow_guests: true
    }
  }
};

ws.send(encodeProtobuf(createRoomMessage));
```

### Joining a Room
```protobuf
message JoinRoomByName {
  string room_name = 1;
  string password = 2;
}
```

**Server Response**:
```protobuf
message RoomJoinedResponse {
  bool success = 1;
  RoomInfo room_info = 2;
  repeated UserInfo current_users = 3;
  string error_message = 4;
}
```

### Room Settings
```protobuf
message RoomSettings {
  int32 max_users = 1;
  bool allow_chat = 2;
  bool allow_guests = 3;
  bool auto_moderation = 4;
  bool require_pro = 5;
  string welcome_message = 6;
}
```

## 💬 Chat System

### Sending Chat Messages
```protobuf
message RoomChatMessage {
  string message = 1;
  ChatMessageType message_type = 2;
}
```

**Message Types**:
- `USER_MESSAGE` - Regular user message
- `SYSTEM_MESSAGE` - System notification
- `BOT_MESSAGE` - Bot-generated message
- `MODERATOR_MESSAGE` - Moderator announcement

### Chat Commands
Special commands prefixed with `/`:

- `/help` - Show available commands
- `/users` - List users in room
- `/kick <username>` - Kick user (moderators only)
- `/ban <username>` - Ban user (moderators only)
- `/mute <username>` - Mute user (moderators only)

### Chat Moderation
```protobuf
message RoomChatServerCommand {
  string command = 1;
  string target_user = 2;
  string reason = 3;
}
```

## 🎵 MIDI Messages

### MIDI Data Format
```protobuf
message MidiMessage {
  bytes midi_data = 1;
  int64 timestamp = 2;
  string user_id = 3;
}
```

### MIDI Event Types
- **Note On** - Key press events
- **Note Off** - Key release events
- **Control Change** - Pedal and other controls
- **Program Change** - Instrument selection

### Real-time Synchronization
- **Timestamp Sync** - Server timestamps for synchronization
- **Latency Compensation** - Client-side prediction
- **Jitter Buffer** - Smooth playback despite network variations

## 👤 User Management

### Avatar Updates
```protobuf
message AvatarCommand {
  AvatarAction action = 1;
  AvatarData avatar_data = 2;
}

enum AvatarAction {
  UPDATE_POSITION = 0;
  UPDATE_APPEARANCE = 1;
  UPDATE_STATUS = 2;
}
```

### User Status
```protobuf
enum UserStatus {
  ONLINE = 0;
  AWAY = 1;
  BUSY = 2;
  INVISIBLE = 3;
}
```

### Friend System
```protobuf
message FriendRequest {
  string target_user_id = 1;
  FriendAction action = 2;
}

enum FriendAction {
  SEND_REQUEST = 0;
  ACCEPT_REQUEST = 1;
  DECLINE_REQUEST = 2;
  REMOVE_FRIEND = 3;
}
```

## 🔄 Server Commands

### General Commands
```protobuf
message ServerCommand {
  ServerCommandType commandType = 1;
  map<string, string> parameters = 2;
}

enum ServerCommandType {
  JOIN = 0;
  LEAVE = 1;
  CREATE_OR_JOIN_ROOM = 2;
  ENTER_LOBBY = 3;
  UPDATE_SETTINGS = 4;
}
```

### System Commands
- `HEARTBEAT` - Connection keep-alive
- `RECONNECT` - Request reconnection
- `SYNC_STATE` - Synchronize client state
- `UPDATE_PERMISSIONS` - Refresh user permissions

## 📡 Client-Server Communication Patterns

### Request-Response Pattern
```javascript
// Client sends request
const requestId = generateUniqueId();
const message = {
  messageType: 'GetRoomInfo',
  requestId: requestId,
  getRoomInfo: { room_id: 'room123' }
};

ws.send(encodeProtobuf(message));

// Server responds with matching requestId
ws.onmessage = (event) => {
  const response = decodeProtobuf(event.data);
  if (response.requestId === requestId) {
    // Handle response
  }
};
```

### Event Broadcasting
```javascript
// Server broadcasts to all room members
const broadcastMessage = {
  messageType: 'UserJoinedRoom',
  userJoinedRoom: {
    user_info: userInfo,
    room_id: 'room123'
  }
};

// All clients in room receive this message
```

### Heartbeat Mechanism
```javascript
// Client sends heartbeat every 30 seconds
setInterval(() => {
  const heartbeat = {
    messageType: 'HeartbeatMessage',
    heartbeatMessage: {
      timestamp: Date.now()
    }
  };
  ws.send(encodeProtobuf(heartbeat));
}, 30000);

// Server responds with heartbeat acknowledgment
```

## 🛡️ Error Handling

### Connection Errors
- **Authentication Failed** - Invalid credentials
- **Connection Timeout** - Network issues
- **Rate Limited** - Too many messages
- **Server Unavailable** - Maintenance mode

### Message Errors
```protobuf
message ErrorMessage {
  ErrorType error_type = 1;
  string error_code = 2;
  string error_message = 3;
  map<string, string> error_details = 4;
}

enum ErrorType {
  VALIDATION_ERROR = 0;
  PERMISSION_ERROR = 1;
  RESOURCE_ERROR = 2;
  SYSTEM_ERROR = 3;
}
```

### Reconnection Strategy
```javascript
class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onclose = (event) => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
      }
    };
  }
}
```

## 📊 Performance Considerations

### Message Optimization
- **Binary Protocol** - Protocol Buffers for efficiency
- **Message Batching** - Group related messages
- **Compression** - WebSocket compression enabled

### Connection Management
- **Connection Pooling** - Reuse connections where possible
- **Graceful Degradation** - Handle partial connectivity
- **Resource Cleanup** - Proper connection disposal

### Monitoring
- **Message Rates** - Track messages per second
- **Connection Count** - Monitor active connections
- **Error Rates** - Track connection and message errors
- **Latency Metrics** - Measure round-trip times

---

The WebSocket API provides the foundation for real-time multiplayer piano gaming, enabling synchronized musical collaboration and social interaction.
