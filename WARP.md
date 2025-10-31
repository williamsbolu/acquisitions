# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Development Server
- `npm run dev` - Start development server with auto-restart using Node.js watch mode
- Server runs on `http://localhost:3000` by default (configurable via PORT env var)

### Code Quality
- `npm run lint` - Run ESLint to check for code style issues
- `npm run lint:fix` - Automatically fix ESLint issues where possible
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if code is properly formatted

### Database Operations (Drizzle ORM)
- `npm run db:generate` - Generate database migration files from schema changes
- `npm run db:migrate` - Apply pending migrations to database
- `npm run db:studio` - Open Drizzle Studio for database inspection and management

## Architecture Overview

### Tech Stack
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with security middleware (Helmet, CORS)
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas for request validation
- **Logging**: Winston with Morgan for HTTP request logging

### Project Structure

```
src/
├── config/          # Configuration files (database, logger)
├── controllers/     # Route handlers and business logic
├── middleware/      # Custom middleware (currently empty)
├── models/          # Drizzle ORM schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic and data access layer
├── utils/           # Utility functions (JWT, cookies, formatting)
├── validations/     # Zod validation schemas
├── app.js          # Express app configuration and middleware setup
├── index.js        # Entry point - loads environment and starts server
└── server.js       # HTTP server initialization
```

### Import Path Mapping
The project uses Node.js import maps for clean imports:
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middlewares/*` → `./src/middlewares/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Key Architectural Patterns

#### Layered Architecture
- **Routes**: Handle HTTP routing and delegate to controllers
- **Controllers**: Process requests, validate input, orchestrate services
- **Services**: Contain business logic and interact with data layer
- **Models**: Define database schema using Drizzle ORM

#### Authentication Flow
- JWT-based authentication with cookie storage
- Password hashing using bcrypt (10 rounds)
- Role-based access with 'user' and 'admin' roles
- Centralized token utilities in `#utils/jwt.js`

#### Error Handling & Logging
- Structured logging with Winston (JSON format in production)
- File-based logging to `logs/` directory (error.log, combined.log)
- Console logging in non-production environments
- HTTP request logging via Morgan integrated with Winston

#### Database Schema
- Users table with id, name, email, password, role, timestamps
- Drizzle migrations stored in `./drizzle` directory
- Database connection via Neon serverless PostgreSQL

### Environment Configuration
Required environment variables (see `.env.example`):
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level (default: info)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (required for production)

### Current Implementation Status
- ✅ User registration (signup) with validation
- ✅ Password hashing and JWT token generation
- ✅ Cookie-based authentication setup
- 🔄 Sign-in and sign-out endpoints (placeholder implementations)
- ❌ No test framework currently configured
- ❌ No authentication middleware implemented

### Development Notes
- Uses ES modules throughout the codebase
- ESLint configured with strict rules (2-space indentation, single quotes, semicolons)
- Prettier integration for consistent formatting
- No testing framework currently set up - consider adding Jest or similar
- Authentication middleware should be implemented for protected routes