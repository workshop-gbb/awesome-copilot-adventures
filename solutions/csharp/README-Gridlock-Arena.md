# The Gridlock Arena of Mythos - C# Solution

This folder contains the preserved C# reference implementation for the Gridlock Arena of Mythos.

## Files

- **`The-Gridlock-Arena-of-Mythos.cs`** - Main battle simulation
- **`GridlockArenaTests.cs`** - Deterministic runner for documented scenarios and edge cases
- **`Program.cs`** - Console entry point

## Run

```bash
dotnet build
dotnet run -- mythos
dotnet run -- mythos-test
```

## Expected documented result

- **Dragon:** 12 points
- **Wizard:** 0 points and survives
- **Other creatures:** 0 points

## Test scope

The runner exercises:

- its documented creature preconditions;
- position and movement calculations;
- documented battle simulations;
- boundary and tie scenarios.

It is a lightweight educational runner, not a replacement for a dedicated unit-test framework or coverage collector. No coverage percentage is claimed.

## Architecture

- **`Position` record** - Immutable position with movement calculations
- **`Creature` class** - Arena combatant data
- **`Direction` enum** - Type-safe movement directions
- **`BattleSimulator` class** - Simulation engine
- **`Mythos` class** - Console coordination
