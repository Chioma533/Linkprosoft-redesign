---
description: "Analyze a mobile Figma design, identify required mobile-only visibility rules, create a plan-implementation.md, and implement the mobile view while preserving the existing design system and stack."
name: "mobile-view-converter"
argument-hint: "Provide the mobile screen/design reference, target screen or component, and any relevant existing stack/design-system context"
agent: "agent"
---

Convert the provided mobile design into a working implementation that matches the current stack, fits the existing design system, and preserves product consistency.

You are acting as a UI conversion and implementation engineer. Your job is to translate a mobile view design into code without breaking the design system.

## Non-negotiable constraints

This task is strictly mobile-only and must never affect the current desktop layout or any desktop-specific behavior.

- Focus only on layout geometry, viewport behavior, element sizing, spacing, alignment, wrapping, ordering, overflow, safe areas, and conditional visibility.
- Do not change the desktop view, desktop hierarchy, desktop breakpoints, or desktop component behavior.
- Do not modify shared layout logic or global styling if doing so would alter desktop rendering.
- Keep all implementation isolated to mobile-specific conditions, responsive breakpoints, or mobile-only rendering paths.
- If a change would require touching desktop code, stop and redesign the solution so the mobile version is achieved without changing the desktop layout.
- Prefer conditional rendering, mobile-only layout logic, and targeted breakpoint rules over broad shared refactors.
- No global CSS, utility overrides, or cross-screen resets that could leak onto desktop or tablet layouts.
- Do not add style treatments such as shadows, hover effects, borders, outlines, colors, backgrounds, gradients, or visual embellishments unless they already exist in the current design system and are required to preserve existing mobile behavior.
- If a design requirement cannot be implemented without affecting desktop, document the tradeoff clearly and choose the least invasive mobile-only alternative.
- The default rule is: preserve desktop exactly; only mobile may change.

## Goal

Analyze the design, especially the mobile-view specifics, then generate a clear implementation plan and execute the code changes in the current app.

Focus on:
- dimensions and viewport constraints
- spacing scale, padding, margins, gaps, and alignment
- visual hierarchy and component sizing
- mobile-only behavior such as hidden, collapsed, and conditionally displayed elements
- implementation feasibility within the current stack and architecture
- layout-only decisions such as size, stacking, wrapping, order, and safe-area behavior

Do not expand the scope into decorative styling work. Styling decisions involving shadow, hover, border, color, or visual treatment are out of scope unless they are strictly required to preserve the existing design system and do not alter desktop behavior.

## Required workflow

### 1) Review the current app and design system
Before making changes, inspect:
- the current frontend stack and component architecture
- existing design tokens, spacing rules, utilities, typography, color palette, shadows, and radius values
- the relevant screen/component structure that the mobile view should be built from
- any local patterns for responsive or mobile-specific behavior

If the design uses assumptions that do not match the existing system, document the mismatch and prefer the smallest design-system-aligned extension rather than ad hoc styling.

### 2) Analyze the mobile design comprehensively
Produce a thorough mobile design audit covering:
- target viewport and safe-area constraints
- layout structure and wrapping behavior
- exact measurements for width, height, paddings, margins, gaps, radii, and borders
- typography scale, icon sizing, and component density
- section ordering and primary/secondary actions
- content truncation, overflow handling, and scroll behavior
- mobile-specific layout adjustments compared with desktop or tablet views
- hidden or displayed elements required for the mobile experience

Document all of the following clearly:
- which elements are mandatory for the mobile version
- which elements should be hidden on mobile
- which elements should be shown only conditionally or in a different arrangement
- any design elements that should remain visible for desktop but collapse or reflow for mobile

### 3) Create a plan-implementation.md
After the design analysis, create a file named plan-implementation.md in the relevant project folder or root of the feature area.

The file must include:
- objective and scope
- design-analysis summary
- mobile layout decisions and measurements
- component inventory and required changes
- table of elements that should be completely hidden on mobile versus those that should be conditionally displayed based on user interactions or screen size
- implementation order
- design-system considerations
- acceptance criteria and QA checklist
- known risks, assumptions, or follow-up items

### 4) Implement the mobile view
Carry out the implementation in the current stack while maintaining the design system.

Implementation rules:
- respect the project’s current architecture and component patterns
- keep layout strictly consistent with existing spacing and sizing conventions
- avoid introducing custom styling that conflicts with the design system
- use reusable components where possible
- prioritize mobile correctness over exact desktop behavior
- handle responsiveness intentionally rather than by accident
- maintain accessibility: target sizes, labels, semantics, and focus states
- never alter the desktop layout, desktop component tree, or desktop-specific styling as part of this task
- scope all UI changes to mobile viewport logic, mobile breakpoints, and mobile-only conditional rendering
- if a component is shared by desktop and mobile, preserve the desktop state and only branch behavior for mobile in a contained, reversible way
- avoid global selectors, shared layout resets, or CSS that can cascade outside the mobile implementation
- do not add shadows, hover effects, borders, outlines, colors, backgrounds, gradients, or decorative styling as a part of this conversion unless absolutely necessary to preserve the existing system and never affect desktop
- when in doubt, choose a conservative solution that keeps the desktop experience untouched

### 5) Validate the result
Before finishing, confirm:
- the mobile layout matches the intent of the design
- spacing, padding, and alignment are consistent
- hidden/shown elements are correctly applied based on the mobile requirements
- no design system tokens or patterns were violated
- the implementation is compatible with the existing stack and code structure

## Output expectations

Your final response should include:
- a concise architecture-design summary
- a clear mobile design audit with spacing and sizing observations
- a hidden/displayed elements section
- a brief summary of the generated plan-implementation.md
- the implementation result, including relevant file references and design-system rationale
- a short QA checklist for mobile review

## Important guardrails
- Do not invent missing design details; call out assumptions explicitly.
- Treat hidden/displayed elements as purposeful product decisions, not random UI cleanup.
- Prefer design-system-aligned craftsmanship over ad hoc CSS or component duplication.
- Maintain the current stack and use the project’s established patterns.
- If the design requires something not yet present in the app, propose the minimal, consistent extension, document it, and implement it only when it aligns with the system.
- The desktop layout is protected and must remain visually and functionally unchanged.
- Do not make any change that affects a desktop viewport, desktop-only layout, or shared component appearance outside a clearly scoped mobile condition.
- Mobile work must be reversible and isolated; if a fix cannot be isolated, document it and choose the less invasive approach.
- Only focus on dimensions, viewport, safe areas, alignment, ordering, spacing, grouping, overflow, and conditional visibility; never add or change decorative styling such as shadow, hover, border, color, or visual effects.
- Final validation must explicitly confirm that no desktop behavior was modified.
