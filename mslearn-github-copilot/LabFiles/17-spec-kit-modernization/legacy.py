"""The characterized CSV contract. Keep it unchanged during the storage migration."""

import csv
from pathlib import Path

COLUMNS = ["id", "customer", "total_cents", "status"]
STATUSES = {"paid", "pending", "cancelled"}


def read_orders(source):
    with Path(source).open(encoding="utf-8", newline="") as stream:
        reader = csv.DictReader(stream)
        if reader.fieldnames != COLUMNS:
            raise ValueError("Unexpected CSV columns.")
        records = []
        seen = set()
        for line_number, row in enumerate(reader, start=2):
            if set(row) != set(COLUMNS) or any(value is None for value in row.values()):
                raise ValueError(f"Invalid row at line {line_number}.")
            order_id = row["id"].strip()
            customer = row["customer"].strip()
            cents = row["total_cents"]
            if not order_id or order_id in seen:
                raise ValueError(f"Missing or duplicate order ID at line {line_number}.")
            if not customer or not cents.isascii() or not cents.isdecimal():
                raise ValueError(f"Invalid customer or integer cents at line {line_number}.")
            if row["status"] not in STATUSES:
                raise ValueError(f"Unsupported status at line {line_number}.")
            seen.add(order_id)
            records.append({
                "id": order_id,
                "customer": customer,
                "total_cents": int(cents),
                "status": row["status"],
            })
    return sorted(records, key=lambda record: record["id"])


def summarize(records, customer=None):
    selected = [record for record in records if customer is None or record["customer"] == customer]
    return {"orders": selected, "total_cents": sum(record["total_cents"] for record in selected)}
