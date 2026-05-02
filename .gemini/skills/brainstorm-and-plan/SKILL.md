---
name: brainstorm-and-plan
description: Brainstorm architectural ideas, bug fixes, and feature enhancements. Use this skill to explore multiple alternatives, analyze impact, and generate a comprehensive, actionable Markdown plan for future implementation.
---

# Brainstorm and Plan

Use this skill to systematically evaluate a request, explore the solution space, and document the chosen path in a format ready for implementation.

## Workflow

1. **Research & Analysis**:
    - Use `grep_search` and `read_file` to understand the affected code.
    - Identify core models (`src/domain/models.ts`), state management (`src/store/sessionStore.ts`), and UI components.
2. **Explore Alternatives**:
    - Propose at least two distinct approaches (e.g., "Refactor existing logic" vs. "Add a new abstraction").
    - Briefly list Pros and Cons for each.
3. **Recommendation**:
    - Select the best approach and explain why it aligns with the project's architecture (React, TypeScript, SCSS Modules).
4. **Generate Plan**:
    - Create a structured Markdown plan. See [references/plan-template.md](references/plan-template.md) for the required format.

## Guidelines

- **Surgical Changes**: Aim for the minimal set of changes that achieve the goal.
- **Idiomatic Code**: Ensure the plan respects existing patterns (e.g., hooks, context, CSS modules).
- **Verification**: Every plan must include a section on how to verify the changes (e.g., "Manual test: open X, click Y").
