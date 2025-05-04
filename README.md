<!-- @format -->

# API Documentation

## Base URL

```
https://yourdomain.com/api
https://localhost:port/api
https://IP:port/api

```

## Authentication

All endpoints **except `/auth/*`** require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_token>
```

---

## User Endpoints

### 1. Authentication

#### Sign Up (User)

```bash
curl -X POST https://yourdomain.com/api/auth/signup/user \
-H "Content-Type: application/json" \
-d '{"fullName":"John Doe","email":"john@example.com","password":"password123","educationLevel":"Bachelor","specialty":"Software Engineering"}'
```

#### Sign Up (Company)

```bash
curl -X POST https://yourdomain.com/api/auth/signup/company \
-H "Content-Type: application/json" \
-d '{"companyName":"Tech Corp","email":"tech@example.com","password":"password123"}'
```

#### Sign In

```bash
curl -X POST https://yourdomain.com/api/auth/signin \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"password123"}'
```

---

### 2. Posts

#### Fetch Posts

```bash
curl -X GET "https://yourdomain.com/api/posts?specialty=Software&educationLevel=Bachelor&page=1" \
-H "Authorization: Bearer <token>"
```

#### Search Posts

```bash
curl -X GET "https://yourdomain.com/api/posts/search?query=Software&educationLevel=Bachelor&startDate=2023-01-01&endDate=2023-12-31&page=1" \
-H "Authorization: Bearer <token>"
```

#### Get Post with Company

```bash
curl -X GET "https://yourdomain.com/api/posts/1/company" \
-H "Authorization: Bearer <token>"
```

---

### 3. Favorites

#### Toggle Favorite

```bash
curl -X POST "https://yourdomain.com/api/favorites/1/toggle" \
-H "Authorization: Bearer <token>"
```

#### Get User Favorites

```bash
curl -X GET "https://yourdomain.com/api/favorites?page=1" \
-H "Authorization: Bearer <token>"
```

---

### 4. Notifications

#### Get Notifications

```bash
curl -X GET "https://yourdomain.com/api/notifications?page=1" \
-H "Authorization: Bearer <token>"
```

#### Mark as Read

```bash
curl -X PATCH "https://yourdomain.com/api/notifications/1/read" \
-H "Authorization: Bearer <token>"
```

---

## Company Endpoints

### 1. Profile

#### Update Profile

```bash
curl -X PUT "https://yourdomain.com/api/company/profile" \
-H "Authorization: Bearer <company_token>" \
-H "Content-Type: application/json" \
-d '{"companyName":"Updated Tech Corp","description":"Updated description","location":{"longitude":12.34,"latitude":56.78},"address":"456 Tech Avenue","phoneNumber":"+987654321","email":"updated@techcorp.com","website":"https://updated.techcorp.com"}'
```

---

### 2. Posts

#### Get Company Posts

```bash
curl -X GET "https://yourdomain.com/api/company/posts?page=1" \
-H "Authorization: Bearer <company_token>"
```

#### Create Post

```bash
curl -X POST "https://yourdomain.com/api/posts" \
-H "Authorization: Bearer <company_token>" \
-H "Content-Type: application/json" \
-d '{"title":"New Software Position","description":"Looking for a senior software engineer...","startDate":"2023-06-01","endDate":"2023-12-31","location":{"longitude":12.34,"latitude":56.78},"specialty":"Software","educationLevel":"Master","skills":["React","Node.js","TypeScript"]}'
```

#### Update Post

```bash
curl -X PUT "https://yourdomain.com/api/posts/1" \
-H "Authorization: Bearer <company_token>" \
-H "Content-Type: application/json" \
-d '{"title":"Updated Title","description":"Updated description...","startDate":"2023-07-01","endDate":"2024-01-01","location":{"longitude":9.10,"latitude":11.12},"specialty":"Data Science","educationLevel":"PhD","skills":["Python","SQL"]}'
```

#### Delete Post

```bash
curl -X DELETE "https://yourdomain.com/api/posts/1" \
-H "Authorization: Bearer <company_token>"
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": true,
  "message": "Error message",
  "errors": {
    // Zod validation errors if applicable
  }
}
```

### Status Codes

- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Example Usage Flow

### User Signs Up

```bash
curl -X POST https://yourdomain.com/api/auth/signup/user \
-H "Content-Type: application/json" \
-d '{"fullName":"John Doe","email":"john@example.com","password":"password123","educationLevel":"Bachelor","specialty":"Software"}'
```

### User Signs In

```bash
curl -X POST https://yourdomain.com/api/auth/signin \
-H "Content-Type: application/json" \
-d '{"email":"john@example.com","password":"password123"}'
```

### User Searches Posts

```bash
curl -X GET "https://yourdomain.com/api/posts/search?query=Software&educationLevel=Bachelor" \
-H "Authorization: Bearer <token>"
```

### User Favorites a Post

```bash
curl -X POST https://yourdomain.com/api/favorites/1/toggle \
-H "Authorization: Bearer <token>"
```

### Company Creates a Post

```bash
curl -X POST https://yourdomain.com/api/posts \
-H "Authorization: Bearer <company_token>" \
-H "Content-Type: application/json" \
-d '{"title":"New Position","description":"...","startDate":"2023-06-01","endDate":"2023-12-31","location":{"longitude":12.34,"latitude":56.78},"specialty":"Software","educationLevel":"Bachelor","skills":["JavaScript"]}'
```
