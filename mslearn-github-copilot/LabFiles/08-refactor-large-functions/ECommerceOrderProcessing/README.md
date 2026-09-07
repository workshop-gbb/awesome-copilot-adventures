# Order-processing refactoring fixture

The synthetic console app demonstrates validation, inventory, payment, shipping,
notifications and audit behavior. Its long application-core method is the exercise
target, not a reference for production payment handling.

```bash
dotnet build src/ECommerce.Console/ECommerce.Console.csproj -m:1 -p:UseSharedCompilation=false
dotnet run --no-build --project src/ECommerce.Console/ECommerce.Console.csproj
```

Run from the copied fixture root and inspect the generated audit file there.
Record the actual behavior before extraction; date-sensitive sample values and
historical console text are not current acceptance evidence.

Use [the architecture comparison](ARCHITECTURE_COMPARISON.md) to record preservation
of compensation and side effects. A short method and successful build do not prove it.
