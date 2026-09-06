"""Exercise: implement a validated, non-overwriting CSV-to-SQLite migration."""

import argparse
import sys


def migrate(source, target):
    raise NotImplementedError("Implement validation, schema creation, import, verification and rollback.")


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--target", required=True)
    args = parser.parse_args(argv)
    try:
        count = migrate(args.source, args.target)
    except (OSError, ValueError, NotImplementedError) as error:
        print(f"Migration failed: {error}", file=sys.stderr)
        return 2
    print(f"Imported {count} orders.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
