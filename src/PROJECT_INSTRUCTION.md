# Linkprosoft Frontend Development Guide

## Tech Stack

* React 19
* Vite
* Tailwind CSS
* React Router
* Zustand
* Axios
* Framer Motion
* React Hot Toast

---

# Project Folder Structure

Use this structure exactly.

```
src/
│
├── api/
│
├── assets/
│   ├── images/
│   ├── icons/
│
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│
├── config/
│
├── constants/
│
├── hooks/
│
├── layouts/
│
├── pages/
│
├── routes/
│
├── services/
│
├── stores/
│
├── utils/
│
└── App.jsx
```

Do not introduce a Feature-Based Architecture unless explicitly instructed.

---

# State Management

This project uses **Zustand** as the global state management solution.

Do **NOT** introduce Redux or Context API for application state.

Context should only be used if React itself requires it (for example, third-party providers).

Global state belongs inside Zustand stores.

Examples:

* authStore
* dashboardStore
* notificationStore
* projectStore

Keep page-specific UI state local.

Examples:

* modal visibility
* selected tab
* search input
* filters
* pagination

Do not move local state into Zustand unnecessarily.

---

# API Layer

Every backend request must go through the Service layer.

Flow:

```
Component
        ↓
Page
        ↓
Service
        ↓
axios
        ↓
Backend
```

Components must never import Axios directly.

Pages should never call Axios directly.

---

# Services

Each service owns one backend resource.

Examples:

```
authService.js

projectService.js

profileService.js

notificationService.js
```

Services should only contain API communication.

Never place UI logic inside services.

---

# Zustand Stores

Stores manage global application state.

Stores may:

* call services
* update state
* expose actions

Stores should NOT contain UI rendering logic.

Example:

```
stores/

authStore.js

dashboardStore.js

projectStore.js
```

---

# Components

Components are reusable UI.

Components should:

* receive props
* emit callbacks
* remain reusable
* remain presentation-focused

Components should NOT:

* call APIs
* manage global application state
* contain business rules

---

# Pages

Pages coordinate the application.

Pages should:

* compose reusable components
* call Zustand actions
* coordinate navigation
* manage page-specific state

Pages should not exceed **200 lines**.

If a page becomes too large, extract reusable sections into components.

---

# Mock Data

Until backend APIs are completed, use realistic mock data.

Mock data should mirror backend response structures.

Do not hardcode mock data directly inside components.

Keep mock data isolated so it can easily be replaced with API responses later.

---

# Authentication

Authentication uses:

* Zustand
* authService
* axiosInstance

Support:

* Login
* Signup
* Forgot Password
* Reset Password
* OTP Verification
* Session Persistence
* Protected Routes
* Role-Based Access

---

# Styling

Use Tailwind CSS exclusively.

Maintain:

* consistent spacing
* typography
* colors
* responsive layouts
* accessibility

---

# Naming

Components:

```
ProfessionalCard.jsx
DashboardSidebar.jsx
NotificationDropdown.jsx
```

Stores:

```
authStore.js
dashboardStore.js
projectStore.js
```

Services:

```
authService.js
projectService.js
```

Hooks:

```
useDebounce.js
usePagination.js
```

Avoid generic names like:

* temp
* data
* helper1
* component2

---

# Code Quality Checklist

Before generating code, verify that:

* Existing reusable components are reused where possible.
* No duplicate JSX is introduced.
* Pages remain under 200 lines.
* Components stay reusable.
* Business logic stays close to the page unless globally shared.
* APIs are accessed only through services.
* Global state is managed with Zustand.
* Components do not make API calls directly.
* Code is production-ready, maintainable, and scalable.
