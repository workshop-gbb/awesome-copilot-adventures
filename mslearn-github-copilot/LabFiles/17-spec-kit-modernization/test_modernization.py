import hashlib
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent


class ModernizationContract(unittest.TestCase):
    def setUp(self):
        variant = os.environ.get("HANDS_ON_REFERENCE", "0")
        if variant not in {"0", "1"}:
            raise ValueError("HANDS_ON_REFERENCE must be 0 or 1.")
        self.temporary = tempfile.TemporaryDirectory(prefix="order-modernization-")
        self.addCleanup(self.temporary.cleanup)
        self.workspace = Path(self.temporary.name)
        for filename in ["legacy.py", "service.py"]:
            shutil.copyfile(ROOT / filename, self.workspace / filename)
        implementation = ROOT / "reference" if variant == "1" else ROOT
        for filename in ["migrate.py", "order_store.py"]:
            shutil.copyfile(implementation / filename, self.workspace / filename)
        self.source = self.workspace / "orders.csv"
        shutil.copyfile(ROOT / "data" / "orders.csv", self.source)
        self.target = self.workspace / "orders.db"

    def run_cli(self, name, *args):
        return subprocess.run(
            [sys.executable, str(self.workspace / name), *map(str, args)],
            cwd=self.workspace, capture_output=True, text=True, timeout=10, check=False,
        )

    def import_orders(self):
        result = self.run_cli("migrate.py", "--source", self.source, "--target", self.target)
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_migration_preserves_cli_output_and_source(self):
        before_hash = hashlib.sha256(self.source.read_bytes()).hexdigest()
        self.import_orders()
        for customer in [None, "C-01", "C-02", "missing"]:
            selected = [] if customer is None else ["--customer", customer]
            before = self.run_cli("service.py", "--source", self.source, *selected)
            after = self.run_cli("service.py", "--backend", "sqlite", "--source", self.target, *selected)
            self.assertEqual(after.returncode, 0, after.stderr)
            self.assertEqual(before.stdout, after.stdout)
        self.assertEqual(hashlib.sha256(self.source.read_bytes()).hexdigest(), before_hash)

    def test_schema_count_and_total(self):
        self.import_orders()
        with sqlite3.connect(self.target) as connection:
            self.assertEqual(connection.execute("PRAGMA user_version").fetchone(), (1,))
            self.assertEqual(connection.execute("SELECT COUNT(*), SUM(total_cents) FROM orders").fetchone(), (3, 6249))

    def test_existing_target_is_never_overwritten(self):
        self.target.write_bytes(b"existing target sentinel")
        result = self.run_cli("migrate.py", "--source", self.source, "--target", self.target)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.target.read_bytes(), b"existing target sentinel")

    def test_invalid_rows_do_not_leave_partial_database(self):
        fixtures = [
            "id,customer,total_cents,status\nA,C,10,paid\nA,C,20,paid\n",
            "id,customer,total_cents,status\nA,C,-1,paid\n",
            "id,customer,total_cents,status\nA,C,1.50,paid\n",
            "id,customer,total_cents,status\nA,C,10,unknown\n",
            "wrong,columns\nA,B\n",
        ]
        for text in fixtures:
            with self.subTest(text=text):
                self.source.write_text(text, encoding="utf-8")
                result = self.run_cli("migrate.py", "--source", self.source, "--target", self.target)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(self.target.exists())

    def test_missing_database_is_not_created(self):
        result = self.run_cli("service.py", "--backend", "sqlite", "--source", self.target)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse(self.target.exists())

    def test_quote_in_customer_is_data_not_a_query(self):
        self.import_orders()
        result = self.run_cli("service.py", "--backend", "sqlite", "--source", self.target, "--customer", "' OR 1=1 --")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {"orders": [], "total_cents": 0})

    def test_rollback_uses_original_csv(self):
        self.import_orders()
        self.target.unlink()
        result = self.run_cli("service.py", "--source", self.source)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout)["total_cents"], 6249)


if __name__ == "__main__":
    unittest.main()
