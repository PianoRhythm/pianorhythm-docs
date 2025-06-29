# REST API Endpoints

This document provides a comprehensive reference for all REST API endpoints available in the PianoRhythm Server.

## 🔐 Authentication Endpoints

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "username": "string",
  "password": "string",
  "remember_me": "boolean"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "refresh_token": "refresh_token_here",
    "expires_in": 3600,
    "user": {
      "user_id": "uuid",
      "username": "string",
      "roles": ["member"]
    }
  }
}
```

### POST /api/auth/register
Register new user account.

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "confirm_password": "string"
}
```

### POST /api/auth/refresh
Refresh JWT token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "string"
}
```

### GET /api/auth/validate-token
Validate current JWT token.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "expires_at": "2024-01-01T00:00:00Z"
  }
}
```

## 👤 User Endpoints

### GET /api/users/profile
Get current user's profile information.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "username": "string",
    "email": "string",
    "avatar_url": "string",
    "is_member": "boolean",
    "is_pro": "boolean",
    "roles": ["string"],
    "settings": {
      "theme": "dark",
      "notifications": true
    },
    "stats": {
      "total_notes": 12345,
      "time_played": 7200,
      "rooms_created": 5
    }
  }
}
```

### PUT /api/users/profile
Update user profile information.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "settings": {
    "theme": "dark|light",
    "notifications": "boolean"
  }
}
```

### GET /api/users/{user_id}
Get public user information.

**Parameters**:
- `user_id` (path) - User ID or username

**Response**:
```json
{
  "success": true,
  "data": {
    "user_id": "uuid",
    "username": "string",
    "avatar_url": "string",
    "is_member": "boolean",
    "is_pro": "boolean",
    "last_seen": "2024-01-01T00:00:00Z",
    "public_stats": {
      "total_notes": 12345,
      "time_played": 7200
    }
  }
}
```

### POST /api/users/avatar
Upload user avatar image.

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body**: Form data with `avatar` file field

### GET /api/users/friends
Get user's friends list.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "user_id": "uuid",
        "username": "string",
        "avatar_url": "string",
        "status": "online|away|busy|offline",
        "current_room": "string"
      }
    ],
    "pending_requests": [
      {
        "user_id": "uuid",
        "username": "string",
        "sent_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

## 🏠 Room Endpoints

### GET /api/rooms
List public rooms.

**Query Parameters**:
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)
- `room_type` (optional) - Filter by room type
- `has_users` (optional) - Only rooms with users

**Response**:
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "room_id": "string",
        "room_name": "string",
        "room_owner": "string",
        "room_type": "public|private|pro",
        "current_users": 5,
        "max_users": 10,
        "has_password": false,
        "created_at": "2024-01-01T00:00:00Z",
        "last_activity": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### POST /api/rooms
Create new room.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "room_name": "string",
  "room_type": "public|private|pro",
  "password": "string",
  "max_users": 10,
  "settings": {
    "allow_chat": true,
    "allow_guests": true,
    "auto_moderation": false,
    "welcome_message": "string"
  }
}
```

### GET /api/rooms/{room_id}
Get room details.

**Parameters**:
- `room_id` (path) - Room identifier

**Response**:
```json
{
  "success": true,
  "data": {
    "room_id": "string",
    "room_name": "string",
    "room_owner": "string",
    "room_type": "public|private|pro",
    "current_users": 5,
    "max_users": 10,
    "has_password": false,
    "created_at": "2024-01-01T00:00:00Z",
    "settings": {
      "allow_chat": true,
      "allow_guests": true,
      "auto_moderation": false
    },
    "users": [
      {
        "user_id": "uuid",
        "username": "string",
        "avatar_url": "string",
        "joined_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### PUT /api/rooms/{room_id}
Update room settings (owner only).

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `room_id` (path) - Room identifier

**Request Body**:
```json
{
  "room_name": "string",
  "password": "string",
  "max_users": 10,
  "settings": {
    "allow_chat": true,
    "allow_guests": true,
    "auto_moderation": false,
    "welcome_message": "string"
  }
}
```

### DELETE /api/rooms/{room_id}
Delete room (owner only).

**Headers**: `Authorization: Bearer <token>`

**Parameters**:
- `room_id` (path) - Room identifier

## 💳 Billing Endpoints (Pro Features)

### GET /api/billing/products
Get available subscription products.

**Response**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "product_id": "pro_monthly",
        "name": "Pro Monthly",
        "description": "Monthly pro subscription",
        "price": 999,
        "currency": "usd",
        "interval": "month",
        "features": [
          "Pro rooms access",
          "Advanced features",
          "Priority support"
        ]
      }
    ]
  }
}
```

### POST /api/billing/checkout
Create Stripe checkout session.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "product_id": "pro_monthly",
  "success_url": "string",
  "cancel_url": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "checkout_url": "https://checkout.stripe.com/...",
    "session_id": "cs_..."
  }
}
```

### POST /api/billing/portal
Create customer portal session.

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "return_url": "string"
}
```

### POST /api/billing/cancel
Cancel subscription.

**Headers**: `Authorization: Bearer <token>`

## 🔧 Utility Endpoints

### GET /api/scrape-url
Scrape webpage metadata.

**Query Parameters**:
- `url` (required) - URL to scrape

**Response**:
```json
{
  "success": true,
  "data": {
    "title": "string",
    "description": "string",
    "image": "string",
    "url": "string"
  }
}
```

### GET /health
Basic health check.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### GET /health/detailed
Detailed system health check.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "external_apis": "healthy"
  },
  "metrics": {
    "active_connections": 150,
    "memory_usage": "45%",
    "cpu_usage": "23%"
  }
}
```

## 📊 Error Responses

### Common Error Codes
- `VALIDATION_ERROR` - Invalid request parameters
- `AUTHENTICATION_ERROR` - Invalid or missing authentication
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVER_ERROR` - Internal server error

### Error Response Format
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

## 📝 Request/Response Headers

### Common Request Headers
- `Authorization: Bearer <token>` - JWT authentication
- `Content-Type: application/json` - JSON request body
- `Accept: application/json` - JSON response preferred
- `User-Agent: <client_info>` - Client identification

### Common Response Headers
- `Content-Type: application/json` - JSON response
- `X-RateLimit-Limit` - Rate limit maximum
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Rate limit reset time

---

All endpoints support standard HTTP methods and return appropriate status codes. For real-time features, use the WebSocket API documented separately.
