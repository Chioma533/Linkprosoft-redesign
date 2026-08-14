---
description: "Use the Darkify agent to extract Figma design tokens and implement a dark/default/white theme in the app stylesheet."
name: "darkify-theme-extraction"
argument-hint: "Provide the Figma file URL/key and token, plus any target framework or token format preferences."
agent: "darkify"
---

Use the implementation guide and workflow in @file:darkify.agent.md as the authoritative behavior for this task.

Goal
- Extract design tokens from a Figma file and convert them into theme-ready CSS variables.
- Implement dark/default/white styling in the repo with the smallest possible, maintainable change set.
- Update the primary stylesheet, especially `src/index.css`, so the app supports a theme toggle without breaking existing UI.

Required inputs
- `figma_file_id` or `figma_file_url` (required)
- `figma_token` (required)
- `framework` (optional; default: `react+tailwind`)
- `token_format` (optional; `css-variables`, `tailwind-config`, or `both`)

Required behavior
1. Ask for the Figma file URL/key and personal access token before accessing the file.
2. If the user does not provide a valid `figma_file_id`/`figma_file_url` or a valid `figma_token`, stop and request valid credentials.
3. Use the Darkify workflow to fetch colors, text styles, and other design tokens from the Figma file.
4. Normalize tokens into a consistent semantic structure for `default`, `dark`, and `white` themes.
5. Apply the extracted values to the codebase, prioritizing `src/index.css`, and ensure the theme variables are compatible with the existing app styling.
6. Keep the implementation minimal and maintainable: prefer CSS variables and existing React/Tailwind conventions over broad rewrites.
7. Summarize the token mapping, files changed, and any manual review items that remain.

Constraints
- Never store Figma tokens in the repo.
- Never access a Figma file without explicit user-provided credentials.
- Prefer small, reversible changes to the existing design.
- Preserve current app behavior while adding dark-theme support.
- If the design is ambiguous, request clarification instead of guessing.

Example invocations
- "Darkify this repo using Figma file URL https://www.figma.com/file/ABC123 and token ABC123. Extract tokens and apply them to src/index.css with dark/default/white themes."
- "Use Figma file ID xyz123 and token TOKEN_456 to generate CSS variables for the app theme and wire a default/dark/white toggle."

Output expectations
- A clear token summary for the extracted Figma values
- CSS variables or equivalent theme output in the project stylesheet
- Minimal theme support for `default`, `dark`, and `white` modes
- Any required follow-up notes for manual refinement or QA

This prompt should be treated as repo-scoped and production-safe: it should use the Darkify agent’s rules to safely convert Figma tokens into a usable theme implementation without exposing secrets or breaking the app.
