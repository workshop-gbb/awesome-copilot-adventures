# Visual layer v3.0.0 (ms-presentation-deck): components, watermark, icons. Injected as the LAST <style> before </body>.
ICONS = {
 "shield": '<path d="M12 3.5 19 6.5v5.5c0 4.2-3 7.6-7 8.5-4-.9-7-4.3-7-8.5V6.5z"/><path d="M9 12l2 2 4-4.5"/>',
 "lock": '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><path d="M12 14.5v2.5"/>',
 "terminal": '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M7 9l3 3-3 3"/><path d="M12.5 15h4.5"/>',
 "json": '<path d="M8 4.5c-2 0-3 1-3 3v2c0 1.2-.8 2-2 2.5 1.2.5 2 1.3 2 2.5v2c0 2 1 3 3 3"/><path d="M16 4.5c2 0 3 1 3 3v2c0 1.2.8 2 2 2.5-1.2.5-2 1.3-2 2.5v2c0 2-1 3-3 3"/><path d="M12 9.5v.01M12 14.5v.01"/>',
 "bell": '<path d="M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 "clock": '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 "layers": '<path d="M12 4 21 9l-9 5-9-5z"/><path d="M3 13.5 12 18.5l9-5"/><path d="M3 17.5 12 22.5l9-5"/>',
 "branch": '<circle cx="6.5" cy="5.5" r="2.3"/><circle cx="6.5" cy="18.5" r="2.3"/><circle cx="17.5" cy="8.5" r="2.3"/><path d="M6.5 7.8v8.4"/><path d="M17.5 10.8c0 3-3 4.5-6 5-2 .4-4 1-4.8 2.5"/>',
 "loop": '<path d="M4 12a8 8 0 0 1 13.5-5.8"/><path d="M20 12a8 8 0 0 1-13.5 5.8"/><path d="M17.5 3.5v3h-3M6.5 20.5v-3h3"/>',
 "check": '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12.2l2.4 2.4L15.8 9.5"/>',
 "x": '<circle cx="12" cy="12" r="8.5"/><path d="M9 9l6 6M15 9l-6 6"/>',
 "bolt": '<path d="M13.5 3 5.5 13.5h6l-1 7.5 8-10.5h-6z"/>',
 "eye": '<path d="M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 "plug": '<path d="M9 3.5v4M15 3.5v4"/><path d="M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 16v4.5"/>',
 "ladder": '<path d="M7 3.5v17M17 3.5v17"/><path d="M7 7.5h10M7 12h10M7 16.5h10"/>',
 "flag": '<path d="M5.5 21V4"/><path d="M5.5 4.5h12l-2.5 4 2.5 4h-12"/>',
 "file": '<path d="M6 3.5h8l4 4V20.5H6z"/><path d="M14 3.5v4h4"/><path d="M9 12h6M9 15.5h6"/>',
 "gear": '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M6 18l1.6-1.6M16.4 7.6 18 6"/>',
 "wrench": '<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2 2 0 0 1-2.8-2.8l8.5-8.5"/><path d="M14.5 6.5 17 4l3 3-2.5 2.5"/>',
 "folder": '<path d="M3.5 6.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
 "radar": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12 18 6"/>',
 "send": '<path d="M4 12 20 4l-4 16-4-7z"/><path d="M12 13 20 4"/>',
 "users": '<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.5a4.5 4.5 0 0 1 5 4.5"/>',
 "ban": '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
 "tag": '<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
 "steps": '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
 "compass": '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5 13.5 13.5 8.5 15.5l2-5z"/>',
 "money": '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5h.01M18 14.5h.01"/>',
 "puzzle": '<path d="M9.5 4.5a1.8 1.8 0 0 1 3.6 0H16a1 1 0 0 1 1 1v3a1.8 1.8 0 0 1 0 3.6V15a1 1 0 0 1-1 1h-2.9a1.8 1.8 0 0 1-3.6 0H6.5a1 1 0 0 1-1-1v-2.9a1.8 1.8 0 0 1 0-3.6V5.5a1 1 0 0 1 1-1z"/>',
 "note": '<path d="M5 4.5h14v15H5z"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>',
 "spark": '<path d="M12 3.5 13.8 9 19.5 10.8 13.8 12.6 12 18.2 10.2 12.6 4.5 10.8 10.2 9z"/>',
 "cloud": '<path d="M7 18a4 4 0 0 1-.6-7.95A5.5 5.5 0 0 1 17.4 9.2 3.9 3.9 0 0 1 17 18z"/>',
 "laptop": '<rect x="4" y="5" width="16" height="10" rx="1.6"/><path d="M2.5 18.5h19"/>',
 "server": '<rect x="3" y="4" width="18" height="6.5" rx="1.6"/><rect x="3" y="13.5" width="18" height="6.5" rx="1.6"/><path d="M6.5 7.2h.01M6.5 16.8h.01"/>',
 "test": '<path d="M9.5 3.5v6L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3l-4.7-8.5v-6"/><path d="M8 3.5h8"/><path d="M7.4 14.5h9.2"/>',
 "docs": '<path d="M5 4.5h9l5 5V21H5z"/><path d="M14 4.5v5h5"/><path d="M8.5 13h7M8.5 16.5h5"/>',
 "key": '<circle cx="8" cy="14" r="4"/><path d="M11 11.5 20 4"/><path d="M17.5 6.5 19.5 8.5M15.5 8.5 17.5 10.5"/>',
 "alert": '<path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
 "stopwatch": '<circle cx="12" cy="13.5" r="7"/><path d="M12 10v3.5l2.2 1.6"/><path d="M9.5 3.5h5M12 3.5v3"/>',
 "code": '<path d="M8.5 8 4 12l4.5 4"/><path d="M15.5 8 20 12l-4.5 4"/><path d="M13.5 5.5 10.5 18.5"/>',
 "pr": '<circle cx="6.5" cy="6" r="2.3"/><circle cx="6.5" cy="18" r="2.3"/><circle cx="17.5" cy="18" r="2.3"/><path d="M6.5 8.3v7.4"/><path d="M17.5 15.7V9.5a3 3 0 0 0-3-3h-2.6"/><path d="M14 4.2 11.6 6.5 14 8.8"/>',
 "sandbox": '<rect x="3.5" y="6" width="17" height="14" rx="2" stroke-dasharray="3 2.5"/><path d="M8 6V4.5h8V6"/><path d="M9.5 13.5 12 16l4-4.5"/>',
 "chart": '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M7.5 15.5l3.5-4 3 2.5 4.5-6"/>',
 "network": '<circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="19" r="2.4"/><circle cx="19" cy="19" r="2.4"/><path d="M12 7.4v4.2M12 11.6 6.4 17M12 11.6 17.6 17"/>',
 "globe": '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17z"/>',
 "people": '<path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19"/><circle cx="10" cy="8" r="3.2"/><path d="M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4"/><path d="M15.5 5.2a3.2 3.2 0 0 1 0 5.6"/>',
 "pipeline": '<path d="M3 8h5a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3h5"/><circle cx="3" cy="8" r="1.6"/><circle cx="21" cy="16" r="1.6"/><path d="M11 8h3"/>',
 "meter": '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17 16 11"/><circle cx="12" cy="17" r="1.3"/>',
}

def sprite():
    return ('<svg id="psIconsX" xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">'
            + ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{v}</symbol>' for k, v in ICONS.items())
            + '</svg>')

def ico(name, cls='ii'):
    return f'<svg class="{cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-{name}"/></svg>'

def svg_icon(symbol, x, y, size=26, color=None):
    """Line icons inherit semantic ink; official marks keep a contrasting neutral plate."""
    if symbol.startswith('i-'):
        return (f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="0 0 24 24" '
                f'aria-hidden="true" style="color:{color or "var(--ps-color-ink-2)"}"><use href="#{symbol}"/></svg>')
    light_mark = str(color).lower() in {'white', '#fff', '#ffffff'}
    plate = '#1A1A19' if light_mark else '#FFFFFF'
    fill = f' fill="{color}"' if color else ''
    return (f'<g class="brand-mark" data-ps-brand-mark="{symbol}">'
            f'<rect class="brand-mark__plate" x="{x-4}" y="{y-4}" width="{size+8}" height="{size+8}" rx="6" fill="{plate}"/>'
            f'<svg x="{x}" y="{y}" width="{size}" height="{size}" viewBox="0 0 24 24" aria-hidden="true"{fill}>'
            f'<use href="#{symbol}"/></svg></g>')


CSS = r"""
/* =====================================================================
   VISUAL LAYER v2.7.0: forma, cor, icone, destaque em todo slide
   ===================================================================== */
.ii { width: 22px; height: 22px; display: block; }
/* --- brilho do accent (todo slide de conteudo); sem marca d'agua: o algarismo do capitulo vive so no divider --- */
.slide { position: absolute; }
.deco { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; }
.deco ~ * { position: relative; }
.glow { position: absolute; top: -220px; right: -180px; width: 620px; height: 620px; border-radius: 50%; background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 16%, transparent), transparent 72%); pointer-events: none; }
.slide[data-active="true"] .glow { animation: glowIn 1.2s var(--ps-ease) both; }
@keyframes glowIn { from { opacity: 0; transform: scale(.8); } to { opacity: 1; transform: scale(1); } }
.eyebrow::before { content: ''; display: inline-block; width: 9px; height: 9px; border-radius: 2px; background: var(--accent); margin-right: 10px; vertical-align: 1px; }
/* --- ledger: fileira numerada com icone --- */
.ledg { display: grid; gap: 8px; margin-top: 20px; position: relative; }
.lr { display: grid; grid-template-columns: 64px 46px minmax(0, 1fr); gap: 16px; align-items: center; padding: 9px 16px 9px 10px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); position: relative; overflow: hidden; }
.lr::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 5px; background: var(--c); }
.lr__n { font-family: var(--ps-font-mono); font-size: 30px; font-weight: 700; color: var(--c); letter-spacing: -.04em; line-height: 1; text-align: center; }
.lr__i { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: color-mix(in srgb, var(--c) 14%, transparent); color: var(--c); }
.lr__i .ii { width: 22px; height: 22px; }
.lr__k { font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--c); margin-bottom: 3px; }
.lr__t { font-size: 13.5px; line-height: 1.5; color: var(--ps-color-ink-2); }
.lr__t b { color: var(--ps-color-ink); font-weight: 600; }
.lr__t b.mono { font-family: var(--ps-font-mono); font-weight: 500; font-size: 12px; }
.lr__t .pill { vertical-align: 1px; }
.slide[data-active="true"] .ledg .lr { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 90ms) both; }
/* --- kpi tiles: numero grande --- */
.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-top: 24px; }
.kpi { position: relative; padding: 20px 20px 18px; border-radius: 10px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-top: 5px solid var(--c); overflow: hidden; }
.kpi__v { font-family: var(--ps-font-mono); font-size: 44px; font-weight: 700; color: var(--c); line-height: 1; letter-spacing: -.04em; margin-bottom: 10px; }
.kpi__k { font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ps-color-ink-3); margin-bottom: 8px; }
.kpi__t { font-size: 12.5px; line-height: 1.5; color: var(--ps-color-ink-2); }
.kpi__t b { color: var(--ps-color-ink); font-weight: 600; }
.slide[data-active="true"] .kpi { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 110ms) both; }
.slide[data-active="true"] .kpi__v { animation: popIn .6s var(--ps-ease) calc(350ms + var(--i, 0) * 110ms) both; }
@keyframes popIn { from { opacity: 0; transform: scale(.6); } 60% { transform: scale(1.08); } to { opacity: 1; transform: scale(1); } }
/* --- tiles: cartoes com faixa colorida, icone e numeral marca d'agua --- */
.tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 22px; }
.tiles--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.tiles--3 .tile__n { font-size: 34px; top: 10px; right: 12px; }
.tiles--3 .tile__h { padding-right: 56px; }
.tile { position: relative; overflow: hidden; border-radius: 10px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); }
.tile__h { display: flex; align-items: center; gap: 12px; padding: 12px 18px; background: color-mix(in srgb, var(--c) 12%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--c) 30%, transparent); }
.tile__h .ii { width: 22px; height: 22px; color: var(--c); flex: 0 0 auto; }
.tile__t { font-size: 17px; font-weight: 600; color: var(--ps-color-ink); line-height: 1.25; }
.tile__b { padding: 14px 18px 16px; font-size: 14px; line-height: 1.55; color: var(--ps-color-ink-2); }
.tile__n { position: absolute; right: 14px; top: 2px; font-family: var(--ps-font-mono); font-size: 54px; font-weight: 700; color: var(--c); opacity: .14; line-height: 1; letter-spacing: -.05em; }
.tile__f { display: inline-block; margin: 0 18px 16px; padding: 4px 10px; border-radius: 999px; font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .06em; background: color-mix(in srgb, var(--ps-color-ms-red-500) 12%, transparent); color: var(--ps-text-red); }
.slide[data-active="true"] .tile { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 110ms) both; }
/* variante story: numeral grande a esquerda */
.tiles--story .tile { display: grid; grid-template-columns: 76px minmax(0, 1fr); }
.tiles--story .tile__h { flex-direction: column; justify-content: center; gap: 8px; padding: 14px 8px; border-bottom: 0; border-right: 1px solid color-mix(in srgb, var(--c) 30%, transparent); }
.tiles--story .tile__h .ii { width: 24px; height: 24px; }
.tiles--story .tile__n { position: static; opacity: 1; font-size: 26px; }
.tiles--story .tile__t { padding: 14px 18px 0; }
.tiles--story .tile__b { padding-top: 8px; }
/* --- timeline em duas fileiras --- */
.tline { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 14px 0; margin-top: 26px; }
.tline--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 34px 0; }
.tline--3 .tl:nth-child(3n)::before { right: 14px; }
.tl { position: relative; padding: 26px 14px 0 0; }
.tl::before { content: ''; position: absolute; left: 0; right: 0; top: 7px; height: 2px; background: var(--ps-color-rule-2); }
.tl:nth-child(6n)::before { right: 14px; }
.tl::after { content: ''; position: absolute; left: 0; top: 0; width: 16px; height: 16px; border-radius: 50%; background: var(--c); box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 22%, transparent); }
.tl__d { font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--tc,var(--ps-color-ink)); margin-bottom: 6px; }
.tl__t { font-size: 13px; font-weight: 600; line-height: 1.35; color: var(--ps-color-ink); margin-bottom: 6px; }
.tl__w { font-size: 11.5px; line-height: 1.45; color: var(--ps-color-ink-3); }
.slide[data-active="true"] .tl { animation: fadeUp .5s var(--ps-ease) calc(200ms + var(--i, 0) * 80ms) both; }
.slide[data-active="true"] .tl::after { animation: popIn .5s var(--ps-ease) calc(300ms + var(--i, 0) * 80ms) both; }
/* --- tabelas: primeira coluna em chip, zebra, pills --- */
.dt tbody td:first-child { font-family: var(--ps-font-mono); font-weight: 600; color: var(--ps-color-ink); white-space: nowrap; }
.dt tbody tr:nth-child(even) td { background: color-mix(in srgb, var(--accent) 5%, transparent); }
.dt th { color: var(--ps-color-ink-2); }
.pill { display: inline-block; padding: 2px 9px; border-radius: 999px; font-family: var(--ps-font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: .04em; white-space: nowrap; }
.pill--red { background: color-mix(in srgb, var(--ps-color-ms-red-500) 16%, transparent); color: var(--ps-text-red); }
.pill--gray { background: color-mix(in srgb, var(--ps-color-ink-3) 14%, transparent); color: var(--ps-color-ink-2); }
.pill--green { background: color-mix(in srgb, var(--ps-color-ms-green-500) 18%, transparent); color: var(--ps-text-green); }
.dt .yes, .dt .no { display: inline-flex; width: 26px; height: 26px; border-radius: 50%; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
.dt .yes { background: color-mix(in srgb, var(--ps-color-ms-green-500) 20%, transparent); color: var(--ps-text-green); }
.dt .no { background: color-mix(in srgb, var(--ps-color-ms-red-500) 14%, transparent); color: var(--ps-text-red); }
/* --- glossario: numeral e borda superior --- */
.gterm { position: relative; border-top: 4px solid var(--accent) !important; overflow: hidden; }
.gterm::after { content: attr(data-n); position: absolute; right: 10px; top: 4px; font-family: var(--ps-font-mono); font-size: 26px; font-weight: 700; color: var(--accent); opacity: .18; line-height: 1; }
/* --- compare: barra colorida e badge vs --- */
.cmp { position: relative; }
.cmp > .card--bar { border-top: 5px solid var(--accent) !important; border-radius: 8px; }
.cmp::after { content: 'vs'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: var(--ps-color-ink); color: #fff; font-family: var(--ps-font-mono); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px var(--ps-color-bg); }
/* --- escada (railstep) --- */
.rail .railstep:nth-child(1) { margin-top: 48px; }
.rail .railstep:nth-child(2) { margin-top: 32px; }
.rail .railstep:nth-child(3) { margin-top: 16px; }
.rail .railstep:nth-child(4) { margin-top: 0; }
.railstep .rdot { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 22%, transparent); }
/* --- cards genericos ganham cor no topo --- */
.card { border-top: 4px solid var(--accent); }
.grid-3 .card:nth-child(2), .grid-lead .card:nth-child(2) { --accent: var(--ps-color-ms-green-500); }
.grid-3 .card:nth-child(3), .grid-lead .card:nth-child(3) { --accent: var(--ps-color-ms-yellow-500); }
/* --- watch: icone --- */
.watch b::before { content: '!'; display: inline-flex; width: 16px; height: 16px; border-radius: 50%; background: var(--ps-color-ms-yellow-500); color: #1A1A1A; align-items: center; justify-content: center; font-size: 10px; margin-right: 8px; letter-spacing: 0; }
/* --- cenas animadas --- */
.scene { margin-top: 12px; }
.scn { width: 100%; height: auto; display: block; overflow: visible; font-family: var(--ps-font-sans); }
.scn text { fill: var(--ps-color-ink); }
.scn .m { font-family: var(--ps-font-mono); font-size: 11px; fill: var(--ps-color-ink-2); }
.scn .m--b { font-size: 12px; font-weight: 700; }
.scn .lbl { font-size: 13px; font-weight: 600; }
.scn .box { fill: var(--ps-color-paper); stroke: var(--ps-color-rule-2); stroke-width: 1.2; }
.scn .ln { fill: none; stroke: var(--ps-color-ink-3); stroke-width: 1.6; }
.scene__caps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin-top: 14px; }
.cap { padding: 12px 16px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-left: 5px solid var(--c); }
.cap b { display: block; font-size: 14px; font-weight: 600; color: var(--ps-color-ink); margin-bottom: 4px; }
.cap span { font-size: 12.5px; line-height: 1.5; color: var(--ps-color-ink-2); }
.slide[data-active="true"] .cap { animation: fadeUp .5s var(--ps-ease) calc(1200ms + var(--i, 0) * 160ms) both; }
/* animation primitives (armed by data-active) */
.scn .a-in, .scn .a-pop, .scn .a-draw, .scn .a-pulse, .scn .a-slide, .scn .a-type, .scn .a-flash, .scn .a-shake, .scn .a-flip, .scn .a-rise { opacity: 0; }
.slide[data-active="true"] .scn .a-in { animation: fadeUp .6s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
.slide[data-active="true"] .scn .a-pop { animation: popIn .6s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; transform-box: fill-box; transform-origin: center; }
.slide[data-active="true"] .scn .a-draw { opacity: 1; stroke-dasharray: 100; stroke-dashoffset: 100; animation: dgDraw .8s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) forwards; }
.slide[data-active="true"] .scn .a-pulse { opacity: 1; animation: scPulse 1.6s ease-in-out calc(200ms + var(--d, 0) * 1ms) infinite; transform-box: fill-box; transform-origin: center; }
@keyframes scPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: .75; } }
.slide[data-active="true"] .scn .a-slide { animation: scSlide 1.4s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes scSlide { from { opacity: 0; transform: translateX(-80px); } 30% { opacity: 1; } to { opacity: 1; transform: translateX(0); } }
.slide[data-active="true"] .scn .a-type { opacity: 1; transform-box: fill-box; transform-origin: left center; animation: scType .5s steps(6) calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes scType { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.slide[data-active="true"] .scn .a-flash { opacity: 1; animation: scFlash 1s ease calc(200ms + var(--d, 0) * 1ms) 1 both; }
@keyframes scFlash { 0% { opacity: 0; } 40% { opacity: 1; } 60% { opacity: .4; } 100% { opacity: 1; } }
.slide[data-active="true"] .scn .a-shake { opacity: 1; transform-box: fill-box; transform-origin: center; animation: scShake .6s ease calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes scShake { 0%, 100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
.slide[data-active="true"] .scn .a-flip { opacity: 1; animation: scFlip .7s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes scFlip { from { transform: translateX(0); } to { transform: translateX(-22px); } }
.slide[data-active="true"] .scn .a-rise { animation: scRise .7s var(--ps-ease) calc(200ms + var(--d, 0) * 1ms) both; }
@keyframes scRise { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.slide[data-active="true"] .scn .a-travel { offset-rotate: 0deg; animation: scTravel 4s linear calc(1800ms + var(--d, 0) * 1ms) infinite; }
@media (prefers-reduced-motion: reduce) { .scn * { animation: none !important; opacity: 1 !important; } }
"""
