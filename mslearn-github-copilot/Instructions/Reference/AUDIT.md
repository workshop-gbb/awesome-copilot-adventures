---
layout: default
title: Hands-on audit and verification
parent: Hands-on Labs
nav_order: 43
permalink: /hands-on/audit/
last_verified: "2026-09-07"
---

# Hands-on audit and verification

Audit scope: all **25 imported preparation/exercise guides**, their supporting
concepts/fixtures, and integration with Awesome Copilot Adventures.
The new **lab 17** is a numbered modernization exercise, not an adventure.

## Lab-by-lab disposition

| Lab | Finding in imported content | Applied improvement |
| --- | --- | --- |
| Setup C# | Global feed edits, version assumptions, build treated as verification | Target/runtime check, isolated copy, explicit test discovery |
| Setup Python | Unscoped interpreter/package setup and fixed plan quotas | Import root, isolated environment, no quota guarantees |
| Setup Copilot | Old screenshots/extensions treated as access evidence | Current sign-in flow, role/target and harmless-request check |
| Setup Spec Kit | “Dev Kit” naming, old layout assumptions and overwriting risks | Pinned v1.0.4 skills layout, commands-mode distinction, reviewed initialization |
| Setup SDK | External .NET app and CLI/editor identity conflation | Offline-first Node fixture and separate application authentication |
| 01 Interface | UI coordinates and deterministic response predictions | Small greeting contract, context comparison and negative assertion |
| 02 C# | Generic explanations and whole-codebase retrieval claims | Source trace, DI/data model and executable documentation |
| 02 Python | Import-root ambiguity and generic layer claims | Actual Python construction, JSON limitations and data relationships |
| 03 C# | Public/remote workflow required; title/copy availability ambiguous | Local feature contract and copy-level active-loan cases |
| 03 Python | Same publication assumptions; wrong runner/response guarantees | Correct import root and BOOK-1..6 acceptance cases |
| 04 xUnit | Generated green UI used as evidence | Real repository component tests, isolated JSON and mutation checks |
| 04 pytest | Test discovery confused with correctness | Actual repository seam, collection checks and deliberately wrong assertion |
| 05 C# | Refactor equated with improvement | Characterization of case, sort, population and persistence |
| 05 Python | Comprehension/sort changes without mutation contract | `sorted` versus in-place semantics, duplicates/ties/missing IDs |
| 06 Prototype | Whole PRD copied into instructions; appearance implied correctness | Small PRD, integer cents, accessible UI checklist and local server |
| 07 Duplication | Similar order/return mechanics treated as identical rules | Real shipping-policy table, boundaries and side-effect preservation |
| 08 Large functions | Large generated rewrites and stale transcripts | One extraction, compensation sequence and negative release check |
| 09 Conditions | Flattening without a decision table | Equality, overlap, caps, order and explicit invalid-input behavior |
| 10 Profiling | Promised improvements, parallel fan-out, speculative delay subtraction | Small workload, named boundary, raw samples and inconclusive results allowed |
| 11 Issues | Mandatory external vulnerable app/import/workflow and bulk closure | Local equality bug, red/green evidence, optional reviewed remote flow |
| 12 Secrets | Public exposure/testing and closure without provider authority | Credential-free revocation-first simulation and stage-order checks |
| 13 Greenfield | .NET-only assumed stack, no URL validation, fabricated CLI flags | RSS contract, Node/TypeScript paths, stack adaptations and real integration names |
| 14 Brownfield | External repo/LocalDB dependency and uncontrolled upload scope | Bundled baseline, metadata-only delta, trusted actor and compatibility gates |
| 15 Customization | `target: cloud`, guessed tools and instruction precedence | Actual role/harness boundaries, Local prompt limitation, scoped handoffs |
| 16 SDK | Long copy/paste app, automatic write tools and success-shaped fallbacks | Tested read-only tool, trusted actor, denial policy, lifecycle and optional live run |
| 17 Modernization | New requested case | CSV-to-SQLite contract, data reconciliation, non-overwrite, read-only query and rollback |

## Integration decisions

- Retain original lab filenames and `lab` metadata for traceability.
- Publish a distinct `/hands-on/` catalog under the root site.
- Remove competing nested Jekyll/build configuration and obsolete publishing
  instructions, retaining the MIT license and attribution.
- Use the fixture preparation script instead of mandatory upstream clones.
- Keep screenshots as labeled historical references, not current UI directions.
- Validate new/untracked in-scope files as well as tracked files; respect Git ignores.
- Keep executable reference implementations out of learner preparation copies.

## Verification boundaries

The following are different forms of evidence and must be reported separately:

| Check | Proves | Does not prove |
| --- | --- | --- |
| Content/link checks | Required structure and resolvable local sources | A live model followed instructions |
| Diagram validation/render | Palette, accessibility, syntax and readable diagrams | The modeled system was executed |
| Node fixture contracts | Local app/tool behavior | Authenticated SDK inference |
| Python migration suite | Fixture compatibility and selected failure/rollback cases | Production durability or concurrent-writer safety |
| C# build/tests | Selected projects compile and their tests run | Full production correctness/security |
| Live optional exercises | Only the actual observations recorded | Universal feature/model availability |

## Deliberate starter failures

Lab 11's regression, lab 13's store, lab 14's feature and lab 17's migration are
intentionally incomplete. A repository check must confirm the expected failure and
the instructor reference's success; skipping the cases or accepting any crash is
not sufficient.

## Source basis

The [Copilot reference](COPILOT.md) lists official GitHub/Microsoft pages.
The [Spec Kit reference](SPEC_KIT.md) records the pinned release and an upstream
documentation/layout discrepancy resolved using the integration implementation.
The [diagram style](../../../docs/diagram-style.md) records GitHub and Mermaid
documentation used for the monochrome, accessible configuration.

## Executed verification on 2026-09-07

| Surface | Command or method | Observed result |
| --- | --- | --- |
| Repository checks | `npm test` | Links/content, hands-on contracts and existing repository tests passed |
| Hands-on inventory | `node scripts/check-hands-on.js` | 26 guides and their catalog/fixture metadata checked |
| Diagram style | `node scripts/check-diagrams.js` | 30 diagrams across flow, sequence, state, class and ER types checked |
| Diagram rendering | Existing Mermaid CLI 11.15.0, one browser, white background | All 30 rendered; each SVG contains title/description; no chromatic hex color literals |
| Node hands-on orchestration | `node --test --test-concurrency=1 scripts/hands-on.test.js` | 16 checks passed, including expected starter failures and instructor references |
| Python modernization | `HANDS_ON_REFERENCE=1 python -m unittest test_legacy test_modernization -v` | 10 tests passed; CSV compatibility, exact large integers, schema/data, failure and rollback gates exercised |
| Incomplete modernization | Same modernization suite with the starter | Nonzero result with the documented unimplemented migration error |
| Python library copies | `python -m unittest discover -s tests -p "test_*.py" -v` in each copy's `library` | Lab 02/03/04: 4 tests each; lab 05: 8 tests passed |
| Pytest track | `python -m pytest -q -p no:cacheprovider tests` in lab 04 | 4 tests passed with installed pytest 9.0.3 |
| C# library copies | `dotnet test` on each test project, `-m:1`, shared compilation disabled | Lab 02/03/04: 17 tests each; lab 05: 19 tests passed on .NET 10 |
| C# console/demo builds | One selected entry project at a time | Ten entry projects built without errors; existing nullable warnings remain in some fixtures |
| Optional store tests | `dotnet test` on ContosoOnlineStore.Tests only | 16 tests passed; no benchmarks or load scenarios were run |
| JS/TS syntax | Node syntax checks; native stripping for the TS reference | 25 source files parsed; this was not a TypeScript static type check |
| YAML/frontmatter | Ruby's existing YAML parser | Site/workflow/frontmatter parsed without syntax errors |
| Reference URLs | Sequential HTTPS requests | The initial browser-documentation 404 was corrected to the verified Edge accessibility reference |

An independent read-only review also found and prompted two corrections:

- The Windows launcher for the large-function fixture referenced a nonexistent
  solution. It now builds the actual console project with bounded build settings.
  The batch launcher was reviewed but not executed on Windows.
- SQLite's signed 64-bit `SUM` narrowed the legacy Python integer contract.
  The reference now stores validated decimal text, converts it to integers on
  read, and reconciles with Python integer arithmetic. A regression covers both
  aggregate and individual values beyond signed 64-bit range.

NuGet's primary v3 endpoint failed TLS during restore in this environment. The
official v2 endpoint (`https://www.nuget.org/api/v2/`) succeeded. The override was
command-local; no global feed setting or certificate-verification bypass was used.
Generated files, browser profile, package caches and logs were directed to the T9
work area. Validation ran sequentially with bounded process counts.
The first .NET invocation printed its first-run certificate setup notice; subsequent
runs explicitly disabled automatic certificate generation. No certificate trust
command or cleanup of shared certificates was performed.

Live Copilot/Spec Kit agent execution, SDK inference, real cloud issues, provider
revocation, and production migrations were **not** executed. They require separate
authorization and cannot be inferred from local contract tests. Other language
adaptations are labeled as designs unless an executable reference is included.

No results from imported screenshots or old timing tables were reused as evidence.
