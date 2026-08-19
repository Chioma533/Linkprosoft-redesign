---
description: "Use the Darkify agent to extract theme colors from a Figma file, design snapshot, uploaded image, or mockup and implement a dark/default/white theme in the app stylesheet."
name: "darkify-theme-extraction"
argument-hint: "Provide the Figma file URL/key and token if available, or upload the mockup/screenshot/snapshot to infer the HEX palette."
agent: "darkify"
---

Use the implementation guide and workflow in @file:darkify.agent.md as the authoritative behavior for this task.

Goal
- Extract design tokens from a Figma file, mockup, uploaded image, or design snapshot and convert them into theme-ready CSS variables.
- Produce a dark theme palette in HEX values and apply it to the repo with the smallest possible, maintainable change set.
- Update the primary stylesheet, especially `src/index.css`, so the app supports a theme toggle without breaking existing UI.

Required inputs
- `source_reference` (required): a Figma file URL/key, uploaded mockup image, screenshot, or design snapshot
- `figma_file_id` or `figma_file_url` (optional if direct Figma access is not available)
- `figma_token` (optional if using a mockup or image-based source)
- `framework` (optional; default: `react+tailwind`)
- `token_format` (optional; `css-variables`, `tailwind-config`, or `both`)

Required behavior
1. Determine the available source: direct Figma access, uploaded mockup, or image snapshot.
2. If Figma access is available, fetch colors and text styles via the Figma API.
3. If Figma access is unavailable, analyze the provided screenshot/mockup/snapshot and estimate the dominant dark theme palette in HEX values.
4. Normalize tokens into a consistent semantic structure for `default`, `dark`, and `white` themes.
5. Apply the extracted values to the codebase, prioritizing `src/index.css`, and ensure the theme variables are compatible with the existing app styling.
6. Keep the implementation minimal and maintainable: prefer CSS variables and existing React/Tailwind conventions over broad rewrites.
7. Summarize the token mapping, files changed, and any manual review items that remain.

Constraints
- Never store Figma tokens in the repo.
- When direct Figma access is unavailable, use the uploaded image or mockup as the primary extracted source.
- Prefer small, reversible changes to the existing design.
- Preserve current app behavior while adding dark-theme support.
- If the design is ambiguous, request clarification instead of guessing.
- Convert extracted colors into HEX values for the dark theme implementation.

Example invocations
- "Darkify this repo using the attached mockup image and extract the dominant HEX palette for a dark/default/white theme. Apply the tokens to src/index.css."
- "Use the Figma file if available; otherwise infer the dark theme palette from the uploaded design snapshot and generate CSS variables for the app."
- "Extract a dark theme color system from the provided screenshot and map it to Tailwind-compatible theme tokens."

Output expectations
- A clear token summary for the extracted colors in HEX format
- CSS variables or equivalent theme output in the project stylesheet
- Minimal theme support for `default`, `dark`, and `white` modes
- Any required follow-up notes for manual refinement or QA

This prompt should be treated as repo-scoped and production-safe: it should use the Darkify agent’s rules to safely convert visual references, mockups, snapshots, and optional Figma access into a usable dark theme implementation without exposing secrets or breaking the app.
