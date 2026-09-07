---
layout: default
title: Add a brownfield dashboard feature
parent: Hands-on Labs
nav_order: 31
permalink: /hands-on/14-brownfield/
lab_id: 14-brownfield
last_verified: "2026-09-07"
lab:
  title: Exercise - Implement a brownfield feature with Spec Kit
  description: Add owner-scoped document metadata while preserving an existing dashboard contract.
  duration: 85 minutes
  level: 300
  islab: true
  primarytopics: [Spec Kit, Brownfield, Compatibility]
---

# Add a brownfield dashboard feature with Spec Kit

An existing project has behavior, consumers, tests and conventions. A new feature
must integrate with those constraints instead of regenerating the project.

## Learning objectives

- Characterize existing endpoints/module contracts before initializing scaffolding.
- Specify a feature as a bounded delta.
- Keep identity separate from model- or request-supplied fields.
- Verify old and new behavior together.

## Before you start

Complete [Spec Kit preparation](LAB_AK_00_configure_github_dev_kit_lab.md).
Prepare `14-brownfield` using [the work-drive guide](../Reference/SETUP.md).
This bundled dashboard module replaces the mandatory external repository import.
No LocalDB, cloud account changes, binary upload, or public repository is needed.

## Concepts and use cases

| Existing constraint | New requirement |
| --- | --- |
| `health()` response stays unchanged | Add document metadata |
| `projects()` preserves IDs and shape | Register only under an existing project |
| No production authentication in the fixture | Inject a trusted test actor; never accept owner identity from input |
| Module callers must not mutate state | Return copies of metadata records |

## Exercise scenario

The dashboard already lists a training project. Add document titles and IDs scoped
to the current fixture actor. Actual file uploads, malware scanning, external storage,
and real user authentication are explicitly separate work.

## Task 1 - Run the old and new contracts separately

```bash
node --test --test-concurrency=1 baseline.test.mjs
node --test --test-concurrency=1 feature.test.mjs
```

1. Confirm the baseline is green.
2. Confirm the feature tests fail because the feature is not implemented.
3. Record the exact messages and exit codes.
4. Read `requirements.md`; map DOC-1..4 to tests and identify missing knowledge.

## Task 2 - Adopt Spec Kit without replacing the application

1. Make a baseline commit in the disposable project.
2. Inspect `.github`, `.specify` and editor files before `specify init --here`.
3. Review every scaffolding change and preserve project-owned instructions.
4. Create a constitution that preserves DOC-1 and bans unrelated modernization.

Do not use `--force` as a substitute for conflict resolution.

## Task 3 - Specify the delta and clarify ownership

```text
/speckit-specify Add document metadata to the existing dashboard in requirements.md.
Preserve health/projects exactly. Derive ownerId from a trusted actor supplied by
the application boundary, not from document input. Reject missing project/title,
overlong title, missing actor and owner spoofing. No file upload.
```

Use `/speckit-clarify` to answer:

- Who establishes the actor in production?
- What is the maximum title length?
- Does a failed add leave partial state?
- May another actor list these records?

The fixture's injected actor is a test seam, not proof of production authentication.

## Task 4 - Plan with compatibility gates

Use `/speckit-plan` to require:

1. Existing `health` and `projects` unchanged.
2. New metadata storage and validation confined to the module.
3. Owner-scoped listing with defensive copies.
4. Combined execution of baseline and feature tests.
5. Explicit error propagation, no silent fallback owner.

For .NET, propose an authenticated controller/service adaptation; for TypeScript,
add explicit input/output types. Both must preserve DOC-1..4. Do not claim those
adapters were run unless you implement and execute their tests.

## Task 5 - Implement and evaluate the delta

1. Run `/speckit-tasks` and `/speckit-analyze`.
2. Review mappings to both legacy and new tests.
3. Implement one slice, then run:

   ```bash
   node --test --test-concurrency=1 baseline.test.mjs feature.test.mjs
   ```

4. Inspect the entire diff, not just the new method.
5. Temporarily remove owner filtering. Confirm the cross-actor test fails, then
   restore it.
6. Use `/speckit-converge` as a review aid, not evidence that tests ran.

## Verify your work

- [ ] Old tests stay green alongside the new feature.
- [ ] Ownership comes from the trusted boundary.
- [ ] Wrong actor, spoofed owner and invalid input are rejected or isolated.
- [ ] The feature introduces no binary upload or new network service.
- [ ] The compatibility gate is represented in spec, tasks and executed tests.

## Troubleshooting

If the generated code rewrites the whole dashboard, stop and compare the baseline.
If tests pass only individually, inspect shared state. If an “owner” string is read
from user input, it is not authorization.

## Independent practice

Specify a separate binary-upload feature with size limits, content validation,
storage ownership, malware handling and deletion policy. Keep it a design exercise
until its own fixtures and tests exist.

## Reset

Save evidence, then restore only `dashboard.mjs` in the disposable copy. Keep the
curriculum and upstream material untouched; remove no shared branches or accounts.

## Official references

- [Spec Kit installation and adoption](https://github.com/github/spec-kit/blob/v1.0.4/docs/installation.md)
- [Spec Kit integration](https://github.com/github/spec-kit/blob/v1.0.4/docs/reference/integrations.md)
- [ASP.NET Core authorization](https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction)
