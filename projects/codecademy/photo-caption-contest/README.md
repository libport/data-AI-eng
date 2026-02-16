# Portfolio Project: Photo Caption Content
*Photo Caption Contest* is the porfolio project for the *Security, Infrastructure, & Scalability* module of Codecademy's Back-End Engineer Professional Certification.

## README
A secure and simple backend for a photo caption contest platform.

## Features
- User registration and login with JWT authentication.
- Photo and caption APIs backed by PostgreSQL + Sequelize.
- Authorization for caption/user updates.
- Local in-memory cache for frequently requested photo/user/caption reads.
- Transaction-safe caption create/delete logic to keep `photo.caption_count` accurate.
- Swagger docs at `/docs`.

## Project Structure
- `src/config`: environment and database setup
- `src/models`: Sequelize models and associations
- `src/routes`: feature routes and handlers (users, photos, captions)
- `src/middleware`: auth, validation, and error handling
- `src/services`: reusable services (cache)
- `src/docs`: Swagger setup and endpoint docs
- `src/db/init.js`: database initialization + seed photos

## Requirements
- Node.js 18+
- PostgreSQL 13+

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create a PostgreSQL database (example name: `photo_caption_contest`).

3. Copy and edit environment config:
```bash
cp .env.example .env
```

4. Initialize database tables and seed photos (only when the `photo` table is empty):
```bash
npm run db:init
```

5. Start server:
```bash
npm start
```

## API Quick Start
- `POST /users` create user
- `POST /users/login` get JWT token
- `GET /health` service health check
- `GET /photos` list photos
- `POST /photos` create photo (requires `Authorization: Bearer <token>`)
- `POST /captions` create caption (requires `Authorization: Bearer <token>`)
- `GET /docs` interactive Swagger documentation

## Security and Performance Notes
- Uses `helmet`, request size limits, and rate limiting.
- Passwords are hashed with bcrypt.
- JWT tokens have expiration.
- Read-heavy endpoints use local cache with TTL.