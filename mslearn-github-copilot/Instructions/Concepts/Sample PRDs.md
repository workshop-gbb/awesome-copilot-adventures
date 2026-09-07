---
layout: default
title: PRD examples and acceptance contracts
parent: Hands-on Labs
nav_order: 41
permalink: /hands-on/prd-examples/
last_verified: "2026-09-06"
---

# PRD examples and acceptance contracts

![A user contract leads to a chosen stack and evidence, rather than implementation by guesswork.](../../../assets/images/hands-on/13-greenfield.svg)

> [!TIP]
> Use this page **before asking for implementation**. Choose one example, adapt the
> user and scope, and turn its acceptance rows into checks. Do not paste the entire
> document into always-on repository instructions.

| If your situation is… | Use… | Practice next |
| --- | --- | --- |
| No working application exists | Example A: new subscription behavior | [Greenfield lab](../Labs/LAB_AK_13_get-started-spec-driven-development.md) |
| Existing behavior must keep working while a feature is added | Example B: metadata delta | [Brownfield lab](../Labs/LAB_AK_14_implement-spec-driven-development.md) |
| The technical implementation changes, not the user contract | Example C: storage modernization | [Modernization lab](../Labs/LAB_AK_17_modernize_existing_app_spec_kit.md) |

A product requirements document describes **why and what**. A technical plan
describes **how**. Tests and recorded observations establish whether the result
meets the requirements; neither document establishes success by itself.

## Work through one requirement

Consider “let readers add feeds.” It is too broad to implement or review reliably.

1. Name the user and outcome: a reader wants to curate a local subscription list.
2. Bound the behavior: add and list URLs; no network fetch, account or polling.
3. Choose one acceptance case: adding the same normalized URL twice must be rejected.
4. State observable evidence: the second operation returns an error and the list
   still contains one entry.
5. Identify an unresolved choice: whether URL fragments participate in uniqueness.
6. Resolve that choice before writing the plan and tests.

| Weak requirement | Testable replacement |
| --- | --- |
| The app should be smart and fast | Name a specific workflow and measured constraint, or omit the unsupported speed claim |
| Handle all errors | Enumerate blank, malformed, duplicate and wrong-owner cases that matter to this scope |
| Add secure uploads | Separate file validation, ownership, storage and malware handling; do not call metadata registration a secure upload feature |
| Modernize without breaking anything | Name the exact output, ordering, integer precision and rollback contracts to preserve |

## Minimal template

| Section | Required content |
| --- | --- |
| Problem and user | Who needs the capability and why |
| Scope | One primary workflow and explicit exclusions |
| Acceptance | IDs, given/when/then cases, expected observables |
| Constraints | Data boundaries, accessibility, compatibility, resource limits |
| Risks and questions | Unknowns that must be resolved before implementation |
| Evidence | Exact checks and artifacts; leave unexecuted results blank |
| Change control | Who accepts a scope change and how it updates tests |

## Example A - Greenfield RSS subscriptions

**User:** a reader curating a small local subscription list.
**Goal:** add and list feed URLs without fetching remote content.
**Excluded:** authentication, feed parsing, polling, real user data, persistent storage.

| ID | Given / when | Then |
| --- | --- | --- |
| RSS-1 | A valid HTTPS feed URL is added | Return a stable ID and retain it in the current process |
| RSS-2 | The same normalized URL is added twice | Reject the duplicate; do not silently create another record |
| RSS-3 | Blank, malformed, or non-HTTP(S) URL is added | Reject it without modifying the list |
| RSS-4 | The list returned to a caller is modified | The internal store remains unchanged |

## Example B - Brownfield document metadata

**User:** a staff member finding project documents in an existing dashboard.
**Goal:** register metadata first, preserving the health/project contract.
**Excluded:** binary uploads, public sharing, malware scanning, real employee data.

| ID | Given / when | Then |
| --- | --- | --- |
| DOC-1 | Existing project listing is requested | Preserve IDs and response shape |
| DOC-2 | Valid metadata for a known project is registered | Return an ID and allow listing for that project |
| DOC-3 | A missing project or invalid title is submitted | Return a documented error without partial state |
| DOC-4 | Listing results are changed by a caller | Stored metadata is not mutated |

## Example C - Modernize an order ledger

**User:** an operator who depends on the existing JSON CLI output.
**Goal:** replace CSV reads with SQLite while preserving observable behavior.
**Excluded:** new prices, status rules, HTTP endpoints, accounts, or production data.

| ID | Given / when | Then |
| --- | --- | --- |
| MOD-1 | The same fixture is read by old and new storage | Identical ordered records and totals in integer cents |
| MOD-2 | An invalid or duplicate row is migrated | Nonzero failure; no successful partial database |
| MOD-3 | Migration is rerun against an existing target | Refuse overwrite and preserve the existing file |
| MOD-4 | Rollback selects the CSV reader | Original file and output remain available |

## Stack choice is a planning decision

Keep acceptance criteria the same while comparing:

- .NET Minimal API and a small Blazor UI;
- Node/TypeScript and browser-native HTML/CSS;
- Python and its standard-library storage tools;
- Go's `net/http` for an independent implementation.

Do not claim all alternatives were executed. Record the chosen stack and the tests
actually run. See the Spec Kit labs for implementation and modernization workflows.

## Ready for planning?

- [ ] One user and primary workflow are named.
- [ ] Non-goals prevent unrelated generation.
- [ ] Acceptance IDs describe observable results, not implementation preferences.
- [ ] Invalid inputs and failure side effects are explicit.
- [ ] Existing compatibility is frozen where applicable.
- [ ] Open questions are resolved or visibly block implementation.
- [ ] Evidence fields remain blank until checks are actually executed.

These examples are compact starting contracts. The full labs add their own
requirements and tests; do not assume the four rows on this page exhaust them.

| Previous | Next |
| --- | --- |
| [Scope an exercise](How%20to%20scope%20vibe%20coding%20lab%20exercise.md) | [Choose a lab kit](../../../docs/downloads.md) |
