# Python library fixture

This independent snapshot supports its numbered hands-on exercise. Run commands
from this `library` directory so `application_core`, `infrastructure`, and `console`
are importable. Do not add machine-specific import paths.

```bash
python -m unittest discover -s tests -p "test_*.py" -v
python console/main.py
```

The pytest exercise can also collect the existing unittest cases after pytest is
installed in the selected virtual environment. Use `python -m pytest -q tests`.

Read the methods actually present before describing implemented features. JSON
loading and persistence have deliberate limitations; printed errors do not prove
recovery. Return/renew actions may change data in this copy. Save actual test
output and restore only the copied files. No coverage percentage is claimed.
