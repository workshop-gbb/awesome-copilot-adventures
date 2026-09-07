# Optional online-store performance fixture

This synthetic application is retained for an advanced profiling extension.
The default lab uses DataAnalyzerReporter to avoid saturating a shared machine.

Inspect its configuration, simulated delays, benchmark definitions and tests before
running anything. This is not a real store, payment processor or email service.

Read [PERFORMANCE_GUIDE.md](PERFORMANCE_GUIDE.md). Use a bounded, selected workload
on an authorized idle machine, measure the baseline and compare functional results
before interpreting timing.

No pre-executed speedup or coverage percentage is claimed. Tests in the sibling
ContosoOnlineStore.Tests project must be run separately from an application demo.
