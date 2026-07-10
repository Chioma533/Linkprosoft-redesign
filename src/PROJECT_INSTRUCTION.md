# Linkprosoft Frontend Development Guidelines

You are contributing to a production-grade React application built with Vite and Tailwind CSS.

## General Principles

- Follow the existing folder structure exactly. Do not create new architectural patterns unless explicitly requested.
- Keep the codebase clean, scalable, and easy to maintain.
- Prioritize readability over clever implementations.
- Follow modern React best practices.

---

## Component Architecture

- Any component that is likely to be used more than once **must be extracted into a reusable component immediately.**
- Avoid duplicated JSX.
- Components should be composable.
- UI components should be generic and configurable through props.

Examples:

- Button
- Input
- Modal
- Card
- Badge
- Avatar
- Empty State
- Loading Spinner
- Search Input
- Pagination
- Table

---

## API-Driven UI

Assume all displayed data comes from APIs.

- Never hardcode business data inside components.
- Design components around data received from APIs.
- Support loading, empty, success, and error states.
- When APIs are unavailable, use mock objects that mirror the expected API response.

---

## Production Mindset

Every feature should include:

- Loading states
- Error handling
- Empty states
- Responsive design
- Accessibility where applicable
- Semantic HTML
- Clean component composition

Avoid placeholder implementations that would require major rewrites later.

---

## Code Organization

- No page/component should exceed **200 lines**.
- If a file approaches 200 lines, extract logical sections into child components.
- Keep related code together.

---

## Business Logic

Business logic **should remain close to the page or feature that owns it.**

Do **not** move business logic into unrelated utility folders simply for the sake of abstraction.

Examples of business logic include:

- form submission
- filters
- pagination
- searching
- sorting
- modal state
- page-specific calculations

If the logic is only used by one page, keep it with that page.

Extract logic only when:

- it is reused by multiple pages
- it becomes complex enough to deserve a custom hook
- it represents shared application behavior

---

## API Layer

All backend communication should go through the existing API/service layer.

Components should never make raw fetch or axios requests directly.

---

## State Management

- Keep state as local as possible.
- Lift state only when necessary.
- Avoid unnecessary global state.

---

## Styling

Use Tailwind CSS exclusively.

- Prefer reusable utility combinations.
- Maintain consistent spacing.
- Maintain consistent typography.
- Follow the existing design system.

---

## Naming

Use clear descriptive names.

Examples:

EmployerDashboard.jsx

ProfessionalCard.jsx

JobApplicationTable.jsx

CompanyProfileForm.jsx

Avoid vague names like:

Component1

DataCard

Temp

Test

---

## Performance

- Memoize only when necessary.
- Avoid unnecessary re-renders.
- Lazy load large pages where appropriate.
- Avoid premature optimization.

---

## Quality

Before producing code, verify that:

- It follows the existing project structure.
- It does not duplicate existing components.
- Reusable UI has been extracted.
- The page remains under 200 lines.
- Business logic stays with the owning feature unless genuinely shared.
- The code is production-ready rather than a quick prototype.

# Linkprosoft Frontend Architecture Rules

These rules are mandatory for every new feature, component, page, hook, or API integration.

---

# 1. Folder Responsibilities

Every directory has a single responsibility.

## api/

Responsible for:

* API client configuration
* Authentication interceptors
* Endpoint definitions
* Feature service files

Never place UI or business logic here.

---

## features/

Each feature owns its business logic.

A feature may contain:

* pages
* components
* hooks
* constants
* helpers

Business logic should remain inside its owning feature unless shared by multiple features.

---

## components/

Contains reusable presentation components only.

Examples:

* Button
* Input
* Select
* SearchBar
* Modal
* Card
* EmptyState
* Avatar
* Spinner
* Badge

Components should never contain business logic.

---

## layouts/

Responsible for application layouts.

Examples:

LandingLayout

EmployerLayout

ProfessionalLayout

Each layout owns:

* Navbar
* Sidebar
* Footer
* Layout wrappers

---

## hooks/

Contains reusable custom hooks.

Examples:

useDebounce

usePagination

useModal

useSearch

useInfiniteScroll

Never create hooks used by only one component.

---

## context/

Contains global application state only.

Examples:

Authentication

Theme

User Session

Permissions

Notifications

Never store page-specific state inside Context.

---

## constants/

Contains application constants.

Examples:

Routes

Roles

Status values

Validation messages

Static configuration

Never place business logic here.

---

## config/

Contains project configuration.

Examples:

Environment

Navigation configuration

Sidebar configuration

Table configuration

Feature flags

---

## utils/

Pure helper functions only.

Utilities should never call APIs.

Utilities should never modify React state.

---

# 2. Reusable Component Rules

Before creating any component ask:

"Can another page use this?"

If YES

Extract immediately.

Examples:

Button

Input

Search Input

Password Input

OTP Input

TextArea

Checkbox

Radio

Select

Modal

Dialog

Drawer

Alert

Toast

Pagination

Table

Empty State

Loader

Skeleton

Avatar

Badge

Tag

Stat Card

Metric Card

No duplicated JSX is allowed.

---

# 3. Forms

Every form should be API-ready.

Forms should support:

loading

validation

disabled state

server validation

success state

error state

future API integration

Avoid hardcoded submit handlers.

Every form should expose clean payloads ready for backend submission.

---

# 4. Input System

All inputs must be built on a shared Input component.

Every specialized input should extend the shared Input.

Examples:

Text Input

Email Input

Password Input

Phone Input

Search Input

OTP Input

Verification Code Input

TextArea

Date Picker

Select

The Input component should support:

label

placeholder

error message

helper text

required

disabled

loading

left icon

right icon

password toggle

API validation state

React Hook Form compatibility

className overrides

forwardRef

No page should create its own custom input unless absolutely necessary.

---

# 5. API Integration

Build every screen assuming APIs already exist. (login and signup apis already exists)

Never hardcode business data.

Every page should consume services.

Components never call fetch or axios directly.

Example flow:

Component

↓

Feature Hook

↓

API Service

↓

API Client

↓

Backend

---

# 6. Authentication Architecture

Authentication screens should be production-ready.

Include support for:

Login

Registration

Forgot Password

Reset Password

Email Verification

Phone Verification

OTP Verification

Session persistence

Protected routes

Token refresh

Loading states

Error handling

Role-based redirects

Even if backend endpoints are not yet available.

---

# 7. Feature Architecture

Every major feature should remain self-contained.

Example:
api/

assets/

features/

routes/

pages/

components/
   |___common
   |___layout
   |___ui

hooks/

constants/

context/

config/

utils/

Avoid mixing employer code with professional code.

---

# 8. Page Responsibilities

Pages orchestrate features.

Pages should:

call hooks

compose components

manage page state

coordinate API calls

Pages should NOT contain massive JSX blocks.

Pages should NOT contain reusable UI.

Maximum page size:

200 lines.

---

# 9. Component Responsibilities

Components should:

display data

emit events

receive props

remain reusable

Avoid API calls inside components.

Avoid application state inside components.

---

# 10. Error Handling

Every async operation should handle:

loading

success

empty

error

retry

offline state

Never ignore promise failures.

---

# 11. Naming Convention

Components

PascalCase

Button.jsx

SearchBar.jsx

EmployerNavbar.jsx

Hooks

camelCase beginning with use

useAuth

useEmployer

useSearch

Services

camelCase ending with Service

authService.js

profileService.js

Files should describe their responsibility.

Avoid generic names.

---

# 12. Scalability

Code should be written assuming:

100+ pages

50+ API endpoints

multiple developers

future mobile application

future admin dashboard

future internationalization

Avoid architecture that only works for today's requirements.

---

# 13. Final Validation

Before generating any code verify:

✓ Existing reusable component cannot solve the problem.

✓ Business logic stays inside its feature.

✓ API layer is respected.

✓ Folder responsibilities are respected.

✓ No duplicated JSX exists.

✓ Page remains below 200 lines.

✓ UI is API-ready.

✓ Components remain reusable.

✓ Code is production-ready.

Do not optimize for speed of generation.

Optimize for maintainability, scalability, readability, and long-term development.
