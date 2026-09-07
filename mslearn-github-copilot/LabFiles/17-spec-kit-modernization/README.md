# CSV-to-SQLite modernization fixture

Read `requirements.md`. Preserve `legacy.py`, `service.py` and the baseline tests;
complete `migrate.py` and `order_store.py`.

```bash
python -m unittest test_legacy -v
python -m unittest test_modernization -v
```

The first command is a working baseline; the second fails until modernization is
implemented. Tests create temporary files under the configured `TMPDIR`.
Set it to the work drive before running.

Instructor validation from this source directory:

```bash
HANDS_ON_REFERENCE=1 python -m unittest test_legacy test_modernization -v
```

The reference must reconcile 3 records and 6249 cents, preserve source bytes,
refuse overwrite, reject malformed data, and support CSV rollback. This is a local
training migration, not proof of production crash durability or concurrent-writer safety.
