"""Versioned HTML publication with non-destructive, topic-local history."""

from __future__ import annotations

import os
import re
import tempfile
from pathlib import Path

NAME = re.compile(
    r"(?P<stem>.+)_v(?P<major>\d+)_(?P<minor>\d+)_(?P<patch>\d+)_(?P<date>\d{4}-?\d{2}-?\d{2})_(?P<locale>multi|ptBR|pt-BR|en|es)(?:_\d+)?\.html$")


def version_key(path: Path) -> tuple:
    match = NAME.fullmatch(path.name)
    if not match:
        raise ValueError(
            f"HTML filename must include a semantic version, date and locale: {path}")
    return tuple(int(match[key]) for key in ("major", "minor", "patch")) + (match["date"].replace("-", ""), path.name)


def prepare_topic(topic: Path) -> None:
    for folder in (topic / "archive", topic / "pptx"):
        folder.mkdir(parents=True, exist_ok=True)
        (folder / ".gitkeep").touch(exist_ok=True)


def archive_file(path: Path, topic: Path) -> Path:
    destination = topic / "archive" / path.name
    if destination.exists():
        raise FileExistsError(
            f"Archive collision; neither file was overwritten: {destination}")
    path.rename(destination)
    return destination


def publish(path: Path, markup: str, *, qa_dir: Path | None = None) -> Path:
    path = path.resolve()
    match = NAME.fullmatch(path.name)
    if not match or match["locale"] != "multi":
        raise ValueError("Publish only versioned, complete _multi.html decks")
    from audit import extract_i18n
    from deck_structure import issues
    from slide_markup import SLIDE_RE

    registry = extract_i18n(markup)
    if not registry or any(locale not in registry for locale in ("en", "pt-BR", "es")):
        raise ValueError("Cannot publish a partially translated deck")
    for locale in ("en", "pt-BR", "es"):
        for index in range(1, len(SLIDE_RE.findall(markup)) + 1):
            note = registry[locale].get("notes", {}).get(f"s{index}")
            if not isinstance(note, str) or not note.strip():
                raise ValueError(
                    f"Cannot publish missing speaker notes: {locale}, slide {index}")
    failures = issues(markup, registry)
    if failures:
        raise ValueError(
            "Structural publication gate failed: " + "; ".join(failures))
    from deck_evidence import require_quality_evidence

    require_quality_evidence(path, markup, qa_dir)
    prepare_topic(path.parent)
    old_files = sorted(path.parent.glob("*.html"), key=version_key)
    for old in old_files:
        old_match = NAME.fullmatch(old.name)
        if old_match["stem"] != match["stem"]:
            raise ValueError(
                f"Different audience/deck in {path.parent}; use a separate topic: {old.name}")
        if old == path:
            if old.read_text(encoding="utf-8") != markup:
                raise FileExistsError(
                    f"Bump the version instead of overwriting {path.name}")
        elif version_key(old) >= version_key(path):
            raise ValueError(
                f"Refusing to replace a newer release: {old.name}")
        elif (path.parent / "archive" / old.name).exists():
            raise FileExistsError(f"Archive collision for {old.name}")
    if not path.exists():
        with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=path.parent, suffix=".tmp", delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(markup)
        try:
            os.replace(temporary, path)
        finally:
            temporary.unlink(missing_ok=True)
    for old in old_files:
        if old != path:
            archive_file(old, path.parent)
    return path
