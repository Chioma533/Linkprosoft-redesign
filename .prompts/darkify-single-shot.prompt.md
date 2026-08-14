---
description: "Single-shot Darkify implementation: extract Figma tokens and directly apply a default/dark/white theme to the app stylesheet."
name: "darkify-single-shot"
argument-hint: "Provide the Figma file URL/key and token, then optionally specify the target framework and desired token output format."
agent: "darkify"
---

Run a single-pass implementation using @file:darkify.agent.md.

Goal
- Immediately extract design tokens from the provided Figma file and implement them in the existing app styling.
- Update the theme system with `default`, `dark`, and `white` modes using the simplest maintainable structure.
- Prioritize direct changes in `src/index.css` while keeping the rest of the app stable.

Required inputs
- `figma_file_id` or `figma_file_url` (required)
- `figma_token` (required)
- `framework` (optional; default: `react+tailwind`)
- `token_format` (optional; `css-variables`, `tailwind-config`, or `both`)

Execution rule
1. Before any Figma fetch, request the user to provide a valid Figma file URL/key and a valid personal access token.
2. If either value is missing or invalid, stop and ask for valid credentials.
3. Use the Figma token and file access to pull the relevant color and typography tokens.
4. Normalize the tokens into semantic theme values for `default`, `dark`, and `white`.
5. Apply the theme variables directly to the app stylesheet and keep the implementation aligned with the current React + Tailwind setup.
6. Preserve existing layout and UI behavior; do not introduce broad refactors.
7. Return a concise summary of the extracted tokens, the files changed, and any remaining manual verification notes.

Constraints
- Never commit or store the Figma token in the repo.
- Never access the Figma file without explicit user permission and valid credentials.
- Keep this scoped to UI styling and theme tokens; no unrelated refactors.
- Prefer CSS variables and minimal CSS changes over large-scale rewrites.

Example invocation
- "Use Figma file URL https://www.figma.com/file/ABC123 with token ABC123 and apply the extracted theme tokens directly to src/index.css in dark/default/white modes."

Expected output
- Theme variables or equivalent styling changes for the current app
- Clear mapping from Figma tokens to runtime theme values
- A brief implementation summary with any manual QA follow-ups

This is a single-shot task: perform the extraction and implementation in one pass, without waiting for a multi-step workflow.
