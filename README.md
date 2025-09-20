# 🔐 Authentication API with Express & JWT

A robust authentication API built with Express.js, TypeScript, and JWT tokens. Features user registration, authentication, post creation with image uploads, and comprehensive testing.

## 🚀 Features

- **User Management**: Registration and authentication with secure password hashing
- **JWT Authentication**: Secure token-based authentication with blacklist support
- **Post System**: Create and retrieve posts with image uploads
- **File Upload**: Secure image upload with validation and storage
- **Domain-Driven Design**: Clean architecture with value objects and domain entities
- **Comprehensive Testing**: Unit and E2E tests with high coverage
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** >= 22.19.0 (LTS recommended)
- **npm** package manager

## 🛠️ Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/dougmrqs/imersao42-authentication.git
cd imersao42-authentication
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### 4. Database Setup

Run database migrations to create the required tables:

```bash
npm run db:migrate
```

This will create:
- `users` table (id, email, password_hash, created_at, updated_at)
- `posts` table (id, title, description, image_path, user_id, created_at, updated_at)
- `invalid_tokens` table (token_id, expires_at)

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` with auto-reload enabled.

## 🔌 API Endpoints

### Authentication

#### POST `/api/users` - User Registration
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPass123#"
  }'
```

#### POST `/api/sign-in` - User Login
```bash
curl -X POST http://localhost:3000/api/sign-in \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPass123#"
  }'
```

#### POST `/api/sign-out` - User Logout (requires authentication)
```bash
curl -X POST http://localhost:3000/api/sign-out \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Posts

#### POST `/api/posts` - Create Post (requires authentication)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=My Post Title" \
  -F "description=Post description here" \
  -F "image=@/path/to/your/image.jpg"
```

#### GET `/api/posts` - Get All Posts
```bash
curl http://localhost:3000/api/posts
```

### Static Files

Images are served at `/uploads/:filename` - accessible directly via browser or curl.

## 🧪 Testing

### Run All Tests
```bash
npm test
```

## 🔒 Security Features

- **Password Hashing**: Argon2 algorithm for secure password storage
- **JWT Tokens**: Secure token-based authentication with expiration
- **Token Blacklist**: Invalidated tokens are tracked and rejected
- **File Upload Security**: MIME type validation and size limits
- **Input Validation**: Zod schemas for request validation
- **Error Handling**: Secure error responses without sensitive data leakage

## 🚦 Password Requirements

Passwords must meet the following criteria:
- Minimum 12 characters long
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@, #, !)
