# Context Mirrors experiment

Use the runnable [starter](./starter/) to compare context strategies without changing the task, model, or acceptance criteria.

## Controlled variants

Create a fresh copy of the starter and a new session for each variant:

1. prompt only;
2. prompt plus explicit file references;
3. repository instructions;
4. repository plus path-specific instructions;
5. custom agent;
6. custom agent plus the evidence-first skill.

Do not run a variant from the repository root if inherited instructions would contaminate the baseline.

## Fixed task

Add support for one new deterministic sequence pattern. Require:

- input validation;
- prediction of one and multiple values;
- API support;
- focused tests;
- no unrelated file changes.

## Evidence worksheet

For every variant record:

| Evidence | Value |
| --- | --- |
| Files changed | |
| Files changed outside scope | |
| Failed tool calls | |
| Human interventions | |
| Tests requested | |
| Tests actually executed | |
| Final test result | |
| Unsupported claims | |

The experiment compares outcomes. It does not establish a universal productivity ranking.
