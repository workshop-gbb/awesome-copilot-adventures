"""Compatibility CLI: storage selection changes, but the JSON contract does not."""

import argparse
import json
import sqlite3
import sys

from legacy import read_orders, summarize
from order_store import read_sqlite


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--backend", choices=["csv", "sqlite"], default="csv")
    parser.add_argument("--source", required=True)
    parser.add_argument("--customer")
    args = parser.parse_args(argv)
    try:
        records = read_orders(args.source) if args.backend == "csv" else read_sqlite(args.source)
        result = summarize(records, args.customer)
    except (OSError, ValueError, sqlite3.Error, NotImplementedError) as error:
        print(f"Order query failed: {error}", file=sys.stderr)
        return 2
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
