import json
from pathlib import Path
import subprocess
import sys
import unittest

from legacy import read_orders, summarize

ROOT = Path(__file__).resolve().parent


class LegacyContract(unittest.TestCase):
    def test_fixture_order_and_integer_totals(self):
        records = read_orders(ROOT / "data" / "orders.csv")
        self.assertEqual([row["id"] for row in records], ["ORD-1001", "ORD-1002", "ORD-1003"])
        self.assertEqual(summarize(records)["total_cents"], 6249)
        self.assertEqual(summarize(records, "C-01")["total_cents"], 3250)
        self.assertEqual(summarize(records, "missing"), {"orders": [], "total_cents": 0})

    def test_cli_is_machine_readable(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / "service.py"), "--source", str(ROOT / "data" / "orders.csv"), "--customer", "C-02"],
            capture_output=True, text=True, check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["total_cents"], 2999)
        self.assertEqual(len(result.stdout.splitlines()), 1)


if __name__ == "__main__":
    unittest.main()
