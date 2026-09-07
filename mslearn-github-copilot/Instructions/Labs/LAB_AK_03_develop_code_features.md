---
layout: default
title: Develop book availability in C#
parent: Hands-on Labs
nav_order: 13
permalink: /hands-on/03-csharp/
lab_id: 03-csharp
last_verified: "2026-09-07"
lab:
  title: Exercise - Develop a book-availability feature in C#
  description: Add title search and physical-copy availability through the existing console workflow with regression tests.
  duration: 70 minutes
  level: 200
  islab: true
  primarytopics: [C#, Feature development, Contracts]
---

# Develop book availability in C#

Adding a feature spans input, data retrieval, domain interpretation and output.
A helper that is never connected to the menu is not a completed feature.

## Learning objectives

- Turn a user request into explicit acceptance cases.
- Model availability per physical copy rather than per title.
- Connect the feature through the existing console workflow.
- Preserve unrelated return and membership behavior.

## Before you start

Prepare `03-csharp` using [the common setup](../Reference/SETUP.md).
Use the bundled
[library feature fixture](https://github.com/workshop-gbb/awesome-copilot-adventures/tree/main/mslearn-github-copilot/LabFiles/03-develop-code-features/AccelerateDevGHCopilot).
The C# setup lab describes SDK, caches and execution directories.

## Concepts and use cases

`Book` describes a title; `BookItem` identifies a physical copy; `Loan` records one
copy's borrowing history. A returned loan does not make a copy unavailable.
An overdue but unreturned loan remains active.

## Exercise scenario

A librarian needs case-insensitive title search and a view of each physical copy's
availability. Lending, reservations, database migration and authentication are not
part of this feature.

## Task 1 - Investigate and run the baseline

1. Inspect `CommonActions.cs`, `ConsoleApp.cs`, core entities and `JsonData`.
2. Run from the copied project root:

   ```bash
   dotnet test tests/UnitTests/UnitTests.csproj -m:1 -p:UseSharedCompilation=false
   ```

3. In Ask, trace the existing patron-search menu path. Identify the equivalent
   insertion points for book search without duplicating the input loop.
4. Record active-loan semantics from `ReturnDate`, not a guess based on due date.

## Task 2 - Define acceptance before code

| ID | Case | Expected observable |
| --- | --- | --- |
| BOOK-1 | Partial title, different case, surrounding whitespace | Matching titles after defined normalization |
| BOOK-2 | Blank search | Clear prompt/error, no accidental full-catalog dump |
| BOOK-3 | Unknown title | Explicit no-results message |
| BOOK-4 | Two copies; one active loan | One unavailable copy and one available copy |
| BOOK-5 | Returned historical loan | Copy remains available |
| BOOK-6 | Active overdue loan | Still unavailable; due date shown as historical data |

Use newly constructed synthetic records in tests rather than relying on stale
dates in JSON files. Specify deterministic title/copy ordering.

## Task 3 - Plan the complete path

```text
Plan title search and per-copy availability in the existing C# library.
Map BOOK-1..6 to tests and source files. Reuse existing input handling and JSON
loading. Add a distinct CommonActions flag without renumbering existing flags.
Keep return, extension and membership behavior unchanged. Do not edit yet.
```

Review repository/service boundaries. If using `JsonData` directly in the console
to match the starter, explain the coupling; do not call it an ideal production design.

## Task 4 - Implement with a failing regression first

1. Add a test for the two-copy case and confirm it fails for the absent feature.
2. Ask Agent to implement only the reviewed feature slice.
3. Inspect matching, whitespace handling, active loans and result ordering.
4. Connect menu display, input mapping and dispatch. Preserve existing action values.
5. Add remaining boundary cases and run the existing/new tests together.
6. Start the app from `src/Library.Console` and manually exercise the menu.
7. Record the actual output and confirm the feature performs no writes.

## Verify your work

- [ ] All BOOK cases have executable or clearly labeled manual evidence.
- [ ] Two physical copies can have different availability.
- [ ] Returned versus overdue-active loans are distinguished.
- [ ] The menu reaches the implementation.
- [ ] Existing tests remain green and JSON data is not modified by search.

## Troubleshooting

If one active loan hides all copies, check joins by `BookItemId`.
If a method passes unit tests but the menu never calls it, inspect action dispatch.
If a due date is old, do not change fixture dates merely to hide a bug.

## Independent practice

Design reservations as a separate feature: states, conflicting requests, expiration,
and persistence. Do not add it opportunistically to this search change.

## Reset

Preserve the acceptance table and output, then restore only feature/test files in
the disposable copy. A remote branch or public repository is optional, not required.

## Official references

- [Agent planning](https://code.visualstudio.com/docs/agents/run/planning)
- [C# test support](https://code.visualstudio.com/docs/csharp/testing)
- [String comparison guidance](https://learn.microsoft.com/en-us/dotnet/standard/base-types/best-practices-strings)
