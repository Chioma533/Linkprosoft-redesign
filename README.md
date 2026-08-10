# Linkprosoft Redesign

A modern, full‑stack web application built with React 19, Vite, and Tailwind CSS that provides role‑based dashboards for buyers, employers, and professionals.

## Key Features

- ��� � � ✅ Role‑based authentication (buyer, employer, professional, admin) using JWT tokens stored in localStorage  
- ��� � � ✅ Protected routing via `PrivateRoutes` component and React Router v7  
- ��� � � ✅ Global state management with Zustand stores (`authStore`, `dashboardStore`)  
- ��� � � ✅ Dedicated API service layer that centralizes Axios calls with automatic token handling and request/response logging  
- ��� � � ✅ Reusable UI components built exclusively with Tailwind CSS utility classes  
- ��� � � ✅ Development utilities: debug logging utility (`debugLog`) that persists across reloads  
- ��� � � ✅ Mock data fallbacks in services when backend APIs are unavailable  

## Tech Stack & Dependencies

| Language / Framework | Version / Purpose |
|----------------------|-------------------|
| React                | 19 – UI library |
| Vite                 | – Development server & bundler |
| Tailwind CSS         | – Styling (utility‑first) |
| React Router         | v7 – Client‑side routing |
| Zustand              | – Global state management |
| Axios                | – HTTP client (wrapped in `axiosInstance`) |
| Framer Motion        | – Animations |
| React Hot Toast      | – Notifications |
| Oxlint               | – Code linting (`npm run lint`) |

## Prerequisites

- **Node.js** ≥ 18.x (LTS recommended)  
- **npm** ≥ 9.x (comes with Node.js)  
- Git (to clone the repository)  

## Step‑by‑Step Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Chioma533/Linkprosoft-redesign.git
cd Linkprosoft-redesign

# 2. Install dependencies
npm install

# 3. (Optional) Create a .env file for environment variables.
#    See the Environment Variables section below for details.

# 4. Start the development server
npm run dev
```

The application will be available at **http://localhost:3000** by default.

## Environment Variables

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `VITE_API_BASE_URL` | Base URL for all API requests (used by `axiosInstance`) | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name shown in UI | `Linkprosoft` |

> **Note:** If a `.env` file is not present, the app will fall back to mock data defined in the service layer.

## Usage Examples

### Development

```bash
# Start hot‑reloading development server
npm run dev
```

### Production Build

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

### Linting

```bash
# Run Oxlint to check code quality
npm run lint
```

## API Reference & Core Architecture

All backend communication flows through the **service layer** located in `src/api/services/`. Components and pages never import Axios directly; they call the appropriate service function, which in turn uses the configured `axiosInstance` from `src/utils/axiosInstance.js`.

### Request Flow

```
Component / Page
        ��� � � ↓
Service (e.g., authService.js, projectService.js)
        ��� � � ↓
axiosInstance (with JWT interceptor & debug logging)
        ��� � � ↓
Backend API
```

### State Management

Global state is handled exclusively by **Zustand stores** in `src/store/`:
- `authStore.js` – manages user authentication state (user object, token, login/logout actions)  
- `dashboardStore.js` – stores dashboard‑specific data such as jobs, applications, and metrics  

Page‑level UI state should remain local to the component using React’s `useState` or `useReducer`.

### Routing & Authentication

- Public routes (landing, login, signup, password reset) are accessible without authentication.  
- Protected routes (dashboards, role‑specific sections) are wrapped by the `PrivateRoutes` component, which checks the user’s role from `authStore` and redirects unauthenticated users to the login page.  
- Role hierarchy: **employer** → **professional** → **admin** (admin can access all protected routes).

### Styling

Styling is done **exclusively** with Tailwind CSS utility classes. No custom CSS or CSS‑in‑JS solutions are used. This ensures consistent spacing, typography, colors, and responsive layouts across the application.

### Mock Data

When the backend is unreachable, each service automatically returns realistic mock data that mirrors the expected API response structure. This enables frontend development and testing without a live backend.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.
