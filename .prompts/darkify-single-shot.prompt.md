---
description: "Single-shot Darkify implementation: extract design tokens from a mockup, screenshot, or Figma file and directly apply a default/dark/white theme to the app stylesheet with HEX values."
name: "darkify-single-shot"
argument-hint: "Provide the Figma file URL/key and token if available, or upload the mockup/screenshot/snapshot to infer the HEX palette."
agent: "darkify"
---

Run a single-pass implementation using @file:darkify.agent.md.

Goal
- Immediately extract design tokens from the provided visual source and implement them in the existing app styling.
- Update the theme system with `default`, `dark`, and `white` modes using the simplest maintainable structure.
- Prioritize direct changes in `src/index.css` while keeping the rest of the app stable.
- Prefer HEX-based dark theme values extracted from screenshots, mockups, or Figma visuals when no direct Figma access is available.

Required inputs
- `source_reference` (required): a Figma file URL/key, uploaded mockup image, screenshot, or design snapshot
- `figma_file_id` or `figma_file_url` (optional if direct Figma access is not available)
- `figma_token` (optional if using a mockup or image-based source)
- `framework` (optional; default: `react+tailwind`)
- `token_format` (optional; `css-variables`, `tailwind-config`, or `both`)

Execution rule
1. Identify the available design source: Figma file, uploaded screenshot, design snapshot, or mockup image.
2. If Figma access is available, use the Figma token and file access to pull the relevant color and typography tokens.
3. If Figma access is unavailable, analyze the uploaded mockup or screenshot and estimate the dark theme palette in HEX values.
4. Normalize the tokens into semantic theme values for `default`, `dark`, and `white`.
5. Apply the theme variables directly to the app stylesheet and keep the implementation aligned with the current React + Tailwind setup.
6. Preserve existing layout and UI behavior; do not introduce broad refactors.
7. Return a concise summary of the extracted tokens in HEX format, the files changed, and any remaining manual verification notes.

Constraints
- Never commit or store the Figma token in the repo.
- If direct Figma access is not available, use the uploaded visual source as the primary extraction source.
- Keep this scoped to UI styling and theme tokens; no unrelated refactors.
- Prefer CSS variables and minimal CSS changes over large-scale rewrites.
- Extract the dark theme color system as HEX values even when the reference is a screenshot or mockup.

Example invocation
- "Use the uploaded mockup image and extract the dark theme HEX palette directly to src/index.css with default/dark/white modes."
- "If Figma access is available, use it; otherwise infer the theme from the provided design snapshot and apply the HEX tokens to the app."

Expected output
- Theme variables or equivalent styling changes for the current app
- Clear mapping from design tokens to runtime theme values in HEX format
- A brief implementation summary with any manual QA follow-ups

This is a single-shot task: perform the extraction and implementation in one pass, without waiting for a multi-step workflow.
