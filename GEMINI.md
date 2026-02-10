# GEMINI.md: Project Context for AI Agent

This document provides a summary of the `web` project to give context to the Gemini AI agent.

## 1. Project Overview

This is a web-based TRPG (Tabletop Role-Playing Game) application. The frontend is built using a modern toolchain:

*   **Framework**: React 19
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS with the DaisyUI component library.
*   **Routing**: `react-router-dom` for client-side routing.
*   **State Management**: Zustand for global state management.
*   **API Communication**: `axios` for making HTTP requests to a backend server.

The application architecture features:
*   A clear separation of concerns using directories for `pages`, `components`, `hooks`, `services`, and `store`.
*   Protected routes for authenticated users, enforced by a Higher-Order Component (HOC) located in `src/hoc/withAuth.tsx`.
*   Global state for authentication is managed by `useAuthStore` and is persisted in `sessionStorage`, keeping the user logged in for the duration of the session.

## 2. Building and Running

### Prerequisites
- Node.js and a package manager (npm or yarn) are required.

### Installation
Install project dependencies by running:
```bash
npm install
# or
yarn install
```

### Development
To run the local development server:
```bash
npm run dev
```
The application will be available at **http://localhost:8010**. Note that the port is configured in `vite.config.ts`.

### Building for Production
To create a production-ready build:
```bash
npm run build
```
This command first runs the TypeScript compiler (`tsc`) to check for type errors and then uses Vite to bundle the application. The output will be in the `dist` directory.

### Linting
To check the code for style and quality issues:
```bash
npm run lint
```

## 3. Development Conventions

### File Structure
The `src` directory is organized as follows:
- **`apiinterceptor.ts`**: Configures the `axios` instance for making centralized API calls.
- **`pages/`**: Contains top-level components for each page/route (e.g., `login.tsx`, `gamemain.tsx`).
- **`components/`**: Contains reusable UI components used across different pages.
- **`store/`**: Holds Zustand store definitions for global state management (e.g., `useAuthStore.ts`).
- **`services/`**: Intended for modules that handle external communication, such as API service functions.
- **`hooks/`**: Contains custom React hooks to encapsulate and reuse stateful logic.
- **`hoc/`**: Contains Higher-Order Components, such as `withAuth.tsx` for route protection.
- **`assets/`**: Static assets like images and SVGs.

### Routing
- Routing is defined in `src/App.tsx`.
- Routes requiring authentication (e.g., `/create-char`, `/gamemain`) are wrapped in the `withAuth` HOC.
- Unauthenticated users accessing a protected route will be redirected. Any path not explicitly defined redirects to `/login`.

### State Management
- Global state is managed with Zustand.
- The `useAuthStore` (`src/store/useAuthStore.ts`) is responsible for storing `access_token` and `refresh_token`.
- This store is configured to persist its state to `sessionStorage`, allowing the user's session to remain active across page reloads but not when the browser tab is closed.

### Styling
- Styling is done using Tailwind CSS utility classes.
- The DaisyUI component library is used for higher-level UI components (`btn`, `card`, `input`, etc.), ensuring a consistent look and feel.

### API Calls
- `axios` is the designated client for HTTP requests.
- An API interceptor (`apiinterceptor.ts`) is in place, likely to handle tasks like adding authentication headers to outgoing requests and managing token refreshes.
