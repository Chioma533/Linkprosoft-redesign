# Page / Screen Component Recheck Prompt

Purpose
- Use the @sym:# component-architect.agent.md as the source of truth for page building.
- Review the implementation produced by the component architect and extract the complete set of reusable components needed to create or validate a page/screen.
- Recheck whether the page has been decomposed into the correct components, whether any sections are missing, and whether any components should be reused instead of recreated.
- Focus on component extraction, composition validation, and gap analysis rather than Figma API or remote design ingestion.

Inputs (required)
- `page_or_screen_name`: the page or screen to review and build from components.
- `target_path` (optional): the target folder or route where the page should live, such as `src/pages/...` or `src/components/...`.
- `design_reference` (optional): a screenshot, mockup, or existing page implementation to compare against.
- `existing_work` (optional): any page, component, or route files already created by the component-architect agent.

Inputs (not required)
- Figma file URL
- Figma API tokens or project access
- Frame IDs
- External design extraction pipeline

Primary Deliverables
1. `component-inventory.md` — complete list of all components required for the page/screen.
2. `reuse-map.md` — map each page section to existing repo components, adapted components, or new components to create.
3. `missing-components.md` — identify omitted, duplicated, or under-specified components.
4. `page-composition.md` — explain how the final page should be assembled from the extracted components.
5. `verification-checklist.md` — list the exact checks to confirm the implementation matches the target screen.

High-level Workflow
1. Read and use the component-architect agent as the authoritative implementation model.
2. Inspect the current codebase and identify existing components, layout primitives, utility patterns, and token/style conventions.
3. Break the target page or screen into logical sections such as header, sidebar, hero, cards, form blocks, list items, buttons, badges, gallery, footer, and actions.
4. Extract all reusable components required for the screen, including structure, props, variants, and composition rules.
5. Recheck the current implementation against the target page and flag:
   - reused components that were not actually reused,
   - duplicated components that should be consolidated,
   - missing sections that need additional components,
   - misordered or incorrectly composed layout blocks.
6. Produce a minimal, accurate component plan: what can be reused, what should be slightly adapted, and what must be created.
7. Finalize with a short validation summary for the page and any recommended next implementation steps.

Agent Behavior & Instructions
- Treat the component-architect agent as the default source of truth for page extraction and implementation planning.
- Reuse existing repo components before creating anything new.
- Prefer small, composable components over large monolithic screen components.
- Keep naming conventions aligned with the existing codebase and the component-architect agent's decisions.
- Be conservative with file creation: do not create duplicates when a similar component already exists.
- When the target screen is ambiguous, ask only for the missing clarification required to complete the component extraction.
- Do not perform any Figma API workflow, design token scraping, or remote Figma sync.

Verification Goal (explicit)
- The prompt must verify whether the page/screen has been correctly decomposed into reusable components.
- The final output must include:
  - a complete component inventory,
  - a reuse-vs-new breakdown,
  - a list of likely omissions or duplicates,
  - a final composition summary for the page.

Output Formats (recommended)
- `component-inventory.md`
- `reuse-map.md`
- `missing-components.md`
- `page-composition.md`
- `verification-checklist.md`

Example Invocation

```json
{
  "page_or_screen_name": "Pricing page",
  "target_path": "src/pages/pricing",
  "design_reference": "screenshot or mockup",
  "existing_work": "component-architect generated route and nested components"
}
```

Clarifying Questions (prompt should ask these if missing)
- Which page or screen is the target for rechecking?
- Is the goal to review an existing implementation or to create the missing components from scratch?
- What folder or route should the final page composition live in?
- Do we have a reference mock or screenshot for validation?

Edge Cases & Notes
- If a section is visually complex, break it into subcomponents before deciding whether it is reusable.
- If there are repeated UI patterns, collapse them into shared components rather than creating page-specific copies.
- If a component already exists but is not being reused, note the reason and recommend the correct reuse path.
- Keep the output focused on the actual page-building workflow and not on unrelated design system generation.

Suggested Next Steps After Running the Prompt
- Reuse the mapped components and fill in any missing blocks.
- Review the final page composition for layout consistency and missing states.
- Confirm that no duplicate or inconsistent component variants remain in the page.

Human-readable Summary
- This prompt uses the component-architect agent as the main source of truth, then rechecks the target page/screen to extract the exact reusable components, verify composition quality, and identify any missing or duplicated parts before implementation is finalized.

---

If you want, I can now:
- Save this revised prompt into the prompt file.
- Tailor it to a specific page template such as landing page, dashboard, checkout, or marketplace screen.
- Convert the output into a stricter checklist format for your team workflow.
