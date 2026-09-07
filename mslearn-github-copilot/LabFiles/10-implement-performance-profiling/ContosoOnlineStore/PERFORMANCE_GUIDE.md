# Performance investigation guide

This optional fixture contains artificial delays and candidate inefficiencies.
It does not establish a measured improvement from changing a data structure,
adding a cache, or parallelizing work.

## Investigate before optimizing

| Candidate | Hypothesis | Guardrail |
| --- | --- | --- |
| Product lookup | Repeated scans may cost time | Include index construction/update cost |
| Search | Repeated normalization may allocate | Preserve matching and cache invalidation |
| Inventory | Per-item work may repeat | Preserve stock correctness and ordering |
| Notifications | Sequential waits may dominate | Concurrency needs bounded capacity and failure policy |
| Logging | I/O may dominate a hot path | Do not remove required audit evidence |

Capture raw samples, input size/hash, machine state, runtime, build mode and output
equivalence. Do not subtract hypothetical delay totals from observed wall time:
overlap, scheduling and implementation changes make that inference unreliable.

## Resource policy

The default hands-on lab uses the smaller DataAnalyzerReporter fixture. Run these
benchmarks only on an authorized, otherwise idle machine, one selected benchmark
at a time. Do not run load tests or fan out work on the shared workshop computer.

Report “no measurable improvement” or “inconclusive” when justified. No speedup
percentage, latency threshold, or production readiness is promised.
