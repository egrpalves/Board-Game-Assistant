---
name: execute-plan
description: Implement a previously created technical plan. Use this skill when an actionable Markdown plan (typically created by 'brainstorm-and-plan') is provided and needs to be executed precisely and verified.
---

# Execute Plan

Use this skill to transform a well-defined plan into code. This skill focuses on precision, adherence to architectural standards, and thorough verification.

## Workflow

1. **Plan Review**:
    - Read the entire plan first.
    - Identify all files that need to be modified.
    - Ask for clarification if any step is ambiguous.
2. **Sequential Implementation**:
    - Follow the "Step-by-Step Execution" section of the plan.
    - Make surgical updates using `replace` or `write_file`.
    - Ensure all imports and types are correctly handled.
3. **Continuous Validation**:
    - After each major change, run available linting or build tools (e.g., `npm run lint`, `tsc`).
4. **Final Verification**:
    - Complete all items in the "Verification Plan" section of the plan.

## Guidelines

- **No Deviation**: Do not introduce changes outside the scope of the plan unless they are strictly necessary for the planned changes to work.
- **Project Standards**: Maintain the established style (SCSS Modules, TypeScript interfaces, functional components).
- **Testing**: If the plan includes adding tests, ensure they pass before finishing.
