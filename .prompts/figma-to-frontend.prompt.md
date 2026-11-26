You are implementing a Figma design in this existing codebase. Accuracy to the design AND consistency with the codebase are both hard requirements. Work in the phases below and do not skip ahead.

## Inputs
- Figma frame/link: [PASTE FIGMA LINK, including node-id]
- Target page/route: [e.g. /dashboard/settings]
- Reference pages already built (use these as the source of truth for layout and sizing): [e.g. src/pages/Home.tsx, src/pages/Profile.tsx]

## Phase 1: Learn the codebase first (no code yet)
1. Find the design system: theme/tokens file, Tailwind config, CSS variables, global styles, and the shared component library (buttons, inputs, cards, modals, typography, layout wrappers).
2. Read at least 2 existing pages that look similar to the target. Note and report back:
   - The page container: max-width, horizontal padding, vertical spacing, grid/column system
   - Heading sizes, body text sizes, font weights, line heights
   - Spacing scale, border radius, shadows, colors in use
   - Breakpoints and how existing pages behave responsively
   - Which shared components they use and how they are composed
3. Summarize this in a short "Design System Summary" before continuing.

## Phase 2: Analyze the Figma design
1. Pull the design context, a screenshot, and the variables/tokens for the frame via the Figma MCP tools.
2. List every section and element, with exact values from Figma: width/height, padding, gap, font size/weight/line-height, colors, radius, shadows, icon sizes.
3. Create a mapping table: Figma value -> closest existing design token or component.
   - If a Figma value matches a token, use the token.
   - If it is within a small tolerance of a token (e.g. 15px vs a 16px token), flag it and use the token, noting the discrepancy.
   - If nothing matches, flag it as a "gap" and ask me before creating a new token.
4. Identify which parts can be built from existing components and which need new ones.

## Phase 3: Plan
Give me a short implementation plan: files to create/edit, components to reuse, new components needed (with justification), and every deviation or gap from Phase 2. Wait for my approval if there are any gaps or ambiguities.

## Phase 4: Implement
Rules:
- Reuse existing components and tokens. Never hardcode colors, font sizes, or spacing that a token already covers.
- Do not use arbitrary values (e.g. w-[437px], #3A3A3A, inline styles) unless no token exists AND you flag it.
- Match the same page wrapper, container width, and padding as the reference pages so dimensions are consistent across the app.
- Do not use Figma's absolute positioning or fixed pixel widths for layout. Rebuild it with flex/grid so it is responsive; use the Figma frame size only to derive proportions, max-widths, and spacing.
- Follow the project's existing conventions for file structure, naming, styling approach, state, and data fetching.
- Use real semantic HTML and keep accessibility intact (labels, alt text,