# Figma → Frontend Implementation Prompt

Purpose
- Analyze a Figma design (file or selected frames) and extract a complete, production-ready design system: color tokens, typography, spacing, grid, component map, and assets.
- Implement the design in a frontend codebase so the page(s) look visually identical to the Figma design.
- Provide automated and manual cross-checks against the uploaded Figma design to verify fidelity.

Inputs (required)
- `figma_file_url` (or uploaded Figma .fig export): Figma file link or file upload.
- `frame_ids` (optional): list of frame IDs to target; otherwise analyze the entire file and select top-level frames.
- `output_dir` (optional): workspace directory to write tokens, components, and pages. Default: `src/design-system/figma-export`.
- `component_naming` (optional): naming convention, e.g. `PascalCase` or `kebab-case`.
- `platform` (optional): `react`, `react-native`, `html-css`, `tailwind` (default: `react`).

Primary Deliverables
1. `tokens.json` — normalized design tokens for colors, typography, spacing, radii, shadows, z-index, breakpoints.
2. `design-spec.md` — human-readable spec listing extracted values, token mapping, and example usage.
3. `components/` — a folder of reusable components (JSX/TSX files) implemented according to the design.
4. `styles/` — CSS variables or Tailwind config fragments mapping tokens to runtime styles.
5. `pages/` — implemented page(s) that reproduce the Figma frame(s) structure and layout.
6. `verification/` — scripts and checklists to cross-check Figma ↔ implemented output (visual diff thresholds, token diffs).

High-level Workflow
1. Analyze & Extract Tokens
  - Use Figma API to fetch nodes for the provided `frame_ids` or top-level frames.
  - Extract color swatches (fills), type styles (font family, weight, size, line-height, letter spacing), spacing tokens (margins/paddings/gaps based on 4/8px scale if present), radii, shadows, and any grid/column values.
  - Normalize tokens: adopt a consistent naming scheme (`color.primary.500`, `font.body.16/24`, `space.x4`), include hex/rgba values and contrast notes.
  - Produce `tokens.json` and a CSS variables file (`:root { --color-primary-500: #... }`).

2. Create Component Map
  - Traverse the frames and identify repeated patterns (buttons, inputs, cards, lists, headers, navbars, hero sections, badges, avatars).
  - For each pattern, define a component interface (props) with clear responsibilities (appearance tokens, spacing, content slots).
  - Prioritize small, composable components (Button, IconButton, Card, Avatar, Typography, Container, Grid).

3. Implement Reusable Components & Token Wiring
  - Implement components in the chosen platform (`react` default) using token variables for styles.
  - Create shared style primitives: `colors.css` (or `tokens.css`), `typography.css`, `spacing.css`.
  - Add color variables, font-face loading instructions (if custom fonts required), and base typography rules.

4. Build Page Structure
  - Implement page(s) by composing components to match frame hierarchy. Keep structure semantically accurate (header, nav, main, aside, footer).
  - Use layout helpers (Flex, Grid, Container) to reproduce spacing and alignment.

5. Style & Pixel-tune Using Tokens
  - Apply extracted tokens across components; ensure margins, paddings, line-heights, and font-sizes precisely match the Figma values.
  - Use exact color values; where Figma uses opacity/overlays, replicate with rgba/alpha tokens.

6. Verify Fidelity vs Figma
  - Programmatic checks:
    - Token diff: compare `tokens.json` vs a new extraction from Figma; report mismatches.
    - Node/bounding-box comparison: using Figma node positions and computed DOM element positions; compute pixel offsets and report max delta.
  - Visual checks:
    - Generate screenshots of Figma frames (via Figma images endpoint) and of implemented pages; run a pixel-diff (e.g., `pixelmatch`) with configurable tolerance.
    - Produce a verification report with per-layer pass/fail and a suggested fix list.

7. Deliver Documentation & Examples
  - `README.md` describing how to run the verification, where tokens and components are located, and how to maintain parity with Figma.
  - Example story/demo page that shows components with token variants (primary/secondary/disabled).

Agent Behavior & Instructions
- Be conservative with changes: do not rename or remove existing workspace files without confirmation.
- When encountering ambiguous design artifacts (e.g., multiple fills, nested masks, or boolean operations), flag them in the `design-spec.md` and request clarification.
- Prefer predictable token naming and include a `mapping.md` that links Figma style names → token names.
- Include fallbacks for fonts and image assets; if fonts are proprietary, list the exact font family and provide a webfont or replacement suggestion.

Verification Goal (explicit)
- The agent must reference the uploaded Figma design and automatically cross-check the implemented page(s). The final verification report must include:
  - Token parity summary (colors, fonts, spacing): pass/fail per token with delta values.
  - Layout parity summary: per-frame pixel diff (max, mean) and element-level mismatches where possible.
  - Visual diff images and a checklist of remaining items to reach visual parity.

Output Formats (recommended)
- `tokens.json` (machine-readable)
- `design-spec.md` (markdown summary)
- `components/` (JSX/TSX files)
- `styles/` (CSS or Tailwind fragment)
- `verification/report.json` and `verification/report.html` with visual diffs

Example Invocation

```json
{
  "figma_file_url": "https://www.figma.com/file/ABC123/example",
  "frame_ids": ["123:45", "123:46"],
  "output_dir": "src/design-system/figma-export",
  "platform": "react",
  "component_naming": "PascalCase"
}
```

Clarifying Questions (prompt should ask these if missing)
- Which frames are the primary pages to implement?
- Are we allowed to add new files and modify project config (build, css, tailwind)?
- Which breakpoints should be considered canonical for responsive behavior?
- Are visual diffs allowed to be approximate (e.g., 2–4px tolerance) or require pixel-perfect?

Edge Cases & Notes
- If Figma uses complex vector effects or masks that cannot be replicated exactly in CSS, provide a raster fallback and document the deviation.
- If multiple color names map to the same value, unify the tokens but keep an alias mapping to original names.
- For components with content variability (e.g., dynamic length text), implement natural truncation/ellipsis rules matching Figma.

Suggested Next Steps After Running the Prompt
- Run the verification suite and iterate on high-delta elements.
- Extract responsive variants (mobile/tablet/desktop) and repeat verification per breakpoint.
- Optionally commit token files and component stubs to a `design-system` branch for review.

Customization Suggestions
- Add a `--tailwind` flag to emit `tailwind.config.js` theme overrides from tokens.
- Add a `--stories` flag to output Storybook stories for each extracted component.
- Add a `--chromatic` or `--percy` integration to automate visual regression in CI.

Human-readable Summary (to display back to the user)
- This prompt analyzes Figma frames, extracts tokens and components, implements reusable components wired to tokens, constructs page(s) to match the frames, and runs automated cross-checks to report visual/token/layout parity against the source design.

---

If you want, I can now:
- Save this prompt into `.prompts/figma-to-frontend.prompt.md` (done).
- Run the prompt locally against a Figma file you provide.
- Generate the initial token extraction and component stubs in the repo.
