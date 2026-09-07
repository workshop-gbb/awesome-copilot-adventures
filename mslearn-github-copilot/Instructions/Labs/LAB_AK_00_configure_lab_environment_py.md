---
layout: default
title: Prepare the Python environment
parent: Hands-on Labs
nav_order: 5
permalink: /hands-on/setup-python/
lab_id: setup-python
last_verified: "2026-09-07"
lab:
  title: Prepare - Configure the Python hands-on environment
  description: Select an interpreter, isolate dependencies and discover the library tests from their correct working directory.
  duration: 20 minutes
  level: 100
  islab: true
  primarytopics: [Python, Testing, VS Code]
---

# Prepare the Python hands-on environment

## Learning objectives

- Select the same interpreter in VS Code and the terminal.
- Understand the fixture's import root and test runner.
- Keep virtual environments and caches on the selected work drive.

## Before you start

Read [environment setup](../Reference/SETUP.md). Use a supported Python interpreter
and VS Code's Python extension. The supplied library tests use `unittest.TestCase`;
pytest can execute them in the pytest lab. Do not install packages for the standard-
library baseline unless a command actually requires them.

## Concepts and use cases

| Item | Purpose |
| --- | --- |
| Interpreter | Runs the code; its selection determines available packages |
| Virtual environment | Keeps this fixture's dependencies separate |
| Working directory | Determines top-level imports and relative files |
| Test discovery | Finds cases; it is distinct from running them |

## Exercise scenario

The library lives under `AccelerateDevGHCopilot/library`. Its imports expect
`application_core`, `console`, and `infrastructure` below the current import root.

## Task 1 - Prepare the isolated copy

```bash
node scripts/prepare-hands-on.js --lab 02-python --destination /Volumes/T9/Dev/oss/workshop-runs/02-python
```

Open the printed copy alone, select the Python interpreter, then change into
`library` in its terminal. Record the interpreter and working directory.

## Task 2 - Discover and run the existing tests

```bash
python -m unittest discover -s tests -p "test_*.py" -v
```

1. Confirm actual test names appear.
2. Record assertion results and the exit status.
3. In the editor, use **Python: Configure Tests** and select unittest with `tests`
   as the directory for this baseline.
4. If the later pytest lab is selected, create `.venv` in the disposable copy,
   install its declared pytest requirement there, and select that interpreter.
5. Avoid automatic discovery across the entire curriculum; it contains independent
   copies with different import roots.

## Verify your work

- [ ] Terminal and editor use the intended interpreter.
- [ ] Tests are discovered from `library`, not an unrelated directory.
- [ ] No zero-test result is called a passing baseline.
- [ ] No package, environment or cache was created on the OS disk for this workshop.

## Troubleshooting

`ModuleNotFoundError: application_core` usually indicates the wrong working/import
root. Do not scatter `sys.path` changes across tests. A missing pytest package in a
unittest baseline is not a reason to install pytest globally.

## Independent practice

Compare unittest discovery with pytest collection on the same `TestCase` classes.
Explain why selecting both frameworks in VS Code does not mean both ran.

## Reset

Close the copied workspace and restore only preferences changed for it. Keep shared
interpreters and other projects' virtual environments intact.

## Official references

- [Python environments in VS Code](https://code.visualstudio.com/docs/python/environments)
- [Python testing](https://code.visualstudio.com/docs/python/testing)
- [Python tutorial in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)
