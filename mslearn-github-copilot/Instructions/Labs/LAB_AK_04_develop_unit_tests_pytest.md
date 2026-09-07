---
layout: default
title: Develop discriminating pytest tests
parent: Hands-on Labs
nav_order: 16
permalink: /hands-on/04-pytest/
lab_id: 04-pytest
last_verified: "2026-09-07"
lab:
  title: Exercise - Develop useful pytest tests with Copilot
  description: Exercise the real Python loan repository through a narrow data seam and distinguish collection from correctness.
  duration: 60 minutes
  level: 300
  islab: true
  primarytopics: [Python, pytest, Test design]
---

# Develop discriminating pytest tests with Copilot

Pytest can collect the fixture's existing `unittest.TestCase` tests and new pytest
functions. A green collection UI is not proof that a regression assertion executed.

## Learning objectives

- Use the existing test conventions and a selected interpreter.
- Test `JsonLoanRepository.get_loan`, not a mock of that method.
- Verify found/missing IDs and non-mutation.
- Demonstrate a test failing for an intentional wrong assertion.

## Before you start

Prepare `04-pytest` following [the setup guide](../Reference/SETUP.md).
Use the supplied
[Python testing fixture](https://github.com/workshop-gbb/awesome-copilot-adventures/tree/main/mslearn-github-copilot/LabFiles/04-python-develop-unit-tests-pytest/AccelerateDevGHCopilot).
Select an environment on the work drive. Install `requirements.txt` in that copy
only if pytest is missing, then run commands from `library`.

## Concepts and use cases

`get_loan` iterates the injected object's `loans` collection and returns the matching
loan or `None`. A lightweight object with a `loans` attribute is sufficient for that
unit test; actual `JsonData` loading and saving are separate component tests.

## Exercise scenario

The service tests do not directly validate repository search. Add tests that
distinguish an existing loan from a missing one without modifying fixture JSON.

## Task 1 - Inspect and collect

```bash
python -m pytest --collect-only -q tests
python -m pytest -q tests
```

Record actual test names/counts. Read `infrastructure/json_loan_repository.py`,
`application_core/entities/loan.py`, and the service tests before adding anything.

## Task 2 - Define cases and a narrow seam

| Case | Assert |
| --- | --- |
| Matching integer ID | The actual matching loan is returned |
| Missing ID | `None`, not a new empty loan |
| Empty collection | `None` |
| Read-only query | Collection order and elements unchanged |
| String ID such as `"1"` | Characterize current behavior; do not assume coercion |

Example seam:

```python
from types import SimpleNamespace
from infrastructure.json_loan_repository import JsonLoanRepository

# Supply actual Loan objects constructed with the fields required by the fixture.
data = SimpleNamespace(loans=[])
repository = JsonLoanRepository(data)
assert repository.get_loan(999) is None
```

This isolates the repository method, not the JSON parser. Do not report it as a
filesystem integration test.

## Task 3 - Plan and write the tests

Ask:

```text
Inspect get_loan and the Loan entity. Propose found/missing/empty/non-mutation cases.
Use the real repository and a minimal data object; do not mock get_loan itself.
Distinguish current wrong-type behavior from a new validation requirement.
```

1. Review the plan and add `tests/test_json_loan_repository.py`.
2. Use pytest fixtures to avoid duplicated setup when they improve clarity.
3. Assert fields or object identity as required by the current contract.
4. Keep dates controlled and unrelated service behavior out of scope.
5. Do not add broad exception handlers to make tests pass.

## Task 4 - Prove detection

```bash
python -m pytest -q tests/test_json_loan_repository.py
python -m pytest -q tests
```

1. Confirm the focused file actually contains collected tests.
2. Temporarily make a found-ID assertion expect `None`; verify failure.
3. Restore the assertion and rerun.
4. Use the Test Explorer only after selecting the same interpreter/import root.
5. Record limitations: these tests do not prove JSON loading, persistence, security,
   or all loan-service behavior.

## Verify your work

- [ ] Found/missing/empty cases exercise the actual repository.
- [ ] Search does not mutate the source collection.
- [ ] The wrong assertion fails with nonzero exit.
- [ ] Interpreter, working directory and commands are reproducible.
- [ ] No real JSON data or other project was modified.

## Troubleshooting

`ModuleNotFoundError` usually means the wrong root or interpreter.
`0 tests collected` is not success. If a mock returns exactly what you configured,
ask whether the method under test ran at all.

## Independent practice

Add a component test for corrupt JSON using a temporary fixture and characterize
the actual loader behavior. Do not silently assume a printed error is an exception.

## Reset

Restore only your new test file and local test configuration. Close the disposable
workspace; keep shared interpreters intact.

## Official references

- [Python testing in VS Code](https://code.visualstudio.com/docs/python/testing)
- [Python environments](https://code.visualstudio.com/docs/python/environments)
- [pytest fixtures](https://docs.pytest.org/en/stable/how-to/fixtures.html)
