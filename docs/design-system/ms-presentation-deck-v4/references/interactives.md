# Interactives and runtime (v4.0.0)

`scripts/runtime.js` is appended to every deck by the builder. It watches `data-active` on every
slide (MutationObserver, no engine hook) and drives: typed terminals, the quiz, the assessment, the
calculator, the toggle, the tabs, the hotspots, the poll and the markdown renderer. Everything
resets when the slide leaves and starts again when it returns. Part VIII of the showcase (91 to 97)
shows each one; `C.markdown` is in part IX (106).

## The no-spoiler rule

Nothing is pre-selected. Toggles are neutral, yes/no buttons are off, the result panel shows an
"empty" sentence until the first answer, and the result updates on every click, never only at the
end. The assessment rule: the rung equals the number of yes answers, the next step is the first no.

## Components

```python
C.quiz(question, options=[...], correct=idx, whys=[why per option],
       panel_k='Your answer', empty='Pick an option to see the explanation.',
       okk='Correct', okv='…', badk='Not this one', badv='…')
# .quiz buttons carry data-correct and data-why; the .ipanel shows ok/bad kicker + the why.

C.assessment(questions=[(text, next_step)], levels=[(code, name)] * (n + 1),
             panel_k='Your rung', empty='Answer the questions; the rung updates on every click.',
             next_label='Next step', top_label='You are at the top', yes_t='yes', no_t='no')
# rung = number of yes; next step = data-next of the first no; the ladder highlights the rung.

C.calculator(inputs=[(id, label, min, max, value, unit)], formula='devs * calls * share / 100 * latency / 1000 / 60',
             big_unit='min / day', big_label='Time spent inside guardrails', extras=[(label, 'js expression')])
# sliders with live output; formula and extras are JS expressions over the input ids.

C.toggle(labels=['Before', 'After'], panels=[html_before, html_after])   # one slide, two states
C.tabs([(label, panel_html)])                                            # same hook seen from three surfaces
C.tabs([(label, panel_html)], initial=None, empty=instruction_html)       # neutral, exploratory version
C.hotspots(base_html, points=[(x_pct, y_pct, title, text, color)])       # numbered points on a diagram, click reveals
C.poll(options=[...])                                                     # tap once per hand raised, bars move, resets on leave

C.chainsim(groups=[(kicker, key, [(value, option_html)])],       # the pickers, left to right
           stages=[(name, sub)],                                 # the chain of controls, left to right
           matrix={'<t><c>': {'stop': n, 'v': 'allow|ask|deny', 'why': 'e11'}},
           off_by_policy={'<c>': [stage numbers this policy does not have]},
           verdict_words={'allow': ..., 'ask': ..., 'deny': ...},
           state_words={'pass': ..., 'off': ..., 'skip': ..., 'run': ...},
           empty_html=..., why_pool={'e11': ...})
# A decision the room can rebuild: the call walks the chain, the stage that stops it lights up in its
# own colour, stages this policy does not have are dashed and greyed ("not configured"), stages after
# the stop read "never reached", and the verdict comes with the reason. Words come from the hidden
# pool as trilingual data-i18n spans, so the panel follows the language switcher live.
C.markdown(md_text)   # <script type="text/markdown" class="mdsrc"> rendered into the next .md (headings, lists, table, quote, code, links)
```

## Typed terminal contract

`<pre data-type="line1\nline2" data-speed="16">` (built by `M.terminal`). Lines starting with
`$ ` or `> ` are typed character by character; every other line prints at once; `# ` gray, `✓`
green, `✕` red, `⚠` yellow. The container scrolls on every character so the last line is never
hidden. The simulation restarts whenever the slide becomes active.

Reduced-motion mode renders the complete terminal transcript immediately, including when the
preference changes while the slide is open. A translated transcript can use `data-type-k`.
Tabs retain their authored initial state on re-entry; use `initial=None` when the audience
should choose before seeing an answer. Arrow keys, Home and End operate within the tab list
without navigating the deck. Quiz feedback follows a locale change without losing the answer.

## Markdown renderer

Minimal on purpose: `#`…`####` headings, `-` lists, `1.` lists, `| a | b |` tables with a `---`
row, `>` quotes, fenced code, `**bold**`, `` `code` ``, `[text](url)` (opens in a new tab). Two
columns by default (`.md { columns: 2 }`), tables, code and quotes never split across columns.
Use it for runbooks and checklists that already exist as `.md`; write slides that need design as
components instead.

## Rules

- One interactive per slide. When it is a section hero, place it within the first two content
  slides after the divider and follow it with the explanation or debrief.
- Labels of buttons and panels go through `Deck.reg` when they must translate; option texts that
  are technical stay in English.
- Screens that only reveal at the end feel broken; the runtime updates on every click by design.
- **Answer with a mechanism, not a word.** A picker whose output is "deny" plus three abstract bars
  is not a simulation: the room cannot say where it stopped. Show the controls in order, mark the one
  that decided, and print its reason. `C.chainsim` is the pattern for anything shaped like a policy
  decision; `C.quiz` and `C.assessment` already carry their why and their ladder.
- Anything the runtime writes back into the DOM (panels, badges, ladder names) must resolve through
  `data-*-k` keys and `window.I18N`. The skeleton publishes the bundle with `window.I18N = I18N;` —
  without it, `tr()` falls back to its English `data-*` attribute and the interactive silently turns
  monolingual the moment the slide is left and re-entered.
- QA: `qa_deck.py` measures with animations off; the interactive panels are measured empty (the
  `empty` sentence must fit the panel in the three languages).
