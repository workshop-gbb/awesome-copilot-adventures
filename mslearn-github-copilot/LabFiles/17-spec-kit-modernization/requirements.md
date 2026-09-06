# Order-ledger modernization contract

## Existing interface

`service.py --source <csv> [--customer <id>]` emits exactly one JSON object on stdout.
Records are sorted by `id`; totals are integer cents; an unknown customer returns
an empty list and zero total. Invalid input returns nonzero and an error on stderr.

## Requested change

Add opt-in `--backend sqlite --source <database>` with the same observable query
contract. Keep CSV as the default during the exercise. Implement `migrate.py`
separately from queries.

## Gates

- MOD-1: frozen CSV characterization remains green.
- MOD-2: migrated count, integer total, ordering and schema version match.
- MOD-3: malformed/duplicate input fails without a successful partial target.
- MOD-4: an existing target is never overwritten, including a rerun.
- MOD-5: reading a missing SQLite database does not create one.
- MOD-6: rollback to CSV works and its source hash is unchanged.

No accounts, payments, HTTP APIs, production records, external databases, or cloud
deployment are part of this modernization.
