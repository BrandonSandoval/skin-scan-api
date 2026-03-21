# 🔌 API Reference

**Base URL:** `http://localhost:5000` (development) or `https://your-domain.com` (production)

**API Version:** 1.0  
**Last Updated:** March 2024

---

## Table of Contents

1. [Authentication](#authentication)
2. [Predictions](#predictions)
3. [History](#history)
4. [Feedback](#feedback)
5. [Dashboard](#dashboard)
6. [Metrics](#metrics)
7. [Error Codes](#error-codes)
8. [Rate Limiting](#rate-limiting)
9. [Schema Definitions](#schema-definitions)
10. [Example Requests](#example-requests)

---

## Authentication

### POST /api/auth/register

Create a new user account.

**Request:**
```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Request Body:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | ✅ | Valid email, unique, <255 chars |
| `password` | string | ✅ | Min 8 chars, at least 1 uppercase, 1 digit |

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-03-21T10:30:00Z"
  }
}
```

**Error Responses:**

```json
// 400 - Invalid Input
{
  "error": "Email already exists"
}

// 400 - Weak Password
{
  "error": "Password must be at least 8 characters with uppercase and digits"
}

// 400 - Invalid Email
{
  "error": "Invalid email format"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### POST /api/auth/login

Authenticate user and retrieve JWT token.

**Request:**
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "user",
    "createdAt": "2024-03-21T10:30:00Z"
  }
}
```

**Error Responses:**

```json
// 401 - Unauthorized
{
  "error": "Invalid email or password"
}

// 400 - Missing Fields
{
  "error": "Email and password are required"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }' | jq '.token'
```

**JWT Token Usage:**  
Store the returned token and include in all authenticated requests:
```bash
Authorization: Bearer <token>
```

**Token Expiration:** 7 days (configurable via `JWT_EXPIRATION` env var)

---

## Predictions

### POST /api/predict

Upload a skin lesion image and get AI prediction.

**Request:**
```http
POST /api/predict HTTP/1.1
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

[Binary image data]
```

**Headers:**
| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <jwt-token>` | ✅ |
| `Content-Type` | `multipart/form-data` | ✅ |

**Request Parameters:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `image` | file | ✅ | JPEG, PNG, WebP; <5MB; >100×100px |

**Response (200 OK):**
```json
{
  "label": "Benign",
  "confidence": 0.9427,
  "predictionId": "507f2f77bcf86cd799439012",
  "processedAt": "2024-03-21T10:35:22Z"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `label` | string | `"Benign"` or `"Malignant"` |
| `confidence` | number | Prediction confidence (0.0-1.0) |
| `predictionId` | string | Unique prediction ID (for feedback) |
| `processedAt` | string | ISO 8601 timestamp |

**Error Responses:**

```json
// 400 - No Image Uploaded
{
  "error": "No image uploaded"
}

// 400 - Invalid File Type
{
  "error": "Only JPEG, PNG, and WebP images are allowed"
}

// 400 - File Too Large
{
  "error": "File size exceeds 5MB limit"
}

// 400 - Image Too Small
{
  "error": "Image dimensions must be at least 100x100 pixels"
}

// 401 - Unauthorized
{
  "error": "Invalid or missing authorization token"
}

// 500 - Prediction Failed
{
  "error": "Prediction service unavailable"
}
```

**cURL Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/lesion.jpg"
```

**JavaScript/Fetch Example:**
```javascript
const formData = new FormData();
formData.append('image', imageFile); // File object from input

const response = await fetch('http://localhost:5000/api/predict', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});

const data = await response.json();
console.log(`Prediction: ${data.label} (${(data.confidence * 100).toFixed(2)}%)`);
```

**Processing Time:** Typically 1-2 seconds (varies by image size & model)

---

## History

### GET /api/history

Retrieve authenticated user's prediction history.

**Request:**
```http
GET /api/history?limit=10&offset=0&sortBy=recent HTTP/1.1
Authorization: Bearer <jwt-token>
```

**Headers:**
| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <jwt-token>` | ✅ |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Results per page (max 100) |
| `offset` | number | 0 | Skip N records |
| `sortBy` | string | `recent` | `recent`, `oldest`, `benign`, `malignant` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f2f77bcf86cd799439012",
      "imagePath": "lesion_001.jpg",
      "prediction": "Benign",
      "confidence": 0.9427,
      "createdAt": "2024-03-21T10:35:22Z"
    },
    {
      "id": "507f2f77bcf86cd799439013",
      "imagePath": "lesion_002.jpg",
      "prediction": "Malignant",
      "confidence": 0.8156,
      "createdAt": "2024-03-20T14:12:08Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

**Error Responses:**

```json
// 401 - Unauthorized
{
  "error": "Invalid or missing authorization token"
}

// 400 - Invalid Parameters
{
  "error": "Limit must be between 1 and 100"
}
```

**cURL Example:**
```bash
TOKEN="your-jwt-token"

# Get recent 10 predictions
curl -X GET "http://localhost:5000/api/history?limit=10&sortBy=recent" \
  -H "Authorization: Bearer $TOKEN"

# Get predictions 20-30, oldest first
curl -X GET "http://localhost:5000/api/history?limit=10&offset=20&sortBy=oldest" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Feedback

### POST /api/feedback

Submit feedback on a prediction (accuracy, notes, etc.).

**Request:**
```http
POST /api/feedback HTTP/1.1
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "predictionId": "507f2f77bcf86cd799439012",
  "isAccurate": true,
  "actualLabel": "Benign",
  "comment": "Matches dermatologist diagnosis"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `predictionId` | string | ✅ | ID from prediction response |
| `isAccurate` | boolean | ✅ | Whether prediction was correct |
| `actualLabel` | string | ❌ | Correct label if inaccurate |
| `comment` | string | ❌ | Additional notes (max 500 chars) |

**Response (201 Created):**
```json
{
  "message": "Feedback submitted successfully",
  "feedback": {
    "id": "507f3f77bcf86cd799439014",
    "predictionId": "507f2f77bcf86cd799439012",
    "isAccurate": true,
    "actualLabel": "Benign",
    "comment": "Matches dermatologist diagnosis",
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-03-21T10:40:15Z"
  }
}
```

**Error Responses:**

```json
// 400 - Invalid Prediction ID
{
  "error": "Prediction not found"
}

// 400 - Prediction Not Owned by User
{
  "error": "Cannot provide feedback on another user's prediction"
}

// 400 - Comment Too Long
{
  "error": "Comment must be 500 characters or less"
}

// 401 - Unauthorized
{
  "error": "Authentication required"
}
```

**cURL Example:**
```bash
TOKEN="your-jwt-token"

curl -X POST http://localhost:5000/api/feedback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "predictionId": "507f2f77bcf86cd799439012",
    "isAccurate": true,
    "actualLabel": "Benign",
    "comment": "Matches dermatologist diagnosis"
  }'
```

---

## Dashboard

### GET /api/dashboard

Get user dashboard summary (statistics & recent activity).

**Request:**
```http
GET /api/dashboard HTTP/1.1
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "joinedAt": "2024-03-21T10:30:00Z",
    "role": "user"
  },
  "statistics": {
    "totalPredictions": 45,
    "benignCount": 38,
    "malignantCount": 7,
    "accuracyRate": 0.92,
    "lastPredictionAt": "2024-03-21T10:35:22Z"
  },
  "recentActivity": [
    {
      "id": "507f2f77bcf86cd799439012",
      "type": "prediction",
      "label": "Benign",
      "confidence": 0.9427,
      "timestamp": "2024-03-21T10:35:22Z"
    },
    {
      "id": "507f3f77bcf86cd799439014",
      "type": "feedback",
      "predictionId": "507f2f77bcf86cd799439012",
      "timestamp": "2024-03-21T10:40:15Z"
    }
  ]
}
```

**Error Responses:**

```json
// 401 - Unauthorized
{
  "error": "Authentication required"
}
```

---

## Metrics

### GET /api/metrics

Get system-wide metrics (admin only).

**Request:**
```http
GET /api/metrics HTTP/1.1
Authorization: Bearer <jwt-token-admin>
```

**Response (200 OK):**
```json
{
  "success": true,
  "timestamp": "2024-03-21T10:45:00Z",
  "system": {
    "totalUsers": 156,
    "totalPredictions": 3247,
    "totalFeedback": 892,
    "averagePredictionTime": 1.24,
    "uptime": "99.8%"
  },
  "predictions": {
    "benign": 2845,
    "malignant": 402,
    "accuracyRate": 0.891
  },
  "errors": {
    "last24h": 3,
    "last7d": 12,
    "topError": "Image validation failure"
  }
}
```

**Error Responses:**

```json
// 403 - Forbidden
{
  "error": "Admin access required"
}

// 401 - Unauthorized
{
  "error": "Authentication required"
}
```

---

## Health Check

### GET /healthz

Basic health check endpoint (no authentication required).

**Request:**
```http
GET /healthz HTTP/1.1
```

**Response (200 OK):**
```json
{
  "status": "OK"
}
```

**Usage:** For monitoring, load balancers, and uptime checks.

---

## Error Codes

### HTTP Status Codes

| Code | Name | Description |
|------|------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input or validation error |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | Service temporarily unavailable |

### Common Error Messages

```json
// Authentication
{
  "error": "Invalid or missing authorization token"
}

// File Upload
{
  "error": "Only JPEG, PNG, and WebP images are allowed",
  "details": "Unsupported file type: gif"
}

// Validation
{
  "error": "Email must be valid and unique"
}

// Rate Limiting
{
  "error": "Too many requests from this IP, please try again later",
  "retryAfter": 60
}

// Not Found
{
  "error": "Prediction not found",
  "predictionId": "507f2f77bcf86cd799439012"
}
```

---

## Rate Limiting

**Auth Endpoints:** 5 attempts per 15 minutes per IP  
**Other Endpoints:** 100 requests per 15 minutes per IP  
**Prediction:** 10 predictions per hour per user

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1711012500
```

**When Limited (429):**
```json
{
  "error": "Too many requests from this IP, please try again later",
  "retryAfter": 60
}
```

---

## Schema Definitions

### User
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "createdAt": "2024-03-21T10:30:00Z"
}
```

**Fields:**
- `id` (ObjectId): Unique user identifier
- `email` (string): User email address
- `role` (enum): `user`, `doctor`, or `admin`
- `createdAt` (ISO 8601): Account creation timestamp
- `passwordHash` (string, hidden): Bcrypt hashed password (never returned)

---

### Prediction
```json
{
  "id": "507f2f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "imagePath": "lesion_001.jpg",
  "prediction": "Benign",
  "confidence": 0.9427,
  "createdAt": "2024-03-21T10:35:22Z"
}
```

**Fields:**
- `id` (ObjectId): Unique prediction identifier
- `userId` (ObjectId): User who made prediction
- `imagePath` (string): Original filename
- `prediction` (enum): `"Benign"` or `"Malignant"`
- `confidence` (number): 0.0-1.0 confidence score
- `createdAt` (ISO 8601): Prediction timestamp

---

### Feedback
```json
{
  "id": "507f3f77bcf86cd799439014",
  "userId": "507f1f77bcf86cd799439011",
  "predictionId": "507f2f77bcf86cd799439012",
  "isAccurate": true,
  "actualLabel": "Benign",
  "comment": "Matches dermatologist diagnosis",
  "createdAt": "2024-03-21T10:40:15Z"
}
```

**Fields:**
- `id` (ObjectId): Unique feedback identifier
- `userId` (ObjectId): User who submitted feedback
- `predictionId` (ObjectId): Referenced prediction
- `isAccurate` (boolean): Prediction accuracy
- `actualLabel` (string, optional): Correct label if inaccurate
- `comment` (string, optional): Notes (max 500 chars)
- `createdAt` (ISO 8601): Submission timestamp

---

## Example Requests

### Complete Workflow

**1. Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "DermatologyPro2024!"
  }'
```

**2. Login:**
```bash
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "DermatologyPro2024!"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.token')
```

**3. Upload Image & Predict:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@lesion.jpg"
```

**4. Get History:**
```bash
curl -X GET "http://localhost:5000/api/history?limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**5. Submit Feedback:**
```bash
PREDICTION_ID="507f2f77bcf86cd799439012"

curl -X POST http://localhost:5000/api/feedback \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"predictionId\": \"$PREDICTION_ID\",
    \"isAccurate\": true,
    \"comment\": \"Confirmed by dermatologist\"
  }"
```

**6. View Dashboard:**
```bash
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Rate Limiting Examples

**When limit is exceeded:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  -w "\n%{http_code}\n"

# After 5 failed attempts within 15 minutes:
# 429
# {
#   "error": "Too many requests from this IP, please try again later",
#   "retryAfter": 860
# }
```

---

## Authentication Flow Diagram

```
User                    Backend              Database
  │                        │                     │
  ├─ Register ────────────>│                     │
  │                        ├─ Hash Password ────>│
  │                        │                     │
  │<─ Success ─────────────┤                     │
  │                        │                     │
  ├─ Login ───────────────>│                     │
  │                        ├─ Verify Password ──>│
  │                        │<─ User Data ───────┤
  │<─ JWT Token ───────────┤                     │
  │                        │                     │
  ├─ Request + JWT ──────>│                     │
  │ (Authorization header) │                     │
  │                        ├─ Verify Token      │
  │                        │                     │
  │<─ Protected Data ──────┤                     │
```

---

## Next Steps

- **Integrate API:** See [frontend README](../frontend/my-app/README.md)
- **Deploy:** Check [DEPLOYMENT.md](DEPLOYMENT.md)
- **Test:** Use [Example Requests](#example-requests) above
- **Report Issues:** GitHub Issues or email support

---

**API Version:** 1.0  
**Last Updated:** March 2024  
**Status:** Production Ready ✅
