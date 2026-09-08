# Charts by kind of question (v4.0.0)

`scripts/charts.py` (import as `CH`) returns an inline SVG (1120 x 420, scaled to the slide width)
with axis, labels, legend and an entrance animation, in the four Microsoft colors. Each chart
answers one kind of question; pick by the question, not by the data shape. Part III of the
showcase (28 to 43) shows all of them with the components that pair with them.

Every chart publishes `data-chart-kind`, so the diversity gate distinguishes bars, columns, line,
donut, gauge, funnel, waterfall, stacked 100, heatmap, radar, and treemap.

| The question | Chart | Call |
|---|---|---|
| How much, by category | horizontal bars | `CH.hbar([(label, value, color)], unit='teams')` |
| Before and after, per group | grouped columns | `CH.columns(groups, [(name, [values], color)], unit)` |
| How it changed over time | line and area | `CH.line(xlabels, [(name, [values], color)], unit='%', area=True)` |
| Share of a whole | donut | `CH.donut([(label, value, color)], center_v='9.2k', center_k='events / week')` |
| Against a target | gauge | `CH.gauge(value, max_v, label, bands=[(from, to, color)], unit='ms')` |
| Where it leaks | funnel | `CH.funnel([(label, value, color)])` |
| What moved the number | waterfall | `CH.waterfall([(label, delta)], unit='k')` (first item is the start, the total is computed) |
| Composition per row | stacked 100 percent | `CH.stacked100(rows, [(name, [values per row], color)])` |
| Two dimensions, intensity | heatmap | `CH.heatmap(rows, cols, values_0_to_1, lo='green', hi='red')` |
| Several dimensions, two things compared | radar | `CH.radar(axes, [(name, [values], color)], max_v=5)` |
| Where the tokens go | treemap | `CH.treemap([(label, value, color)])` |
| KPIs with a trend | stat tiles | `C.stats([(kicker, value, delta_text, up, [values], color)])` |
| Progress toward a target | progress bars | `C.bars([(label, pct, value_text, color)], marker=target_pct)` |
| Old versus new, per metric | before-after ruler | `C.ruler([(label, old, new, unit)])` |
| Dates | timeline | `C.timeline(items, cols=3 or 6)` |
| Work over weeks | gantt | `C.gantt(cols, rows)` |
| Two axes, positioning | quadrant | `C.quadrant(x_left, x_right, y_top, y_bottom, dots)` |

## Rules

- Every number has a source and a sample size: a `C.watch` line under the chart ("Internal sample,
  n = 41 teams, 2026-03 to 2026-08. Vendor numbers are labeled as vendor numbers.") or the third
  slot of `big_numbers` / `kpis`.
- One chart per slide, the title is the finding ("Where it leaks: from pilot to production in five
  stages."), never the chart type.
- Color is the code: the same series keeps the same color across the deck; red is the problem or
  the over-budget value, green the target reached.
- Labels are short; the legend carries the names; the axis carries the unit once.
- Charts fill the width; `fillCanvas` scales the surrounding text, not the SVG, so a chart slide
  with a lot of white space under it should pair the chart with a `C.kpis` row or a `watch` line.
- Never a 3D chart, never a pie with more than four slices (use the treemap), never dual axes.
- A chart-heavy deck rotates analytical questions and chart subtypes. Changing only color or labels
  does not count as visual variety.
