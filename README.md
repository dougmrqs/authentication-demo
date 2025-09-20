# Authentication Demo

ExpressJS authentication using JWT with token revocation strategy.

## Setup

```bash
git clone <repository-url>
cd authentication-demo
npm install
npm run db:migrate
```

Create `.env` file:
```bash
JWT_SECRET=your-secret-key
PORT=3000
```

## Run Tests

```bash
npm test
```

## Development

```bash
npm run dev
```

## Features

- User registration and login
- JWT token authentication  
- Token revocation
- Protected routes
