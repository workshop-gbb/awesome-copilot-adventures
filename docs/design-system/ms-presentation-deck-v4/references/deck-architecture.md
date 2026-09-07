# Deck architecture (v4.0.0)

The deck is one self-contained HTML file: fonts embedded as base64, one `<style>` chain, the
`I18N` JSON, the engine script, the presenter script, then the layers the builder appends (icon
sprite after `<body>`, visual layer CSS, families CSS, code background, bar numerals, links CSS,
scene CSS, `runtime.js`, `fill_canvas.js`, `typo` CSS + JS). It opens from disk, offline, in any
Chromium, Edge, Safari or Firefox.

## Build path

Decks are **generated**, never hand-written:

```python
import sys; sys.path.insert(0, '<skill>/scripts')
from deck_builder import Deck
import components as C, charts as CH, mocks as M
from diagram_kit import Diagram
D = Deck(version='1.0.0', title=('en', 'pt', 'es'), file_stem='TopicCamelCase', profile='technical')
D.cover(l1, l2); D.who(intro, p1, p2); D.content(...read before...); D.agenda(title)
D.part('I', 'red', title3, eyebrow3, sub3, notes3)
D.content('red', eyebrow3, title3, body, notes3,
          family='diagram', archetype='request-path', hero=True)
...
D.closing(t1, t2, code_title='quick rule', code_lines=[...])
D.write(topic_dir='decks/topic')  # TopicCamelCase_v1_0_0_YYYYMMDD_multi.html + archive/ + pptx/
```

`assets/template_skeleton_multi.html` is the engine with `<!--SLIDES-->` and `/*I18N*/{}`
placeholders. The builder fills them, then appends the layers in the order above. Do not edit the
skeleton for a deck; put deck-specific CSS in the body HTML of the slide that needs it (rare) or add
a family to `visual_ext.py` and document it.

`Deck(profile=...)` writes `<meta name="ps-deck-profile">`. `Deck.content()` classifies known
components and writes `data-ps-family`, `data-ps-archetype`, and optional `data-ps-hero`. Custom
compositions declare those values explicitly so `census.py` can validate them.

## Stage, slides, chrome

- `.deck` is 1280 x 720, centered and scaled with `transform: scale(min(vw/1280, vh/720))`.
  Fonts are in px; never vw/vh.
- `.slide` is `position: absolute; inset: 0; padding: 34px 60px; display: flex; flex-direction:
  column; justify-content: center`. Only the active slide (`data-active="true"`) is visible; the
  attribute is the trigger for every entrance animation, the typed terminals and the interactives.
- Themes: `slide--light` (bg #F7F7F5) and `slide--dark` (uniform black #000000). The outer browser
  canvas and all structural slides use the same background token as the active slide. The dark theme re-maps the
  ink, paper and rule tokens, so components need no dark variant. `--accent` (and `--label`) are
  set per slide by the builder.
- Chrome: one fixed `.deck-brand` top-left (Microsoft 4-square, 18px) and the progress line;
  locale switcher visible only on the cover (`body[data-on-cover]`); no slide counter, no replay
  button, no arrows. Keyboard: `←` `→` navigate, `A` agenda, `O` overview, `N` notes, `L` locale,
  `F` presenter view (BroadcastChannel `deck-presenter-sync`, timer, auto-reconnect).
- Favicon embedded as a data URI; `<meta name="author">` carries the role line.

## I18N

One global `I18N` object with `en`, `pt-BR`, `es`. Keys are dot paths, at most two levels,
camelCase leaf (`k12.title`, `agenda.r3`, `notes.s7`); the builder allocates `kN` prefixes per
slide through `Deck.nk()` and `Deck.reg(key, en, pt, es)` returns the `data-i18n` attribute. The
resolver sets `textContent`, or `innerHTML` when the string contains a tag. Lists use
`data-i18n-list` with arrays. Notes live under `notes.sN` (1-based slide number) and are re-keyed
by the builder from the final slide order, so inserting a slide never breaks them.

`setLocale()` re-applies every string, re-runs `decorateProductNames()`, `fitDiagramText()`,
`psFitAll()` (cover fit, `typo`, `relaxNbsp`) and `fillCanvas()` on the active slide.

## Runtime hooks in order

1. `goToSlide(i)` sets `data-active`, syncs the theme, renders the notes, runs `psFitAll()`.
2. `fill_canvas.js` wraps `goToSlide` and `setLocale`: after each, `fillCanvas()` measures the
   active slide with `.ps-measure` (animations off, pseudo-elements included) and scales it.
3. `typo.js` wraps `psFitAll()`: glues function words and the last pair, fits `.section-title`
   in one line and `.title` in one line when possible, then `relaxNbsp()`.
4. `runtime.js` reacts to `data-active` for typed terminals, interactives and markdown.
5. `document.fonts.ready` re-runs the fits once the embedded fonts are active.

## Speaker notes

Rendered inline (N) and in the presenter window through `formatNote()`: `**bold**` yellow,
`*italic*` blue, `[ABERTURA]`-style markers as green badges, `[pausa]` red. Shape and content rules
in `references/speaker-notes.md`.

## Files a deck produces

`<TopicCamelCase>_v<major>_<minor>_<patch>_<YYYYMMDD>_multi.html` is the deliverable. Derivatives
only on request: public single-locale HTML (`make_public.py`), PDF (`make_pdf.py`), PPTX
(`references/pptx-mapping.md`).

## Topic-local releases

Each `decks/<topic>/` contains one current, versioned `_multi.html`, an `archive/` for
all previous releases and a `pptx/` reserved for future language-specific exports.
Different audience variants have separate topic folders. Existing PowerPoint files
from older HTML releases remain historical, not evidence of a current export.

`deck_publication.py` refuses downgrades, archive collisions, incomplete translations
and overwriting a published filename with different bytes. Increment the version
before publishing. The shared `deck_structure.py` owns the Hooks structural contract;
`audit.py` checks the cover, actual agenda ranges, divider bars and closing.

For existing decks, `decks/scripts/manage_deck_library.py organize` previews moves;
add `--apply` to preserve history in each topic. `normalize --out-dir <staging>` changes
structural slides without replacing content slides. Validate that staging directory
with `validate_all_decks.py --decks-dir <staging> --out-dir <qa>` before `publish --from-dir
<staging> --qa-dir <qa>`. Publication refuses missing, failed or stale gate receipts.
Review complete PT contact sheets and structural EN/ES sheets; geometry,
typography and SVG gates cover all three locales. Incomplete topics remain explicitly
pending in the inventory.
