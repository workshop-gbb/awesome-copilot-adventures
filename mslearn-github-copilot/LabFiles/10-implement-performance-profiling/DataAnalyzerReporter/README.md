# Bounded data-analysis fixture

The app reads a small text fixture, sums parseable numeric values per nonblank line,
and replaces `output.txt` in its working directory.

```bash
dotnet build DataAnalyzerReporter.csproj -c Release -m:1 -p:UseSharedCompilation=false
dotnet run --no-build -c Release --project DataAnalyzerReporter.csproj -- data.txt
```

Run only in a disposable copy. The stopwatch currently starts **after file loading**;
the memory printout is a managed-memory estimate, not total allocations or peak
working set. Preserve culture, parsing and output while comparing one I/O change.
Do not use the historical `output.txt` as measured performance evidence.
