# C# library fixture

This independent snapshot supports its numbered hands-on exercise. It uses
ApplicationCore entities/services, JSON repositories and a console entry point.
Do not assume that planned features or classes named in older generated text exist.

## Baseline from this project root

```bash
dotnet build src/Library.Console/Library.Console.csproj -m:1 -p:UseSharedCompilation=false
dotnet test tests/UnitTests/UnitTests.csproj -m:1 -p:UseSharedCompilation=false
```

To launch the console, change to `src/Library.Console` and run `dotnet run --no-build`.
The app reads `appSettings.json` and JSON paths relative to the working directory.
Return/renew actions can modify the copied data. Never run them against the original
fixture while collecting baseline evidence.

A successful build is not a test run. Read actual test names and assertions; no
coverage or production-security guarantee is implied. Retain the collection's MIT license.
