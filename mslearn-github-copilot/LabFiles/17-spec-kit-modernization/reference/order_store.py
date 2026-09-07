"""Instructor reference: open the target without creating or changing a database."""

import sqlite3
from pathlib import Path


def read_sqlite(source):
    uri = Path(source).resolve().as_uri() + "?mode=ro"
    connection = sqlite3.connect(uri, uri=True)
    try:
        if connection.execute("PRAGMA user_version").fetchone()[0] != 1:
            raise ValueError("Unsupported order schema version.")
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            "SELECT id, customer, total_cents, status FROM orders ORDER BY id"
        ).fetchall()
        return [{**dict(row), "total_cents": int(row["total_cents"])} for row in rows]
    finally:
        connection.close()
