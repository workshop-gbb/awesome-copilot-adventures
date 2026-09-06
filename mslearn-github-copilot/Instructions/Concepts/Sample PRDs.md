---
layout: default
title: PRD examples and acceptance contracts
parent: Hands-on Labs
nav_order: 41
permalink: /hands-on/prd-examples/
last_verified: "2026-09-06"
---

# PRD examples and acceptance contracts

A product requirements document describes **why and what**. A technical plan
describes **how**. Tests and recorded observations establish whether the result
meets the requirements; neither document establishes success by itself.

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
