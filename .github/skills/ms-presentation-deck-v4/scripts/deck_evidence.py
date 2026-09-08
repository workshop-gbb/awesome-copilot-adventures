"""Evidence required before a candidate becomes a published presentation."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
ROOT = SCRIPTS.parents[3]
LOCALES = ("en", "pt-BR", "es")
GATES = (
    "qa_deck", "audit_typo", "diag_fill", "audit_svg",
    "audit", "audit_ux", "census", "shots",
)
REVIEW_CHECKS = (
    "composition", "contrast", "translations", "sources",
    "interactions", "offline", "presenter", "reduced_motion",
)


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def kit_fingerprint() -> str:
    paths = set(SCRIPTS.glob("*.py")) | set(SCRIPTS.glob("*.js"))
    paths.update((ROOT / "decks/scripts").glob("*.py"))
    paths.update((ROOT / "decks/scripts").glob("*.js"))
    assets = SCRIPTS.parent / "assets"
    paths.update(assets / name for name in (
        "template_skeleton_multi.html", "who_slide_snippet.html",
        "brand_sprite.html",
    ))
    bundle = hashlib.sha256()
    for path in sorted(paths):
        bundle.update(path.relative_to(ROOT).as_posix().encode())
        bundle.update(digest(path).encode())
    return bundle.hexdigest()


def gate_fingerprint(gate: str, kit_sha: str) -> str:
    return hashlib.sha256(f"{kit_sha}:{gate}".encode()).hexdigest()


def capture_manifest(output: Path, stem: str, slides: int) -> dict[str, str]:
    if slides < 1:
        raise ValueError("No slides available for capture evidence")
    names = [f"{number:03d}.png" for number in range(1, slides + 1)]
    names += [
        f"sheet_{number:02d}.png"
        for number in range(1, (slides + 11) // 12 + 1)
    ]
    artifacts = {}
    for locale in LOCALES:
        for name in names:
            path = output / stem / locale / name
            artifacts[path.relative_to(output).as_posix()] = digest(path)
    return artifacts


def quality_issues(
    path: Path, markup: str, qa_dir: Path | None,
) -> list[str]:
    if qa_dir is None:
        return ["quality evidence is required before publication"]
    output = Path(qa_dir).resolve()
    try:
        records = json.loads((output / "results.json").read_text())
        record = records.get(path.name, {})
        gates = record.get("gates", {})
        sha = hashlib.sha256(markup.encode("utf-8")).hexdigest()
        kit_sha = kit_fingerprint()
        failures = []
        for gate in GATES:
            receipt = gates.get(gate, {})
            if (
                receipt.get("passed") is not True
                or receipt.get("deck_sha256") != sha
                or receipt.get("kit_sha256") != kit_sha
                or receipt.get("gate_sha256")
                != gate_fingerprint(gate, kit_sha)
            ):
                failures.append(f"Missing, failed or stale gate: {gate}")
                continue
            logfile = output / path.stem / f"{gate}.log"
            if receipt.get("log_sha256") != digest(logfile):
                failures.append(f"Gate log changed: {gate}")
        if failures:
            return failures

        from slide_markup import SLIDE_RE

        artifacts = capture_manifest(
            output, path.stem, len(SLIDE_RE.findall(markup)),
        )
        if gates["shots"].get("artifacts") != artifacts:
            failures.append("Full trilingual captures are missing or changed")
        review_file = output / path.stem / "visual-review.json"
        review = json.loads(review_file.read_text())
        sheets = {
            name: sha for name, sha in artifacts.items()
            if Path(name).name.startswith("sheet_")
        }
        if (
            review.get("approved") is not True
            or not str(review.get("reviewer", "")).strip()
            or not review.get("finished_at")
            or review.get("deck_sha256") != sha
            or review.get("kit_sha256") != kit_sha
            or review.get("inspected_sheets") != sheets
        ):
            failures.append("Visual review is missing, incomplete or stale")
        checks = review.get("checks", {})
        failures.extend(
            f"Review not completed: {check}"
            for check in REVIEW_CHECKS if checks.get(check) is not True
        )
        return failures
    except (OSError, ValueError, TypeError, AttributeError) as error:
        return [f"Cannot verify quality evidence: {error}"]


def require_quality_evidence(
    path: Path, markup: str, qa_dir: Path | None,
) -> None:
    failures = quality_issues(path, markup, qa_dir)
    if failures:
        raise ValueError("Invalid quality evidence: " + "; ".join(failures))
