# Stack selection

The acceptance contract is independent of the implementation language.
Do not require LocalDB or a complete multi-service web application for a local
subscription-list exercise.

| Route | Benefits for this lab | Additional obligations |
| --- | --- | --- |
| Node 24 ES modules | No package installation; native test runner | URL normalization and defensive copies |
| TypeScript on Node | Same runtime/contract, explicit record types | Select the correct import and supported TS syntax |
| .NET 10 Minimal API + optional Blazor | Familiar C# contracts and UI | Port acceptance tests, origin/port configuration, real browser checks |
| Python | Small store class and standard-library tests | Preserve normalized URL semantics explicitly |
| Go | Typed store and `net/http` adapter | Port error/output contracts and run `go test` |

The repository includes Node and TypeScript instructor references under `reference/`.
The preparation script omits them. Other routes are guided adaptations, not claims
of executed compatibility.

Keep the first increment in memory. Introduce a database or HTTP adapter only through
a separate plan after the domain contract is verified.
