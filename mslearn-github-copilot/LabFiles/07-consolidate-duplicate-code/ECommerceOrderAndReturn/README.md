# Order and return consolidation fixture

This is a synthetic console demonstration with intentional duplication.
It is not a payment system or a security reference implementation.

```bash
dotnet build ECommerceOrderAndReturn.csproj -m:1 -p:UseSharedCompilation=false
dotnet run --no-build --project ECommerceOrderAndReturn.csproj
```

Inspect `OrderProcessor`, `ReturnProcessor` and their services.
Preserve their distinct prefixes, shipping thresholds and inventory directions.
Orders over 50 receive a one-unit shipping discount in this implementation;
the code does **not** implement free shipping at that threshold.

`EXPECTED_OUTPUT.md` is a historical illustration with dynamic timestamps.
Capture your own baseline. The processors catch and log exceptions, so the demo's
exit status alone is not a discriminating test. Add assertions for the behavior you
refactor, including equality boundaries and side effects.
