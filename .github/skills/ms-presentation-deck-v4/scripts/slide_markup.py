"""Shared slide extraction, independent of attribute order and whitespace."""

import re


SLIDE_RE = re.compile(
    r"""<section\b(?=[^>]*\bclass\s*=\s*["'](?:[^"']*\s)?slide(?:\s[^"']*)?["'])[^>]*>.*?</section\s*>""",
    re.S | re.I,
)
