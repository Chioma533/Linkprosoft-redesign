# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start the development server with Vite (default port 3000)
- `npm run build` - Build the application for production
- `npm run lint` - Run Oxlint for code linting
- `npm run preview` - Preview the production build locally
- Debug logging: Use the `debugLog` utility from `src/utils/debugLogger.js` to log to localStorage and console. Retrieve logs with `getDebugLogs()`.

## Code Architecture & Structure

### Tech Stack
- React 19
- Vite
- Tailwind CSS
- React Router v7
- Zustand (state management)
- Axios (HTTP client)
- Framer Motion (animations)
- React Hot Toast (notifications)

### Project Structure
The project follows a organized structure with the following top-level directories under `src/`:
- `api/` - API service layer
- `assets/` - Static assets (images, icons)
- `components/` - Reusable UI components (organized by feature and type)
- `constants/` - Constant values and data
- `hooks/` - Custom React hooks
- `layouts/` - Page layout components
- `pages/` - Route handlers (pages)
- `routes/` - Route definitions and protected routes
- `services/` - API service implementations
- `stores/` - Zustand stores
- `utils/` - Utility functions
- `App.jsx` - Root application component

### Key Architectural Patterns

#### State Management
- Global state is managed exclusively with Zustand stores (in `src/store`)
- Context API is only used when required by third-party providers
- Page-specific UI state should remain local to components
- Examples: `authStore.js` (authentication), `dashboardStore.js` (dashboard data)

#### API Layer
- All backend requests must go through the service layer
- Components and pages should never import or use Axios directly
- Flow: Component → Page → Service → axiosInstance → Backend
- Services are organized by resource (authService, projectService, notificationService, etc.)
- `axiosInstance` includes interceptors for:
  - Automatically attaching JWT tokens from localStorage
  - Request/response logging via debugLog utility
  - Error handling (redirect to login on 401, etc.)

#### Routing & Authentication
- React Router v7 for client-side routing
- `PrivateRoutes` component protects routes based on user roles
- Authentication role hierarchy: employer, professional, admin
- JWT tokens stored in localStorage with automatic refresh via axios interceptors
- Public routes: landing page, auth pages (login, signup, password reset)
- Protected routes: dashboards and role-specific sections

#### Styling
- Tailwind CSS exclusively for styling
- No custom CSS or CSS-in-JS solutions
- Consistent spacing, typography, colors, and responsive layouts
- Accessibility considerations in component design

#### Components & Pages
- Components: Reusable, presentation-focused, receive props and emit callbacks
- Pages: Coordinate application state, compose components, call Zustand actions
- Pages should not exceed 200 lines; extract reusable sections when needed
- Components should not make API calls or manage global state directly

#### Mock Data
- Services use realistic mock data when backend APIs are unavailable
- Mock data mirrors backend response structures
- Mock data is isolated in services for easy replacement with real API responses

### Common Directories & Files

#### Stores (`src/store/`)
- `authStore.js` - Authentication state (user, token, login/logout actions)
- `dashboardStore.js` - Dashboard data (jobs, applications, metrics, etc.)

#### Services (`src/api/services/`)
- `authService.js` - Authentication endpoints (signup, login, password reset)
- `projectService.js` - Job and application endpoints
- `notificationService.js` - Messages, notifications, performance metrics

#### Components (`src/components/`)
- Reusable UI elements like buttons, cards, modals, navigation items
- Organized by feature (buyer, employer, professional) and type (common, layout, ui)

#### Pages (`src/pages/`)
- Route handlers for different sections of the application
- Organized by user role (auth, buyer, employer, professional, admin, professionals)

#### Layouts (`src/layouts/`)
- `DashboardLayout.js` - Common layout for dashboard pages with sidebar and navbar
- `AuthLayout.js` - Layout for authentication pages
- Landing page layout components

#### Hooks (`src/hooks/`)
- Custom React hooks like `useJobFilter.js`, `usePagination.js`, `useExport.js`

#### Utils (`src/utils/`)
- `axiosInstance.js` - Configured axios instance with interceptors
- `apiPaths.js` - Centralized API endpoint definitions
- `debugLogger.js` - Debug logging utility
- Helper functions for formatting, currency, status, etc.

### Development Guidelines

1. **State Updates**: Use Zustand stores for global state, never lift state unnecessarily
2. **API Calls**: Always go through services, never call axios directly from components
3. **Component Reusability**: Prioritize reusing existing components over creating new ones
4. **File Size**: Keep pages under 200 lines, components focused and small
5. **Styling**: Use Tailwind utility classes exclusively
6. **Error Handling**: Services throw errors that are caught and handled in stores/components
7. **Authentication**: Use `useAuth` hook or `useAuthStore` for auth state in components
8. **Routing**: Use `useNavigate` from react-router-dom for programmatic navigation
9. **Mock Data**: Trust service fallbacks to mock data when backend is unavailable
10. **Logging**: Use `debugLog` for development debugging that persists across reloads

This structure ensures maintainability, scalability, and adherence to the project's architectural conventions.