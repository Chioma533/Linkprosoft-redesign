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
