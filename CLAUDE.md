# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack MERN e-commerce application with TypeScript throughout. The project uses a client-server architecture with:
- **Backend**: Express.js REST API on port 3000
- **Frontend**: React SPA (Vite) on port 5173
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with bcrypt password hashing

## Development Commands

### Backend
```bash
cd backend
npm install                    # Install dependencies
npm run dev                   # Start dev server with auto-reload (nodemon + tsx)
npm run build                 # Compile TypeScript to dist/
npm start                     # Run compiled production build
```

### Frontend
```bash
cd frontend
npm install                   # Install dependencies
npm run dev                   # Start Vite dev server (http://localhost:5173)
npm run build                 # TypeScript check + production build
npm run lint                  # Run ESLint
npm run preview               # Preview production build
```

### Running the Full Stack
1. Start backend dev server (port 3000)
2. Start frontend dev server (port 5173)
3. Backend automatically seeds initial products on startup

## Environment Setup

Backend requires a `.env` file (see `.env.example`):
```
JWT_SECRET=your_jwt_secret
DATABASE_URL=mongodb://localhost:27017/ecommerce
```

Frontend API base URL is configured in [frontend/src/constants/baseUrl.ts](frontend/src/constants/baseUrl.ts).

## Architecture

### Backend Structure (Service-Oriented)

```
backend/src/
├── index.ts              # Server entry, MongoDB connection, CORS setup
├── routers/              # HTTP endpoint definitions
│   ├── userRoute.ts      # /api/user endpoints (register, login)
│   ├── productRoute.ts   # /api/product endpoints
│   └── cartRoute.ts      # /api/cart endpoints
├── services/             # Business logic layer
│   ├── userService.ts    # Auth logic (bcrypt, JWT generation)
│   ├── productService.ts # Product queries, seed data
│   └── cartService.ts    # Cart operations
├── models/               # Mongoose schemas
│   ├── userModel.ts
│   ├── productModel.ts
│   ├── cartModel.ts
│   └── orderModel.ts
├── middleware/
│   └── validateJWT.ts    # JWT verification middleware
└── types/
    └── extendedRequest.ts # Express Request with user property
```

**Key Pattern**: Routes → Services → Models. Business logic lives in services, not routes.

### Frontend Structure (Context API)

```
frontend/src/
├── App.tsx               # Root with React Router
├── main.tsx              # Entry point with providers
├── pages/                # Full-page components
│   ├── home.tsx          # Product listing
│   ├── login.tsx
│   ├── register.tsx
│   └── cart.tsx          # Protected route
├── components/
│   ├── navbar.tsx        # Shows auth status, cart badge
│   ├── productCard.tsx   # Reusable product display
│   └── protectedRoute.tsx # Route guard
├── context/              # Global state management
│   ├── auth/
│   │   ├── authContext.ts
│   │   └── authProvider.tsx
│   └── cart/
│       ├── cartContext.ts
│       └── cartProvider.tsx
├── types/                # TypeScript interfaces
│   ├── products.ts
│   ├── cart.ts
│   └── response.ts
└── constants/
    └── baseUrl.ts        # API configuration
```

**Key Pattern**: Context providers wrap App for global state (auth, cart). Components consume via `useAuth()` and `useCart()` hooks.

## Authentication Flow

1. User submits credentials to `/api/user/register` or `/api/user/login`
2. Backend service validates, hashes password (bcrypt), generates JWT
3. Frontend stores token in AuthProvider context
4. Protected routes use ProtectedRoute component to check `isAuthenticated`
5. API requests include `Authorization: Bearer <token>` header
6. Backend validateJWT middleware verifies token and attaches user to request

## API Communication

- **CORS**: Backend allows `http://localhost:5173` with credentials
- **Response Format**: `{success: boolean, message?: string, data?: any, token?: string}`
- **Protected Endpoints**: Require JWT in Authorization header

## Database Models

All models use Mongoose with TypeScript interfaces:
- **User**: firstName, lastName, email, password (hashed)
- **Product**: title, image, price, stock
- **Cart**: User's cart items
- **Order**: Order history

## Styling

Frontend uses Material-UI (MUI) with Emotion for styling. All components should use MUI components for consistency.

## Important Notes

- Backend uses ES modules (`"type": "module"` in package.json)
- TypeScript strict mode enabled in both frontend and backend
- Frontend uses Vite with SWC for fast builds
- Backend seeds initial products automatically on startup via `seedInitialProduct()`
- All file imports in backend must include `.js` extension (TypeScript compiled output)
