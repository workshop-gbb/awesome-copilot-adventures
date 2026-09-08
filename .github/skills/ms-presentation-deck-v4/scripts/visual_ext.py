# Visual layer v4.0.0, part 2: charts, diagrams, simulations, interactives, media.
# Appended after visual_layer.CSS in the last <style> of the deck.
LEGACY_LAYOUT_CSS = """
.tl__row { grid-template-columns: 90px minmax(0, 1fr); }
.tl__row::before { left: 102px; }
.ledg:has(> .lr:nth-child(6)) { gap: 6px; }
.ledg:has(> .lr:nth-child(6)) .lr { padding-top: 8px; padding-bottom: 8px; }
.dt--anat:has(+ .chips) tbody td { padding-top: 8px; padding-bottom: 8px; }
"""

CSS_EXT = r"""
/* ===================== HERO STATEMENTS ===================== */
.hero-stmt { font-size: 54px; font-weight: 500; line-height: 1.12; letter-spacing: -.03em; max-width: 1100px; margin: 10px 0 18px; text-wrap: balance; }
.hero-stmt .acc { color: var(--accent); }
.hero-sub { font-size: 20px; line-height: 1.5; color: var(--ps-color-ink-3); max-width: 900px; }
.bignums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; margin-top: 28px; }
.bn { padding: 26px 28px; border-radius: 12px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-top: 6px solid var(--c); }
.bn__v { font-family: var(--ps-font-mono); font-size: 84px; font-weight: 700; line-height: 1; letter-spacing: -.05em; color: var(--c); }
.bn__v small { font-size: 34px; letter-spacing: 0; margin-left: 4px; }
.bn__k { font-size: 17px; font-weight: 600; margin-top: 12px; color: var(--ps-color-ink); }
.bn__t { font-size: 13.5px; line-height: 1.5; color: var(--ps-color-ink-2); margin-top: 6px; }
.slide[data-active="true"] .bn { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 140ms) both; }
.slide[data-active="true"] .bn__v { animation: popIn .7s var(--ps-ease) calc(380ms + var(--i, 0) * 140ms) both; }
/* quote */
.bquote { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 36px; align-items: center; margin-top: 26px; }
.bquote__ph { width: 150px; height: 150px; border-radius: 50%; background: color-mix(in srgb, var(--accent) 18%, transparent); display: flex; align-items: center; justify-content: center; color: var(--accent); }
.bquote__ph .ii { width: 64px; height: 64px; }
.bquote__t { font-size: 30px; font-weight: 500; line-height: 1.3; letter-spacing: -.02em; color: var(--ps-color-ink); border-left: 6px solid var(--accent); padding-left: 26px; text-wrap: balance; }
.bquote__a { margin-top: 14px; padding-left: 32px; font-family: var(--ps-font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--ps-color-ink-3); }
/* checklist */
.checks { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px 28px; margin-top: 24px; }
.chk { display: grid; grid-template-columns: 34px minmax(0, 1fr); gap: 14px; align-items: start; padding: 12px 14px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.chk__b { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--c); display: flex; align-items: center; justify-content: center; color: #fff; background: var(--c); }
.chk__b svg { width: 16px; height: 16px; }
.chk__t { font-size: 15px; font-weight: 600; color: var(--ps-color-ink); }
.chk__d { font-size: 12.5px; color: var(--ps-color-ink-2); line-height: 1.45; margin-top: 3px; }
.slide[data-active="true"] .chk { animation: fadeUp .45s var(--ps-ease) calc(200ms + var(--i, 0) * 110ms) both; }
.slide[data-active="true"] .chk__b { animation: popIn .5s var(--ps-ease) calc(350ms + var(--i, 0) * 110ms) both; }
/* process steps */
.steps { display: grid; grid-template-columns: repeat(var(--n, 5), minmax(0, 1fr)); gap: 0; margin-top: 30px; position: relative; }
.stp { position: relative; padding: 0 22px 0 0; }
.stp__n { width: 46px; height: 46px; border-radius: 50%; background: var(--c); color: #1A1A1A; font-family: var(--ps-font-mono); font-weight: 700; font-size: 17px; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.stp::before { content: ''; position: absolute; left: 46px; right: 0; top: 22px; height: 3px; background: var(--ps-color-rule-2); }
.stp:last-child::before { display: none; }
.stp::after { content: ''; position: absolute; right: 8px; top: 16px; border: 7px solid transparent; border-left: 10px solid var(--ps-color-rule-2); }
.stp:last-child::after { display: none; }
.stp__t { font-size: 16px; font-weight: 600; margin-top: 16px; color: var(--ps-color-ink); }
.stp__d { font-size: 12.5px; line-height: 1.5; color: var(--ps-color-ink-2); margin-top: 6px; padding-right: 8px; }
.slide[data-active="true"] .stp { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 160ms) both; }
/* do / don't pairs */
.dodont { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; margin-top: 24px; }
.dd { border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule); background: var(--ps-color-paper); }
.dd__h { display: flex; align-items: center; gap: 10px; padding: 12px 18px; font-family: var(--ps-font-mono); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
.dd--no .dd__h { background: color-mix(in srgb, var(--ps-color-ms-red-500) 14%, transparent); color: var(--ps-text-red); }
.dd--yes .dd__h { background: color-mix(in srgb, var(--ps-color-ms-green-500) 16%, transparent); color: var(--ps-text-green); }
.dd__h .ii { width: 20px; height: 20px; }
.dd ul { list-style: none; margin: 0; padding: 8px 18px 14px; }
.dd li { padding: 8px 0; border-bottom: 1px solid var(--ps-color-rule); font-size: 14px; line-height: 1.45; color: var(--ps-color-ink-2); }
.dd li:last-child { border-bottom: 0; }
.dd li b { color: var(--ps-color-ink); font-weight: 600; }
/* definition rows (FAQ) */
.defs { display: grid; gap: 10px; margin-top: 22px; }
/* defs--plain: mesma linha de definicao sem o badge de pergunta, para rotulo e explicacao */
.defs--plain .def__q::before { display: none; }
.defs--plain .def__q { font-family: var(--ps-font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); }
.def { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: 22px; padding: 12px 16px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.cols2 .def, .cols2--wide .def { grid-template-columns: minmax(0, 1fr); gap: 4px; }   /* narrow column: question above answer */
.def__q { font-size: 15px; font-weight: 600; color: var(--ps-color-ink); }
.def__q::before { content: '?'; display: inline-flex; width: 22px; height: 22px; border-radius: 50%; background: var(--accent); color: #1A1A1A; align-items: center; justify-content: center; font-family: var(--ps-font-mono); font-size: 12px; margin-right: 10px; }
.def__a { font-size: 13.5px; line-height: 1.5; color: var(--ps-color-ink-2); }
/* ===================== TABLES EXTRA ===================== */
.dt .bar { display: inline-block; height: 10px; border-radius: 5px; background: var(--c, var(--accent)); vertical-align: middle; margin-right: 8px; }
.dt .hm { display: inline-block; min-width: 44px; text-align: center; padding: 4px 8px; border-radius: 6px; font-family: var(--ps-font-mono); font-size: 11px; font-weight: 700; color: #1A1A1A; }
.ptiers { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 24px; }
.ptier { border-radius: 12px; border: 1px solid var(--ps-color-rule); background: var(--ps-color-paper); overflow: hidden; }
.ptier--hi { border: 2px solid var(--accent); box-shadow: 0 12px 34px color-mix(in srgb, var(--accent) 18%, transparent); }
.ptier__h { padding: 18px 22px 14px; background: color-mix(in srgb, var(--c) 12%, transparent); }
.ptier__n { font-family: var(--ps-font-mono); font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: var(--c); font-weight: 700; }
.ptier__p { font-size: 26px; line-height: 1.1; font-weight: 600; letter-spacing: -.02em; margin-top: 6px; color: var(--ps-color-ink); }
.ptier__p small { display: block; font-size: 12px; color: var(--ps-color-ink-3); font-weight: 400; margin-top: 3px; }
.ptier ul { list-style: none; margin: 0; padding: 10px 22px 18px; }
.ptier li { padding: 7px 0; font-size: 13.5px; color: var(--ps-color-ink-2); border-bottom: 1px solid var(--ps-color-rule); display: flex; gap: 10px; align-items: center; }
.ptier li::before { content: '✓'; color: var(--ps-text-green); font-weight: 700; }
.ptier li.off::before { content: '✕'; color: var(--ps-color-ink-3); }
.ptier li:last-child { border-bottom: 0; }
/* quadrant */
.quad { position: relative; height: 470px; margin-top: 16px; border-radius: 12px; background: linear-gradient(90deg, transparent 49.8%, var(--ps-color-rule-2) 49.8%, var(--ps-color-rule-2) 50.2%, transparent 50.2%), linear-gradient(0deg, transparent 49.8%, var(--ps-color-rule-2) 49.8%, var(--ps-color-rule-2) 50.2%, transparent 50.2%), var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.quad__l { position: absolute; font-family: var(--ps-font-mono); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--ps-color-ink-3); }
.quad__d { position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; gap: 8px; }
.quad__d i { width: 18px; height: 18px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 5px color-mix(in srgb, var(--c) 25%, transparent); display: block; }
.quad__d b { font-size: 13px; font-weight: 600; color: var(--ps-color-ink); white-space: nowrap; }
.slide[data-active="true"] .quad__d { animation: popIn .6s var(--ps-ease) calc(300ms + var(--i, 0) * 130ms) both; }
/* ===================== CHARTS ===================== */
.ch { width: 100%; height: auto; display: block; overflow: visible; font-family: var(--ps-font-sans); }
.ch text { fill: var(--ps-color-ink); }
.ch .ax { font-family: var(--ps-font-mono); font-size: 13px; fill: var(--ps-color-ink-3); }
.dg.dg--readable .ns, .dg.dg--readable .cl, .dg.dg--readable .zl { font-size:13px; }
.dg.dg--readable .nl { font-size:16px; }
.slide[data-nofill="1"] .watch { font-size:13px; }
.slide[data-nofill="1"] .watch b { font-size:11px; }
.ch .val { font-size: 12.5px; font-weight: 600; paint-order: stroke; stroke: var(--ps-color-bg); stroke-width: 5px; stroke-linejoin: round; }
.ch .halo { paint-order: stroke; stroke: var(--ps-color-bg); stroke-width: 5px; stroke-linejoin: round; }
.ch .grid { stroke: var(--ps-color-rule); stroke-width: 1; }
.ch .lbl { font-size: 13px; font-weight: 600; }
.slide[data-active="true"] .ch .a-grow { animation: chGrow .9s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; transform-box: fill-box; transform-origin: bottom; }
@keyframes chGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.slide[data-active="true"] .ch .a-growx { animation: chGrowX .9s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; transform-box: fill-box; transform-origin: left; }
@keyframes chGrowX { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.slide[data-active="true"] .ch .a-line { stroke-dasharray: 100; stroke-dashoffset: 100; animation: dgDraw 1.4s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) forwards; }
.ch .a-line { stroke-dashoffset: 0; }
.slide[data-active="true"] .ch .a-area { animation: chFade 1s ease calc(900ms + var(--d, 0) * 1ms) both; }
.ch .a-area { opacity: 1; }
@keyframes chFade { from { opacity: 0; } to { opacity: 1; } }
.slide[data-active="true"] .ch .a-arc { animation: chArc 1.2s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes chArc { from { stroke-dasharray: 0 100; } }
.slide[data-active="true"] .ch .a-in { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
.slide[data-active="true"] .ch .a-pop { animation: popIn .5s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; transform-box: fill-box; transform-origin: center; }
.ch .a-in, .ch .a-pop { opacity: 1; }
.slide[data-active="true"] .ch .a-in, .slide[data-active="true"] .ch .a-pop { opacity: 0; animation-fill-mode: both; }
.ch .a-needle { transform-box: fill-box; transform-origin: 50% 100%; }
.slide[data-active="true"] .ch .a-needle { animation: chNeedle 1.4s cubic-bezier(.2,.9,.3,1.2) .4s both; }
@keyframes chNeedle { from { transform: rotate(-90deg); } }
/* stat tiles with sparkline */
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 22px; }
.stat { padding: 16px 18px 12px; border-radius: 10px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-left: 5px solid var(--c); display: grid; grid-template-columns: minmax(0, 1fr) 120px; gap: 10px; align-items: center; }
.stat__k { font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ps-color-ink-3); }
.stat__v { font-family: var(--ps-font-mono); font-size: 34px; font-weight: 700; letter-spacing: -.04em; color: var(--ps-color-ink); line-height: 1.1; margin-top: 4px; }
.stat__d { font-size: 12px; margin-top: 4px; font-weight: 600; }
.stat__d.up { color: var(--ps-text-green); } .stat__d.down { color: var(--ps-text-red); }
.stat svg { width: 120px; height: 44px; overflow: visible; }
.slide[data-active="true"] .stat { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 100ms) both; }
/* progress bars */
.pbars { display: grid; gap: 14px; margin-top: 24px; }
.br { display: grid; grid-template-columns: 220px minmax(0, 1fr) 70px; gap: 16px; align-items: center; }
.br__k { font-size: 14px; font-weight: 600; color: var(--ps-color-ink); }
/* the track does not clip: .br__m is a tick that must stand proud of it. The fill carries its own radius. */
.br__t { height: 16px; border-radius: 8px; background: color-mix(in srgb, var(--ps-color-ink-3) 12%, transparent); position: relative; }
.br__f { height: 100%; border-radius: 8px; background: var(--c); width: var(--w); transform-origin: left; }
.br__m { position: absolute; top: -4px; bottom: -4px; width: 3px; background: var(--ps-color-ink); left: var(--m); border-radius: 2px; }
.br__v { font-family: var(--ps-font-mono); font-size: 13px; font-weight: 700; color: var(--c); text-align: right; }
.slide[data-active="true"] .br__f { animation: chGrowX 1s var(--ps-ease) calc(300ms + var(--i, 0) * 120ms) both; }
/* before -> after ruler */
.ruler { display: grid; gap: 14px; margin-top: 26px; }
.rl { display: grid; grid-template-columns: 240px minmax(0, 1fr) 60px minmax(0, 1fr); gap: 18px; align-items: center; padding: 12px 18px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.rl__k { font-size: 14px; font-weight: 600; }
.rl__old { font-family: var(--ps-font-mono); font-size: 26px; color: var(--ps-text-red); text-decoration: line-through; text-decoration-thickness: 3px; }
.rl__arrow { text-align: center; color: var(--ps-color-ink-3); font-size: 22px; }
.rl__new { font-family: var(--ps-font-mono); font-size: 30px; font-weight: 700; color: var(--ps-text-green); }
.rl__new small { font-size: 12px; font-weight: 500; color: var(--ps-color-ink-3); margin-left: 8px; }
.slide[data-active="true"] .rl { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 120ms) both; }
/* gantt */
.gantt { display: grid; grid-template-columns: minmax(0, 196px) minmax(0, 1fr); gap: 8px 14px; margin-top: 20px; align-items: center; }
.gantt__h { grid-column: 2; display: grid; grid-template-columns: repeat(var(--cols, 12), minmax(0, 1fr)); font-family: var(--ps-font-mono); font-size: 10.5px; color: var(--ps-color-ink-3); text-align: center; }
.gantt__k { font-size: 13.5px; color: var(--ps-color-ink); display: grid; gap: 2px; }
.gantt__k b { font-weight: 600; }
.gantt__k small { font-family: var(--ps-font-mono); font-size: 10.5px; }
.gantt__t { position: relative; overflow: hidden; height: 30px; background: repeating-linear-gradient(90deg, transparent 0 calc(100% / var(--cols, 12) - 1px), var(--ps-color-rule) calc(100% / var(--cols, 12) - 1px) calc(100% / var(--cols, 12))); border-radius: 4px; }
.gantt__l { position: absolute; top: 0; bottom: 0; left: calc(var(--s) + 8px); right: 0; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; color: var(--c); white-space: nowrap; }
.gantt__b { overflow: hidden; position: absolute; top: 3px; bottom: 3px; left: var(--s); width: var(--w); border-radius: 6px; background: var(--c); color: #1A1A1A; font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; display: flex; align-items: center; padding: 0 10px; white-space: nowrap; overflow: hidden; transform-origin: left; }
.gantt__b span { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.slide[data-active="true"] .gantt__b { animation: chGrowX .8s var(--ps-ease) calc(300ms + var(--i, 0) * 120ms) both; }
/* ===================== DIAGRAM EXTRAS ===================== */
.dg .c, .dg .bus { stroke-linecap: round; stroke-linejoin: round; }
.dg .c--acc { stroke-width: 1.8; }
.dg .n--soft { fill: color-mix(in srgb, var(--nc, var(--accent)) 10%, var(--ps-color-paper)); stroke: var(--nc, var(--accent)); }
.dg .n--dark { fill: var(--ps-color-ink); stroke: var(--ps-color-ink); }
/* a node that can stop the call: tinted and outlined in its own colour, so the legend has something to point at */
.dg .n--block { fill: color-mix(in srgb, var(--nc, var(--ps-color-ms-red-500)) 7%, var(--ps-color-paper)); stroke: var(--nc, var(--ps-color-ms-red-500)); stroke-width: 1.6; }
.dg .nl--light { fill: #fff; }
.dg .ns--light { fill: rgba(255,255,255,.75); }
.dg .diamond { fill: color-mix(in srgb, var(--ps-color-ms-yellow-500) 16%, var(--ps-color-paper)); stroke: var(--ps-color-ms-yellow-500); stroke-width: 1.6; }
.dg .cyl { fill: color-mix(in srgb, var(--ps-color-ms-blue-500) 10%, var(--ps-color-paper)); stroke: var(--ps-color-ms-blue-500); stroke-width: 1.4; }
.dg .actor { fill: none; stroke: var(--ps-color-ink-2); stroke-width: 1.8; stroke-linecap: round; }
.dg .life { stroke: var(--ps-color-rule-2); stroke-width: 1.5; stroke-dasharray: 5 4; }
.dg .act { fill: color-mix(in srgb, var(--accent) 13%, var(--ps-color-paper)); stroke: color-mix(in srgb, var(--accent) 55%, transparent); stroke-width: 1; }
.dg .msg { font-family: var(--ps-font-mono); font-size: 11px; fill: var(--ps-color-ink-2); }
.dg .note { fill: color-mix(in srgb, var(--ps-color-ms-yellow-500) 16%, var(--ps-color-paper)); stroke: var(--ps-color-ms-yellow-500); }
.dg .lane { fill: color-mix(in srgb, var(--lc) 6%, transparent); stroke: var(--lc); stroke-width: 1.2; stroke-dasharray: 5 4; }
.dg .lanel { font-family: var(--ps-font-mono); font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; fill: var(--lc); }
.dg .ent { fill: var(--ps-color-paper); stroke: var(--ps-color-ink-2); stroke-width: 1.4; }
.dg .enth { fill: var(--ps-color-ink); }
.dg .entt { font-size: 13px; font-weight: 700; fill: #fff; }
.dg .attr { font-family: var(--ps-font-mono); font-size: 11px; fill: var(--ps-color-ink-2); }
.dg .attr--pk { font-weight: 700; fill: var(--ps-color-ink); }
.dg .c--fat { stroke-width: 2.4; }
.dg .c--red { stroke: var(--ps-text-red); }
.dg .c--green { stroke: var(--ps-color-ms-green-500); }
.dg .c--blue { stroke: var(--ps-color-ms-blue-500); }
.dg .c--yellow { stroke: var(--ps-color-ms-yellow-500); }
.dg .tag { font-family: var(--ps-font-mono); font-size: 9.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; fill: var(--ps-color-ink-3); }
.dg .big { font-size: 15px; font-weight: 700; }
/* ===================== SIMULATIONS ===================== */
.term { background: #0F1115; color: #E6E6E6; border-radius: 12px; border: 1px solid rgba(255,255,255,.08); overflow: hidden; font-family: var(--ps-font-mono); font-size: 12.5px; box-shadow: 0 20px 50px rgba(0,0,0,.25); }
.term__bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #171A20; border-bottom: 1px solid rgba(255,255,255,.06); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.5); }
.term__bar i { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.term__bar i:nth-child(1) { background: #FF5F57; } .term__bar i:nth-child(2) { background: #FEBC2E; } .term__bar i:nth-child(3) { background: #28C840; }
.term__bar span { margin-left: 10px; }
.term pre { margin: 0; padding: 16px 18px; white-space: pre-wrap; line-height: 1.55; min-height: 300px; max-height: 420px; overflow: auto; }
.term--comfortable pre { font-size:16px; }
.term .p { color: #7FBA00; } .term .c { color: #00A4EF; } .term .w { color: #FFB900; } .term .e { color: #F25022; } .term .d { color: rgba(255,255,255,.45); } .term .b { color: #fff; font-weight: 700; }
.term .cur { display: inline-block; width: 8px; height: 14px; background: #E6E6E6; vertical-align: -2px; animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
/* VS Code light mock */
.vsc { border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); background: #FFFFFF; box-shadow: 0 20px 50px rgba(26,26,25,.14); font-size: 12px; color: #1F1F1F; display: grid; grid-template-rows: 34px minmax(0, 1fr) 22px; height: 470px; }
.vsc__title { display: flex; align-items: center; gap: 14px; padding: 0 14px; background: #F3F3F3; border-bottom: 1px solid #E5E5E5; font-size: 11.5px; color: #616161; }
.vsc__title b { color: #1F1F1F; font-weight: 600; }
.vsc__body { display: grid; grid-template-columns: 48px 200px minmax(0, 1fr) 360px; min-height: 0; }
.vsc__act { background: #F8F8F8; border-right: 1px solid #E5E5E5; display: flex; flex-direction: column; align-items: center; gap: 18px; padding-top: 14px; color: #616161; }
.vsc__act .ii { width: 22px; height: 22px; }
.vsc__act .on { color: #005FB8; }
.vsc__side { background: #F8F8F8; border-right: 1px solid #E5E5E5; padding: 10px 0; font-size: 12px; }
.vsc__side h6 { margin: 0 14px 8px; font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase; color: #616161; font-weight: 700; }
.vsc__side div { padding: 4px 14px 4px 24px; color: #3B3B3B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vsc__side div.sel { background: #E8E8E8; color: #1F1F1F; }
.vsc__side div.dir { padding-left: 14px; font-weight: 600; }
.vsc__ed { background: #FFFFFF; display: grid; grid-template-rows: 32px minmax(0, 1fr); min-width: 0; }
.vsc__tabs { display: flex; background: #F3F3F3; border-bottom: 1px solid #E5E5E5; }
.vsc__tabs span { padding: 0 16px; line-height: 32px; font-size: 11.5px; color: #616161; border-right: 1px solid #E5E5E5; }
.vsc__tabs span.on { background: #FFFFFF; color: #1F1F1F; border-top: 2px solid #005FB8; }
.vsc__code { margin: 0; padding: 12px 16px; font-family: var(--ps-font-mono); font-size: 11.5px; line-height: 1.6; color: #1F1F1F; overflow: auto; white-space: pre; }
.vsc__code .ln { display: inline-block; width: 26px; color: #707070; text-align: right; margin-right: 14px; user-select: none; }
.vsc__code .kw { color: #AF00DB; } .vsc__code .fn { color: #795E26; } .vsc__code .st { color: #A31515; } .vsc__code .cm { color: #008000; } .vsc__code .ty { color: #267F99; }
.vsc__code .add { background: #E6FFEC; display: block; } .vsc__code .del { background: #FFEBE9; display: block; }
.vsc__chat { background: #FFFFFF; border-left: 1px solid #E5E5E5; display: grid; grid-template-rows: 34px minmax(0, 1fr) 62px; min-width: 0; }
.vsc__chath { display: flex; align-items: center; gap: 8px; padding: 0 14px; border-bottom: 1px solid #E5E5E5; font-size: 12px; font-weight: 600; color: #1F1F1F; }
.vsc__chath .pill { margin-left: auto; }
.vsc__msgs { padding: 12px 14px; overflow: auto; display: grid; gap: 10px; align-content: start; }
.msg { border-radius: 8px; padding: 10px 12px; font-size: 12px; line-height: 1.5; max-width: 100%; }
.msg--u { background: #F3F3F3; color: #1F1F1F; justify-self: end; border: 1px solid #E5E5E5; }
.msg--a { background: #FFFFFF; border: 1px solid #E5E5E5; color: #1F1F1F; }
.msg--a b { color: #005FB8; }
.msg .tool { display: flex; align-items: center; gap: 8px; margin-top: 6px; padding: 6px 8px; border-radius: 6px; background: #F8F8F8; font-family: var(--ps-font-mono); font-size: 11px; color: #3B3B3B; }
.msg .tool i { width: 8px; height: 8px; border-radius: 50%; background: #7FBA00; display: inline-block; }
.msg .tool i.x { background: #F25022; }
.msg .cite { font-family: var(--ps-font-mono); font-size: 10.5px; color: #616161; margin-top: 6px; }
.slide[data-active="true"] .msg { animation: fadeUp .45s var(--ps-ease) calc(400ms + var(--i, 0) * 700ms) both; }
.vsc__in { margin: 10px 12px; border: 1px solid #C8C8C8; border-radius: 8px; padding: 8px 12px; font-size: 12px; color: #616161; display: flex; align-items: center; gap: 8px; }
.vsc__in .pill { margin-left: auto; }
.vsc__status { background: #005FB8; color: #fff; font-size: 10.5px; display: flex; align-items: center; gap: 16px; padding: 0 12px; }
/* Copilot Chat standalone (light) */
.chatwin { border-radius: 12px; border: 1px solid var(--ps-color-rule-2); background: #FFFFFF; box-shadow: 0 20px 50px rgba(26,26,25,.12); display: grid; grid-template-rows: 44px minmax(0, 1fr) 64px; height: 456px; overflow: hidden; }
.chatwin__h { display: flex; align-items: center; gap: 10px; padding: 0 18px; border-bottom: 1px solid #E5E5E5; font-weight: 600; font-size: 13px; }
.chatwin__h .ii { width: 20px; height: 20px; color: #005FB8; }
.chatwin__b { padding: 16px 18px; overflow: auto; display: grid; gap: 12px; align-content: start; }
.chatwin .msg { max-width: 82%; font-size: 13px; }
.chatwin__in { margin: 10px 14px; border: 1px solid #C8C8C8; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #616161; display: flex; align-items: center; gap: 10px; }
/* Azure portal mock (light) */
.portal { border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); background: #FAFAFA; box-shadow: 0 20px 50px rgba(26,26,25,.14); font-size: 12px; color: #323130; display: grid; grid-template-rows: 40px 30px minmax(0, 1fr); height: 500px; }
.portal__top { background: #0B1F45; color: #fff; display: flex; align-items: center; gap: 18px; padding: 0 16px; font-size: 12.5px; }
.portal__top .search { flex: 1; max-width: 520px; height: 24px; border-radius: 4px; background: #fff; color: #605E5C; display: flex; align-items: center; padding: 0 10px; font-size: 11.5px; }
.portal__crumb { display: flex; align-items: center; gap: 8px; padding: 0 16px; background: #fff; border-bottom: 1px solid #EDEBE9; color: #605E5C; font-size: 11.5px; }
.portal__crumb b { color: #323130; }
.portal__body { display: grid; grid-template-columns: 210px minmax(0, 1fr); min-height: 0; }
.portal__menu { background: #fff; border-right: 1px solid #EDEBE9; padding: 8px 0; overflow: hidden; }
.portal__menu div { padding: 6px 16px; color: #323130; display: flex; gap: 8px; align-items: center; white-space: nowrap; }
.portal__menu div.sel { background: #EFF6FC; border-left: 3px solid #0078D4; color: #0078D4; font-weight: 600; }
.portal__menu h6 { margin: 8px 16px 4px; font-size: 10.5px; color: #605E5C; text-transform: uppercase; letter-spacing: .06em; }
.portal__menu .ii { width: 16px; height: 16px; }
.portal__main { padding: 16px 18px; overflow: hidden; display: grid; grid-template-rows: auto auto minmax(0, 1fr); gap: 14px; }
.portal__title { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 600; }
.portal__title small { font-size: 11.5px; color: #605E5C; font-weight: 400; }
.portal__cards { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.azcard { background: #fff; border: 1px solid #EDEBE9; border-radius: 4px; padding: 10px 12px; }
.azcard small { display: block; color: #605E5C; font-size: 10.5px; }
.azcard b { font-size: 20px; font-weight: 600; color: #323130; }
.azcard svg { width: 100%; height: 34px; overflow: visible; }
.ptable { background: #fff; border: 1px solid #EDEBE9; border-radius: 4px; overflow: hidden; }
.ptable table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
.ptable th { text-align: left; padding: 8px 12px; background: #F3F2F1; color: #605E5C; font-weight: 600; }
.ptable td { padding: 8px 12px; border-top: 1px solid #EDEBE9; }
.ptable .st { display: inline-flex; align-items: center; gap: 6px; }
.ptable .st i { width: 8px; height: 8px; border-radius: 50%; background: #107C10; display: inline-block; }
.ptable .st i.warn { background: #D83B01; }
/* GitHub PR mock (light) */
.ghpr { border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); background: #fff; box-shadow: 0 20px 50px rgba(26,26,25,.12); font-size: 12.5px; color: #1F2328; display: grid; grid-template-rows: 44px auto minmax(0, 1fr); height: 500px; }
.ghpr__top { background: #F6F8FA; border-bottom: 1px solid #D0D7DE; display: flex; align-items: center; gap: 14px; padding: 0 16px; color: #57606A; }
.ghpr__top b { color: #1F2328; }
.ghpr__head { padding: 14px 18px 0; }
.ghpr__head h4 { margin: 0; font-size: 20px; font-weight: 600; }
.ghpr__head h4 small { color: #57606A; font-weight: 400; }
.ghpr__meta { display: flex; align-items: center; gap: 10px; margin: 8px 0 10px; color: #57606A; }
.ghpr__meta .open { background: #1F883D; color: #fff; border-radius: 999px; padding: 3px 10px; font-weight: 600; }
.ghpr__tabs { display: flex; gap: 18px; border-bottom: 1px solid #D0D7DE; }
.ghpr__tabs span { padding: 8px 4px; color: #57606A; }
.ghpr__tabs span.on { color: #1F2328; border-bottom: 2px solid #FD8C73; font-weight: 600; }
.ghpr__body { padding: 14px 18px; overflow: auto; display: grid; gap: 10px; align-content: start; }
.ghpr__checks { border: 1px solid #D0D7DE; border-radius: 6px; overflow: hidden; }
.ghpr__checks div { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-top: 1px solid #D0D7DE; }
.ghpr__checks div:first-child { border-top: 0; background: #F6F8FA; font-weight: 600; }
.ghpr__checks i { width: 10px; height: 10px; border-radius: 50%; background: #1A7F37; display: inline-block; }
.ghpr__checks i.pend { background: #BF8700; } .ghpr__checks i.fail { background: #CF222E; }
.ghpr__checks .r { margin-left: auto; color: #57606A; font-size: 11.5px; }
.ghpr__cmt { border: 1px solid #D0D7DE; border-radius: 6px; }
.ghpr__cmt .h { background: #F6F8FA; padding: 8px 12px; border-bottom: 1px solid #D0D7DE; color: #57606A; }
.ghpr__cmt .h b { color: #1F2328; }
.ghpr__cmt .b { padding: 10px 12px; line-height: 1.5; }
.ghpr__cmt pre { margin: 8px 0 0; padding: 8px 10px; background: #F6F8FA; border-radius: 6px; font-family: var(--ps-font-mono); font-size: 11.5px; }
/* browser + phone */
.browser { border-radius: 12px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); background: #fff; box-shadow: 0 20px 50px rgba(26,26,25,.12); display: grid; grid-template-rows: 40px minmax(0, 1fr); height: 480px; }
.browser__bar { background: #F3F3F3; border-bottom: 1px solid #E5E5E5; display: flex; align-items: center; gap: 10px; padding: 0 12px; }
.browser__bar i { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
.browser__bar i:nth-child(1) { background: #FF5F57; } .browser__bar i:nth-child(2) { background: #FEBC2E; } .browser__bar i:nth-child(3) { background: #28C840; }
.browser__url { flex: 1; max-width: 560px; margin-left: 12px; height: 24px; background: #fff; border: 1px solid #E5E5E5; border-radius: 6px; display: flex; align-items: center; padding: 0 12px; font-family: var(--ps-font-mono); font-size: 11px; color: #616161; }
.browser__page { padding: 22px 26px; overflow: hidden; }
.phone { width: 280px; height: 500px; border-radius: 36px; border: 10px solid #1A1A19; background: #fff; box-shadow: 0 20px 50px rgba(26,26,25,.25); overflow: hidden; position: relative; margin: 0 auto; }
.phone::before { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 90px; height: 22px; border-radius: 12px; background: #1A1A19; }
.phone__scr { padding: 42px 16px 16px; font-size: 12px; color: #1F1F1F; display: grid; gap: 10px; align-content: start; }
.toast { border-radius: 12px; padding: 10px 12px; background: #F3F3F3; border: 1px solid #E5E5E5; display: grid; grid-template-columns: 28px minmax(0, 1fr); gap: 10px; align-items: start; }
.toast .ii { width: 24px; height: 24px; color: #005FB8; }
.toast b { display: block; font-size: 12px; }
.toast span { font-size: 11.5px; color: #616161; line-height: 1.4; }
.slide[data-active="true"] .toast { animation: fadeUp .5s var(--ps-ease) calc(400ms + var(--i, 0) * 500ms) both; }
/* ===================== INTERACTIVES ===================== */
.lr--noicon { grid-template-columns:64px minmax(0,1fr); }
.lr__n, .lr__k, .lr__i { color:var(--tc,var(--ps-color-ink)); }
.ibtn { appearance: none; border: 1px solid var(--ps-color-rule-2); background: var(--ps-color-paper); color: var(--ps-color-ink); border-radius: 8px; padding: 12px 16px; font-family: var(--ps-font-sans); font-size: 14px; text-align: left; cursor: pointer; transition: border-color .15s, background .15s, transform .15s; }
.ibtn:hover { border-color: var(--accent); transform: translateY(-1px); }
.ibtn:focus-visible, .toggle__sw button:focus-visible, .tabs__bar button:focus-visible,
.hot__pt:focus-visible, .csim__o:focus-visible, .tree summary:focus-visible,
.calc input[type=range]:focus-visible {
  outline: 3px solid color-mix(in srgb, var(--accent) 72%, white);
  outline-offset: 3px;
}
.ibtn[aria-pressed="true"] { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--ps-color-paper)); }
.ibtn.ok { border-color: var(--ps-color-ms-green-500); background: color-mix(in srgb, var(--ps-color-ms-green-500) 16%, var(--ps-color-paper)); }
.ibtn.bad { border-color: var(--ps-color-ms-red-500); background: color-mix(in srgb, var(--ps-color-ms-red-500) 12%, var(--ps-color-paper)); }
.quiz { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 28px; margin-top: 20px; }
.quiz__q { font-size: 22px; font-weight: 600; line-height: 1.3; margin-bottom: 16px; }
.quiz__opts { display: grid; gap: 10px; }
.quiz__opts .ibtn { min-height:44px; font-size:18px; line-height:1.4; }
.quiz .ipanel__k { font-size:13px; }
.quiz .ipanel__t, .quiz .ipanel__empty { font-size:17px; }
.quiz__opts .ibtn b { font-family: var(--ps-font-mono); color: var(--ps-color-ink-2); margin-right: 10px; }
.ipanel { border-radius: 12px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-top: 6px solid var(--accent); padding: 20px 22px; min-height: 148px; }
.ipanel__k { font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ps-color-ink-3); margin-bottom: 10px; }
.ipanel__v { font-size: 34px; font-weight: 600; letter-spacing: -.02em; line-height: 1.1; }
.ipanel__t { font-size: 14px; line-height: 1.55; color: var(--ps-color-ink-2); margin-top: 10px; }
.ipanel__empty { color: var(--ps-color-ink-3); font-size: 14px; }
.assess { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 28px; margin-top: 18px; }
.assess__list { display: grid; gap: 10px; }
.aq { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 14px; align-items: center; padding: 10px 14px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); font-size: 14px; }
.aq .seg { display: flex; gap: 6px; }
.aq .seg button { min-width: 64px; padding: 8px 10px; font-size: 12px; }
.ladder { display: grid; gap: 6px; margin-top: 12px; }
.ladder div { padding: 8px 12px; border-radius: 6px; font-size: 13px; color: var(--ps-color-ink-3); border: 1px solid var(--ps-color-rule); display: flex; gap: 10px; align-items: center; }
.ladder div b { font-family: var(--ps-font-mono); font-size: 11px; }
.ladder div.on { background: color-mix(in srgb, var(--accent) 16%, var(--ps-color-paper)); color: var(--ps-color-ink); border-color: var(--accent); font-weight: 600; }
.calc { display: grid; grid-template-columns: minmax(0, 1fr) 420px; gap: 28px; margin-top: 18px; align-items: start; }
.calc__row { display: grid; grid-template-columns: 220px minmax(0, 1fr) 90px; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--ps-color-rule); }
.calc__row label { font-size: 14px; font-weight: 600; }
.calc__row output { font-family: var(--ps-font-mono); font-size: 14px; font-weight: 700; color: var(--accent); text-align: right; }
.calc input[type=range] { width: 100%; accent-color: var(--accent); }
.calc__big { font-family: var(--ps-font-mono); font-size: 64px; font-weight: 700; letter-spacing: -.04em; color: var(--accent); line-height: 1; }
.calc__big small { font-size: 18px; letter-spacing: 0; color: var(--ps-color-ink-3); margin-left: 8px; }
.toggle { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; margin-top: 18px; }
.toggle__sw { display: inline-flex; gap: 0; border: 1px solid var(--ps-color-rule-2); border-radius: 999px; overflow: hidden; }
.toggle__sw button { padding: 10px 22px; min-height: 44px; min-width: 44px; border: 0; background: var(--ps-color-paper); font-family: var(--ps-font-mono); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; cursor: pointer; color: var(--ps-color-ink-3); }
.toggle__sw button[aria-pressed="true"] { background: var(--ps-color-ink); color: #fff; }
/* os dois paineis ocupam a mesma celula do grid: a altura e a do maior, nunca uma altura fixa */
.toggle__panels { display: grid; }
.toggle__empty { grid-area: 1 / 1; }
.toggle__p { grid-area: 1 / 1; opacity: 0; transition: opacity .35s; pointer-events: none; }
.toggle__p.on { opacity: 1; pointer-events: auto; }
.tabs { margin-top: 16px; }
.tabs__bar { display: flex; gap: 8px; border-bottom: 2px solid var(--ps-color-rule); }
.tabs__bar button { border: 0; background: none; min-height:44px; padding: 10px 16px; font-family: var(--ps-font-sans); font-size: 18px; font-weight: 600; color: var(--ps-color-ink-2); cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px; }
.tabs__empty { font-size:18px; line-height:1.5; }
.tabs__bar button[aria-selected="true"] { color: var(--ps-color-ink); border-bottom-color: var(--accent); }
.tabs__p { display: none; padding-top: 18px; }
.tabs__p.on { display: block; animation: fadeUp .35s var(--ps-ease) both; }
.hot { position: relative; margin-top: 12px; }
.hot__pt { position: absolute; width: 30px; height: 30px; border-radius: 50%; background: var(--c); color: #1A1A1A; font-family: var(--ps-font-mono); font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 0; box-shadow: 0 0 0 6px color-mix(in srgb, var(--c) 30%, transparent); transform: translate(-50%, -50%); }
.hot__pt::after { content: ''; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--c); animation: hotPulse 1.8s ease-out infinite; }
@keyframes hotPulse { 0% { transform: scale(1); opacity: .9; } 100% { transform: scale(1.9); opacity: 0; } }
.hot__tip { position: absolute; width: 260px; padding: 12px 14px; border-radius: 8px; background: var(--ps-color-ink); color: #fff; font-size: 12.5px; line-height: 1.45; opacity: 0; pointer-events: none; transition: opacity .2s; transform: translate(-50%, 12px); z-index: 2; }
.hot__tip b { display: block; margin-bottom: 4px; color: var(--c); }
.hot__tip.on { opacity: 1; }
.hot__tip--up { transform: translate(-50%, calc(-100% - 26px)); }
.poll { display: grid; gap: 12px; margin-top: 20px; }
.poll__o { display: grid; grid-template-columns: 240px minmax(0, 1fr) 70px; gap: 14px; align-items: center; cursor: pointer; }
.poll__o .ibtn { padding: 10px 14px; }
.poll__t { height: 22px; border-radius: 11px; background: color-mix(in srgb, var(--ps-color-ink-3) 12%, transparent); overflow: hidden; }
.poll__f { height: 100%; width: 0; background: var(--c); border-radius: 11px; transition: width .6s var(--ps-ease); }
.poll__v { font-family: var(--ps-font-mono); font-size: 13px; font-weight: 700; color: var(--c); text-align: right; }
/* ===================== MEDIA, SHAPES, CODE ===================== */
.fig { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: 28px; align-items: center; margin-top: 16px; }
.fig__img { width: 100%; border-radius: 12px; border: 1px solid var(--ps-color-rule); box-shadow: 0 16px 40px rgba(26,26,25,.12); display: block; }
.fig__cap { font-size: 15px; line-height: 1.55; color: var(--ps-color-ink-2); }
.fig__src { font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--ps-color-ink-3); margin-top: 10px; }
/* wide figure: a banner image across the useful width, caption and source under it */
.figw { margin-top: 14px; }
.figw__img { width: 100%; max-height: 430px; object-fit: cover; object-position: center; border-radius: 12px; border: 1px solid var(--ps-color-rule); box-shadow: 0 16px 40px rgba(26,26,25,.14); display: block; }
.figw__row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; margin-top: 14px; }
.figw__cap { font-size: 16px; line-height: 1.5; color: var(--ps-color-ink-2); max-width: 900px; text-wrap: pretty; }
.figw__src { font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--ps-color-ink-3); white-space: nowrap; }
/* statement + photo: a big sentence beside a photo, for a narrative beat */
.stmt { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 44px; align-items: center; margin-top: 10px; }
.stmt__t { font-size: 40px; line-height: 1.15; font-weight: 500; letter-spacing: -.02em; color: var(--ps-color-ink); text-wrap: balance; }
.stmt__t .acc { color: var(--accent); }
:is(.slide--light[style*="--ps-color-ms-blue-500"], .slide--light[style*="--ps-color-ms-green-500"], .slide--light[style*="--ps-color-ms-yellow-500"]) :is(.stmt__t .acc, .hero-stmt .acc) {
  color:var(--ps-color-ink);
  text-decoration:underline;
  text-decoration-color:var(--accent);
  text-decoration-thickness:.08em;
  text-underline-offset:.12em;
}
.stmt__s { font-size: 16px; line-height: 1.5; color: var(--ps-color-ink-2); margin-top: 18px; max-width: 520px; text-wrap: pretty; }
.stmt__img { width: 100%; height: 420px; object-fit: cover; border-radius: 14px; border: 1px solid var(--ps-color-rule); box-shadow: 0 20px 50px rgba(26,26,25,.16); display: block; }
.stmt__img--contain { height: auto; max-height: 420px; object-fit: contain; }
.stmt__img--round { border-radius: 50%; aspect-ratio: 1; height: auto; width: min(100%, 420px); justify-self: center; }
.stmt__src { font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--ps-color-ink-3); margin-top: 10px; }
.slide[data-active="true"] .stmt__img, .slide[data-active="true"] .figw__img { animation: fadeUp .7s var(--ps-ease) 150ms both; }
.slide[data-active="true"] .stmt__t { animation: fadeUp .6s var(--ps-ease) 300ms both; }
.imgcmp { margin: 14px 0 0; }
.imgcmp__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; }
.imgcmp__item { position: relative; min-width: 0; }
.imgcmp__img { width: 100%; height: 360px; object-fit: cover; border-radius: 12px; border: 1px solid var(--ps-color-rule); box-shadow: 0 16px 40px rgba(26,26,25,.12); display: block; }
.imgcmp__label { position: absolute; top: 14px; left: 14px; padding: 7px 10px; border-radius: 999px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); font-family: var(--ps-font-mono); font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.imgcmp__label--before { box-shadow: inset 4px 0 0 var(--ps-color-ms-red-500); }
.imgcmp__label--after { box-shadow: inset 4px 0 0 var(--ps-color-ms-green-500); }
.imgcmp__foot { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: end; margin-top: 12px; color: var(--ps-color-ink-2); font-size: 14px; line-height: 1.5; }
.slide[data-active="true"] .imgcmp__item:first-child { animation: fadeUp .65s var(--ps-ease) 120ms both; }
.slide[data-active="true"] .imgcmp__item:last-child { animation: fadeUp .65s var(--ps-ease) 300ms both; }
.vid { border-radius: 12px; overflow: hidden; border: 1px solid var(--ps-color-rule); background: #000; box-shadow: 0 20px 50px rgba(26,26,25,.2); aspect-ratio: 16 / 9; position: relative; }
.vid video { width: 100%; height: 100%; display: block; }
.vid__play { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.vid__play i { width: 84px; height: 84px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; }
.vid__play i::after { content: ''; border-left: 26px solid #1A1A1A; border-top: 16px solid transparent; border-bottom: 16px solid transparent; margin-left: 8px; }
.shapes { position: relative; height: 480px; margin-top: 10px; }
.shp { position: absolute; }
.shp--c { border-radius: 50%; }
.shp--r { border-radius: 24px; }
.shp--t { width: 0; height: 0; border-left: 90px solid transparent; border-right: 90px solid transparent; }
.shp--blob { border-radius: 62% 38% 55% 45% / 45% 55% 45% 55%; }
.shp--ring { border-radius: 50%; border: 22px solid var(--c); background: transparent !important; }
.slide[data-active="true"] .shp { animation: popIn .9s var(--ps-ease) calc(200ms + var(--i, 0) * 120ms) both; }
.slide[data-active="true"] .shp--float { animation: popIn .9s var(--ps-ease) calc(200ms + var(--i, 0) * 120ms) both, shpFloat 6s ease-in-out calc(1200ms + var(--i, 0) * 300ms) infinite; }
@keyframes shpFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -16px; } }
.icongrid { display: grid; grid-template-columns: repeat(10, minmax(0, 1fr)); gap: 10px; margin-top: 18px; }
.ig { display: grid; gap: 6px; justify-items: center; padding: 10px 4px 8px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.ig svg { width: 26px; height: 26px; color: var(--ps-color-ink-2); }
.ig span { font-family: var(--ps-font-mono); font-size: 8.5px; line-height: 1.25; color: var(--ps-color-ink-3); text-align: center; max-width: 100%; overflow-wrap: anywhere !important; word-break: break-all !important; }
.md table, .md pre, .md blockquote, .md ul, .md ol { break-inside: avoid; }
.md h3, .md h4 { break-after: avoid; }
.md { columns: 2; column-gap: 40px; font-size: 14px; line-height: 1.6; color: var(--ps-color-ink-2); margin-top: 14px; }
.md h3 { font-size: 20px; margin: 0 0 8px; color: var(--ps-color-ink); break-after: avoid; }
.md h4 { font-size: 15px; margin: 14px 0 6px; color: var(--accent); }
.md p { margin: 0 0 10px; }
.md ul { margin: 0 0 10px 18px; padding: 0; }
.md code { font-family: var(--ps-font-mono); font-size: 12px; background: color-mix(in srgb, var(--ps-color-ink-3) 12%, transparent); padding: 1px 6px; border-radius: 4px; }
.md pre { background: var(--ps-color-ink); color: #E6E6E6; padding: 12px 14px; border-radius: 8px; font-size: 11.5px; overflow: auto; }
.md blockquote { margin: 10px 0; padding: 6px 14px; border-left: 4px solid var(--accent); color: var(--ps-color-ink); }
.md table { border-collapse: collapse; width: 100%; font-size: 12.5px; }
.md th, .md td { padding: 6px 8px; border-bottom: 1px solid var(--ps-color-rule); text-align: left; }
.diff { font-family: var(--ps-font-mono); font-size: 12.5px; line-height: 1.55; border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); margin-top: 16px; }
.diff__h { padding: 8px 14px; background: color-mix(in srgb, var(--ps-color-ink-3) 10%, var(--ps-color-paper)); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ps-color-ink-3); display: flex; gap: 16px; }
.diff pre { margin: 0; padding: 10px 0; background: var(--ps-color-paper); white-space: pre; overflow: auto; }
.diff .l { display: block; padding: 0 14px 0 54px; position: relative; }
.diff .l::before { content: attr(data-n); position: absolute; left: 14px; width: 30px; text-align: right; color: var(--ps-color-ink-3); }
.diff .add { background: #E6FFEC; color: #116329; } .diff .del { background: #FFEBE9; color: #82071E; }
.diff .add::after { content: '+'; position: absolute; left: 44px; } .diff .del::after { content: '-'; position: absolute; left: 44px; }
.tree { font-family: var(--ps-font-mono); font-size: 13px; margin-top: 14px; }
.tree details { margin-left: 18px; }
.tree summary { cursor: pointer; padding: 4px 6px; border-radius: 4px; color: var(--ps-color-ink); }
.tree summary:hover { background: color-mix(in srgb, var(--accent) 10%, transparent); }
.tree .k { color: var(--ps-text-blue); } .tree .s { color: var(--ps-text-red); } .tree .n { color: var(--ps-text-green); } .tree .b { color: var(--ps-text-yellow); }
.tree div { margin-left: 34px; padding: 2px 0; }
.codewin { flex-shrink: 0; border-radius: 10px; overflow: hidden; border: 1px solid var(--ps-color-rule-2); background: var(--ps-color-paper); margin-top: 16px; }
img[data-ps-asset-kind="product-evidence"] { object-fit: contain; }
.codewin__h { display: flex; align-items: center; gap: 10px; padding: 8px 14px; background: color-mix(in srgb, var(--ps-color-ink-3) 10%, var(--ps-color-paper)); font-family: var(--ps-font-mono); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--ps-color-ink-3); }
.codewin pre { margin: 0; padding: 12px 0; font-family: var(--ps-font-mono); font-size: 12px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
.codewin .l { display: block; padding: 0 16px 0 56px; position: relative; text-indent: 0; }
.codewin .l::after { content: ''; }
.codewin .l::before { content: attr(data-n); position: absolute; left: 14px; width: 30px; text-align: right; color: var(--ps-color-ink-3); }
.codewin .hl { background: color-mix(in srgb, var(--ps-color-ms-yellow-500) 22%, transparent); box-shadow: inset 4px 0 0 var(--ps-color-ms-yellow-500); }
.codewin .kw { color: #AF00DB; } .codewin .st { color: #A31515; } .codewin .cm { color: var(--ps-color-ink-3); font-style: italic; } .codewin .fn { color: #795E26; }
/* two-column layout helper */
.cols2 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px; margin-top: 16px; align-items: start; }
.cols2 > * { min-width: 0; }
.cols2--wide { grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); }
.slide--light .scn text.m[style*="--ps-color-ms-blue-500"] { fill:var(--ps-text-blue) !important; }
.slide--light .scn text.m[style*="--ps-color-ms-red-500"] { fill:var(--ps-text-red) !important; }
.slide--light .scn text.m[style*="--ps-color-ms-green-500"] { fill:var(--ps-text-green) !important; }
.slide--light .scn text.m[style*="--ps-color-ms-yellow-500"] { fill:var(--ps-text-yellow) !important; }
.slide--light .scn path.ln[style*="--ps-color-ms-blue-500"] { stroke:var(--ps-text-blue) !important; opacity:1 !important; }
.slide--light .scn path.ln[style*="--ps-color-ms-red-500"] { stroke:var(--ps-text-red) !important; opacity:1 !important; }
.slide--light .scn path.ln[style*="--ps-color-ms-green-500"] { stroke:var(--ps-text-green) !important; opacity:1 !important; }
.slide--light .scn path.ln[style*="--ps-color-ms-yellow-500"] { stroke:var(--ps-text-yellow) !important; opacity:1 !important; }
.linkcards--2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
/* ===================== CHAIN SIMULATOR ===================== */
/* The call walks a visible chain of controls; the stage that stops it lights up, so the answer is
   never a bare word: you can point at where it stopped and rebuild the reasoning out loud. */
.csim { display: grid; gap: 15px; margin-top: 14px; }
.csim__ctl { display: grid; grid-template-columns: minmax(0,1.12fr) minmax(0,1fr); gap: 24px; align-items: start; }
.csim__k { font-family: var(--ps-font-mono); font-size: 9.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--label, var(--ps-label-ms)); margin-bottom: 7px; }
.csim__opts { display: grid; gap: 6px; }
.csim__o { font-family: var(--ps-font-mono); font-size: 12px; line-height: 1.35; text-align: left; padding: 8px 12px; border: 1px solid var(--ps-color-rule); border-radius: 6px; background: var(--ps-color-paper); color: var(--ps-color-ink-2); cursor: pointer; transition: border-color .18s, background .18s, box-shadow .18s; }
.csim__o:hover { border-color: var(--ps-color-rule-2); }
.csim__o[aria-pressed="true"] { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 9%, transparent); color: var(--ps-color-ink); box-shadow: inset 3px 0 0 var(--accent); font-weight: 600; }
.csim__chain { display: grid; grid-template-columns: minmax(0,1fr) 26px minmax(0,1fr) 26px minmax(0,1fr) 26px minmax(0,1fr); align-items: stretch; }
.csim__st { display: grid; align-content: start; gap: 4px; padding: 11px 13px 10px; border: 1px solid var(--ps-color-rule); border-radius: 8px; background: var(--ps-color-paper); transition: border-color .25s, background .25s, opacity .25s; }
.csim__st b { font-size: 13px; line-height: 1.25; color: var(--ps-color-ink); }
.csim__st small { font-family: var(--ps-font-mono); font-size: 9.5px; line-height: 1.45; color: var(--ps-color-ink-3); }
.csim__badge { justify-self: start; margin-top: 3px; min-height: 16px; padding: 2px 8px; border-radius: 10px; font-family: var(--ps-font-mono); font-size: 9.5px; font-weight: 700; font-style: normal; letter-spacing: .1em; text-transform: uppercase; background: var(--ps-color-bg); color: var(--ps-color-ink-3); }
.csim__ar { align-self: center; text-align: center; font-size: 15px; color: var(--ps-color-rule-2); transition: color .25s; }
.csim__ar[data-on="1"] { color: var(--ps-color-ms-green-500); }
.csim__st[data-state="off"] { opacity: .5; border-style: dashed; }
.csim__st[data-state="skip"] { opacity: .38; }
.csim__st[data-state="pass"] { border-color: var(--ps-color-ms-green-500); }
.csim__st[data-state="pass"] .csim__badge, .csim__st[data-state="allow"] .csim__badge { background: color-mix(in srgb, var(--ps-color-ms-green-500) 16%, transparent); color: var(--ps-text-green); }
.csim__st[data-state="allow"] { border-color: var(--ps-color-ms-green-500); background: color-mix(in srgb, var(--ps-color-ms-green-500) 7%, var(--ps-color-paper)); }
.csim__st[data-state="ask"] { border-color: var(--ps-color-ms-yellow-500); background: color-mix(in srgb, var(--ps-color-ms-yellow-500) 9%, var(--ps-color-paper)); }
.csim__st[data-state="ask"] .csim__badge { background: color-mix(in srgb, var(--ps-color-ms-yellow-500) 22%, transparent); color: var(--ps-text-yellow); }
.csim__st[data-state="deny"] { border-color: var(--ps-color-ms-red-500); background: color-mix(in srgb, var(--ps-color-ms-red-500) 8%, var(--ps-color-paper)); }
.csim__st[data-state="deny"] .csim__badge { background: color-mix(in srgb, var(--ps-color-ms-red-500) 16%, transparent); color: var(--ps-text-red); }
.csim__out { display: grid; grid-template-columns: 132px minmax(0,1fr); gap: 18px; align-items: center; padding: 13px 16px; border: 1px solid var(--ps-color-rule); border-left: 5px solid var(--vc, var(--ps-color-rule-2)); border-radius: 8px; background: var(--ps-color-paper); }
.csim__out:not([data-v]), .csim__out[data-v=""] { grid-template-columns: minmax(0,1fr); }
.csim__out:not([data-v]) .csim__verdict, .csim__out[data-v=""] .csim__verdict { display: none; }
.csim__out[data-v="allow"] { --vc: var(--ps-color-ms-green-500); }
.csim__out[data-v="ask"] { --vc: var(--ps-color-ms-yellow-500); }
.csim__out[data-v="deny"] { --vc: var(--ps-color-ms-red-500); }
.csim__verdict { font-family: var(--ps-font-mono); font-size: 25px; font-weight: 700; line-height: 1.1; color: var(--vc, var(--ps-color-ink-3)); }
.csim__why { margin: 0; text-align: left; font-size: 13px; line-height: 1.5; color: var(--ps-color-ink-2); }
.csim__badge:empty { display: none; }
.slide--dark .csim__o, .slide--dark .csim__st, .slide--dark .csim__out { background: var(--ps-color-dark-surface); border-color: var(--ps-color-dark-rule); color: var(--ps-color-dark-ink-2); }
.slide--dark .csim__st b { color: var(--ps-color-dark-ink); }
.dg .msg { paint-order: stroke; stroke: var(--ps-color-bg); stroke-width: 5px; stroke-linejoin: round; }
.slide--paper .dg .msg { stroke: var(--ps-color-paper); }
/* markdown slide source */
.mdsrc { display: none; }
"""
