"""Instructor reference: validate first and never overwrite an existing target."""

import argparse
import os
from pathlib import Path
import sqlite3
import sys

from legacy import read_orders


def migrate(source, target):
    records = read_orders(source)
    destination = Path(target)
    descriptor = os.open(destination, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    os.close(descriptor)
    connection = None
    complete = False
    try:
        connection = sqlite3.connect(destination)
        with connection:
            connection.execute(
                "CREATE TABLE orders ("
                "id TEXT PRIMARY KEY, customer TEXT NOT NULL, "
                "total_cents INTEGER NOT NULL CHECK(total_cents >= 0), "
                "status TEXT NOT NULL CHECK(status IN ('paid','pending','cancelled')))"
            )
            connection.executemany(
                "INSERT INTO orders (id, customer, total_cents, status) VALUES (?, ?, ?, ?)",
                [(row["id"], row["customer"], row["total_cents"], row["status"]) for row in records],
            )
            observed = connection.execute("SELECT COUNT(*), COALESCE(SUM(total_cents), 0) FROM orders").fetchone()
            expected = (len(records), sum(row["total_cents"] for row in records))
            if observed != expected:
                raise ValueError("Imported count or integer total differs from the CSV.")
            connection.execute("PRAGMA user_version = 1")
        complete = True
    finally:
        if connection is not None:
            connection.close()
        if not complete:
            destination.unlink()
    return len(records)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    args = parser.parse_args(argv)
    try:
        count = migrate(args.source, args.target)
    except (OSError, ValueError, sqlite3.Error) as error:
        print(f"Migration failed: {error}", file=sys.stderr)
        return 2
    print(f"Imported {count} orders.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
