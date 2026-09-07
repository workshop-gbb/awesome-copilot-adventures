# Components: text, lists, tables, interactives, media (v4.0.0)

All functions live in `scripts/components.py` (import as `C`) and return the body HTML that goes
into `Deck.content(accent, eyebrow, title, body, notes)`. Colors are `'red' | 'yellow' | 'blue' |
'green'`; `cv(i)` cycles the four Microsoft colors by index. Icons are the line-icon names of
`visual_layer.ICONS` (shield, lock, terminal, json, bell, clock, layers, branch, loop, check, x,
bolt, eye, plug, ladder, flag, file, gear, wrench, folder, radar, send, users, ban, tag, steps,
compass, money, puzzle, note, spark, cloud, laptop, server, test, docs, key, alert, stopwatch, code,
pr, sandbox, chart, network, globe, people, pipeline, meter). Every component is one slide of the
showcase (part in brackets) so you can see it before using it.

## Choosing the shape

| The content is… | Use | Showcase |
|---|---|---|
| One sentence the room must remember, plus the numbers behind it | `hero_statement` + `big_numbers` | I · 6 |
| Facts, each with a consequence (rules, limits, gotchas) | `ledger` | I · 7 |
| Two to six scenarios, options or personas | `tiles` (2 cols), `tiles(story=True)` for incidents, `tiles(cols=3, foot=...)` for a verdict pill | I · 8, 9, 10 |
| Three ideas that need "why it matters / impact / trap" | `cards3(items, why=...)` | I · 11 |
| Short facts that fit in two lines | `chips` + `watch` | I · 12 |
| Two worlds (rules vs hooks, before vs after) | `compare` with a vs badge, `dodont` for symptom vs fix | I · 13, 17 |
| A customer sentence | `quote` + `kpis` | I · 14 |
| Things to verify | `checklist` | I · 15 |
| A fixed-order sequence | `steps` (five max); if the order can change it is a ledger; if it loops, a scene | I · 16 |
| Questions the room asks | `defs` | I · 18 |
| Terms | `glossary` (sixteen max, four colors) | I · 19 |
| Rows and columns | `table` with `pill`, `yes`, `no`, `bar_cell`, `heat_cell` | II · 21 to 24 |
| Plans, packages, maturity levels | `tiers(items, hi=1)` | II · 25 |
| Two axes | `quadrant` | II · 26 |
| KPIs with trend | `stats` (sparkline) or `kpis` | III · 28 |
| Progress against a target | `bars(items, marker=pct)` | III · 40 |
| Before and after | `ruler` | III · 41 |
| Dates | `timeline(items, cols=6)` (single row) or `cols=3` (two or three rows, wide columns) | III · 42 |
| Work over weeks | `gantt(cols, rows)` | III · 43 |
| Media | `figure`, `figure_wide`, `statement_photo`, `image_compare`, `video`, `shapes`, `icongrid` | IX · 99 to 106 |
| Code | `codewin(file, lines, hl)`, `diff(file, lines)`, `tree(dict)` | IX · 107, 108, 110 |
| A document that already exists as markdown | `markdown(src)` | IX · 109 |
| Sources | link cards (`.linkcards > a.lk`) | IX · 111 |
| The room answers | `quiz`, `assessment`, `calculator`, `toggle`, `tabs`, `hotspots`, `poll` | VIII · 91 to 97 |

## Signatures

```python
C.hero_statement(text_html, sub_html='')                 # 54px sentence, one <span class="acc"> accent, optional sub line
C.big_numbers([(value_html, label, source_text, color)]) # three; value like '72<small>%</small>'; source is mandatory
C.ledger([(label, text_html)], icons=[names])            # up to six rows; bold the fact inside text_html
C.tiles([(title, body_html)], icons=None, cols=2, story=False, foot=None)   # foot: list of red pill texts or None per tile
C.kpis([(value, label, text_html, color)])
C.timeline([(date, title, why)], cols=6)                 # up to 12; cols=3 for wide columns and several rows
C.quote(text, author, icon='users')                      # bquote: avatar circle, red bar, mono author line
C.checklist([(title, detail)])                           # two columns, colored check discs
C.steps([(title, detail)])                               # numbered discs joined by a line
C.dodont(dont_title, [donts], do_title, [dos])           # red column left, green column right
C.defs([(question, answer)])                             # Q&A rows with a red dot
C.glossary([(term, definition)])                         # 4 x 4 cards numbered in four colors
C.cards3([(kicker, title, text)], why=((why_k, why_t), (impact_k, impact_t), (third_k, third_t), third_is_trap))
C.chips([(key, text)], cols=3)
C.compare((kicker, text_html, color), (kicker, text_html, color))
C.watch(label, text)                                     # yellow callout at the bottom of a slide
C.table(headers, rows, widths=None, cls='dt stagger')    # rows: lists of cell HTML; helpers below
C.pill(text, kind='gray'|'red'|'green'|'yellow'|'blue'); C.yes(); C.no(); C.bar_cell(pct, color, text); C.heat_cell(val, level0to4)
C.tiers([(name, price_html, per, [(feature, ok)], color)], hi=1)
C.quadrant(x_left, x_right, y_top, y_bottom, [(x_pct, y_pct, label, color)])
C.stats([(kicker, value, delta_text, up_bool, [values], color)])
C.bars([(label, pct, value_text, color)], marker=None)   # marker: target percent
C.ruler([(label, old, new, unit)])
C.gantt([col_labels], [(name, start_idx, length, color, text)])   # short bars get their label outside automatically
C.figure(svg_or_img_src, caption, source, alt, asset_kind=None)
C.figure_wide(svg_or_img_src, caption, source, alt, asset_kind=None)
C.statement_photo(text_html, sub_html, img_src, source, alt, round_img=False, photo_left=False)
C.image_compare(before_src, after_src, before_label, after_label, caption, source, before_alt, after_alt)
C.video(src, poster, caption, source, alt, transcript='', track_src='', track_label='Captions')
C.shapes([(kind, x, y, w, h, color, opacity, float_bool)])          # kind: c r t blob ring; use with nofill=True
C.icongrid([symbol_ids]); C.markdown(md_text); C.diff(file, [(kind, text)]); C.codewin(file, [html_lines], hl=(6, 7, 8)); C.tree(obj)
C.tree(obj, expanded=True)  # readable complete schema; the audience can still collapse branches
C.quiz(question, [options], correct_idx, [whys], panel_k, empty, okk, okv, badk, badv)
C.assessment([(question, next_step)], [(code, name)] * (n+1), panel_k, empty, next_label, top_label, yes_t, no_t)
C.calculator([(id, label, min, max, value, unit)], js_formula, big_unit, big_label, extras=[(label, js_expr)])
C.toggle([label_before, label_after], [panel_html_before, panel_html_after])
C.tabs([(label, panel_html)]); C.hotspots(base_html, [(x_pct, y_pct, title, text, color)]); C.poll([options])
```

## Rules that apply to every component

- The slide has one dominant composition. A supporting KPI row, source, watch line, or insight rail
  may accompany the primary component when it reinforces the same conclusion.
- Text inside a component is plain HTML; bold the one fact per row (`<b>`), never a whole sentence.
- Media helpers accept an authored `<svg ...>` string and keep it inline. For a genuine image,
  declare `asset_kind='portrait'|'brand'|'photo'|'product-evidence'`. An omitted purpose is
  explicitly marked `reference` and fails the UX gate. Rebuild technical reference images as
  native diagrams, charts, code or tables; never relabel them as photographs to pass validation.
- Numbers carry their source and sample size in the third slot (`big_numbers`, `kpis`) or in a
  `watch` line under the chart; vendor numbers are labeled as vendor numbers.
- A component fills its slide because `fill_canvas.js` grows it; do not add inline font sizes.
  If a slide stays short, add the `.why` block (`cards3(..., why=...)`) or a `watch` line rather
  than a second copy of the same component or an unrelated card grid.
- Class-name safety: the families are prefixed (`ledg/lr`, `tiles/tile`, `kpis/kpi`, `tline/tl`,
  `bquote`, `ptiers/ptier`, `pbars/br`, `azcard`, `hot`, `term`, `vsc`, `chatwin`, `portal`,
  `ghpr`, `browser`, `phone`). Before inventing a new class, `grep -c '\.name ' assets/template_skeleton_multi.html`:
  `.tier`, `.bars`, `.quote`, `.pcard`, `.step`, `.no` already exist in the engine with other
  meanings, which is why the families above carry prefixes.
- Two-column bodies: wrap two components in `<div class="cols2">…</div>` (`cols2--wide` for 2:1).
