<script>
/* PS-RUNTIME v3.0.0: typing simulations, interactives and a markdown renderer.
   Self-contained: watches data-active on every .slide, needs no engine hook. */
(function () {
  // ---------- activation observer ----------
  const onActive = [], onInactive = [], langRepaint = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mo = new MutationObserver(ms => ms.forEach(m => {
    const s = m.target; if (!s.classList.contains('slide')) return;
    (s.getAttribute('data-active') === 'true' ? onActive : onInactive).forEach(fn => fn(s));
  }));
  document.querySelectorAll('.slide').forEach(s => mo.observe(s, { attributes: true, attributeFilter: ['data-active'] }));

  // ---------- typing simulation: <pre data-type="line1\nline2" data-speed="18"> ----------
  const timers = new WeakMap();
  function esc(t) { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function colorize(line) {
    // $ prompt, > agent, # comment, ✓ ok, ✕ error, ⚠ warning
    let h = esc(line);
    if (/^\$ /.test(line)) h = '<span class="p">$</span> <span class="b">' + esc(line.slice(2)) + '</span>';
    else if (/^# /.test(line)) h = '<span class="d">' + h + '</span>';
    else if (/^> /.test(line)) h = '<span class="c">&gt;</span> ' + esc(line.slice(2));
    else if (/^✓/.test(line)) h = '<span class="p">' + h + '</span>';
    else if (/^✕/.test(line)) h = '<span class="e">' + h + '</span>';
    else if (/^⚠/.test(line)) h = '<span class="w">' + h + '</span>';
    return h;
  }
  function typeInto(pre) {
    stop(pre);
    const lines = (tr(pre, 'type') || '').split('\n'); const speed = +(pre.dataset.speed || 16);
    if (reducedMotion.matches) {
      pre.innerHTML = lines.map(colorize).join('\n');
      pre.scrollTop = 0;
      return;
    }
    pre.innerHTML = ''; let li = 0, ci = 0; const cur = document.createElement('span'); cur.className = 'cur';
    const out = document.createElement('span'); pre.appendChild(out); pre.appendChild(cur);
    let buf = '';
    function step() {
      if (li >= lines.length) { cur.remove(); return; }
      const line = lines[li]; const typed = /^(\$|>) /.test(line);   // prompts and user input are typed, output is printed
      if (!typed) { buf += colorize(line) + '\n'; out.innerHTML = buf; li++; pre.scrollTop = pre.scrollHeight; timers.set(pre, setTimeout(step, /^\s*$/.test(line) ? 120 : 260)); return; }
      if (ci <= line.length) { out.innerHTML = buf + colorize(line.slice(0, ci)); ci++; pre.scrollTop = pre.scrollHeight; timers.set(pre, setTimeout(step, speed)); return; }
      buf += colorize(line) + '\n'; out.innerHTML = buf; li++; ci = 0; timers.set(pre, setTimeout(step, 420));
    }
    timers.set(pre, setTimeout(step, 500));
  }
  function stop(pre) { const t = timers.get(pre); if (t) clearTimeout(t); timers.delete(pre); }
  onActive.push(s => s.querySelectorAll('[data-type]').forEach(typeInto));
  onInactive.push(s => s.querySelectorAll('[data-type]').forEach(p => { stop(p); p.innerHTML = ''; }));
  reducedMotion.addEventListener('change', () => {
    document.querySelectorAll('.slide[data-active="true"] [data-type]').forEach(typeInto);
  });
  langRepaint.push(() => document.querySelectorAll('.slide[data-active="true"] [data-type]').forEach(typeInto));

  // ---------- i18n for attributes: data-x="English" plus data-x-k="i18n.key" resolves through the deck's I18N ----------
  function tr(el, name) {
    const k = el.dataset[name + 'K'];
    if (k && window.I18N) { const L = window.I18N[document.documentElement.lang] || window.I18N.en; const v = k.split('.').reduce((o, p) => (o ? o[p] : undefined), L); if (v !== undefined) return v; }
    return el.dataset[name];
  }
  function retranslate(el) {
    if (!window.I18N) return;
    const L = window.I18N[document.documentElement.lang] || window.I18N.en;
    el.querySelectorAll('[data-i18n]').forEach(e => {
      const v = e.dataset.i18n.split('.').reduce((o, p) => (o ? o[p] : undefined), L);
      if (typeof v === 'string') { if (/<[a-z]/i.test(v)) e.innerHTML = v; else e.textContent = v; }
    });
  }
  // ---------- quiz: .quiz [data-correct] buttons, .ipanel output ----------
  document.querySelectorAll('.quiz').forEach(q => {
    const panel = q.querySelector('.ipanel'); const empty = panel.innerHTML;
    q.querySelectorAll('.ibtn').forEach(b => b.addEventListener('click', () => {
      q.querySelectorAll('.ibtn').forEach(x => { x.classList.remove('ok', 'bad'); x.setAttribute('aria-pressed', 'false'); });
      const ok = b.dataset.correct === '1'; b.classList.add(ok ? 'ok' : 'bad'); b.setAttribute('aria-pressed', 'true');
      if (!ok) q.querySelector('[data-correct="1"]').classList.add('ok');
      panel.innerHTML = '<div class="ipanel__k">' + (ok ? tr(panel, 'okk') : tr(panel, 'badk')) + '</div><div class="ipanel__v" style="color:' + (ok ? 'var(--ps-text-green)' : 'var(--ps-text-red)') + '">' + (ok ? tr(panel, 'okv') : tr(panel, 'badv')) + '</div><div class="ipanel__t">' + tr(b, 'why') + '</div>';
    }));
    onInactive.push(s => { if (s.contains(q)) { panel.innerHTML = empty; retranslate(panel); q.querySelectorAll('.ibtn').forEach(x => { x.classList.remove('ok', 'bad'); x.setAttribute('aria-pressed', 'false'); }); } });
    langRepaint.push(() => {
      const selected = q.querySelector('.ibtn[aria-pressed="true"]');
      if (selected) selected.click();
      else retranslate(panel);
    });
  });

  // ---------- assessment: .assess with .aq rows (yes/no), ladder levels ----------
  document.querySelectorAll('.assess').forEach(a => {
    const rows = [...a.querySelectorAll('.aq')]; const ladder = [...a.querySelectorAll('.ladder div')]; const panel = a.querySelector('.ipanel'); const empty = panel.innerHTML;
    function update() {
      const answered = rows.filter(r => r.dataset.v); const yes = rows.filter(r => r.dataset.v === 'y').length;
      ladder.forEach((l, i) => l.classList.toggle('on', i === yes));
      if (!answered.length) { panel.innerHTML = empty; retranslate(panel); return; }
      const firstNo = rows.find(r => r.dataset.v === 'n');
      panel.innerHTML = '<div class="ipanel__k">' + tr(panel, 'k') + ' · ' + answered.length + ' / ' + rows.length + '</div><div class="ipanel__v">' + (ladder[yes] ? tr(ladder[yes], 'name') : '') + '</div><div class="ipanel__t">' + (firstNo ? tr(panel, 'next') + ' <b>' + tr(firstNo, 'next') + '</b>' : tr(panel, 'top')) + '</div>';
    }
    rows.forEach(r => r.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { r.dataset.v = b.dataset.v; r.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false')); update(); })));
    onInactive.push(s => { if (s.contains(a)) { rows.forEach(r => { delete r.dataset.v; r.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); }); update(); } });
  });

  // ---------- calculator: inputs[type=range] with data-out, formula in data-formula (JS expression over ids) ----------
  document.querySelectorAll('.calc').forEach(c => {
    const ins = [...c.querySelectorAll('input[type=range]')]; const big = c.querySelector('.calc__big'); const f = c.dataset.formula;
    function run() {
      const v = {}; ins.forEach(i => { v[i.id] = +i.value; const o = c.querySelector('output[for="' + i.id + '"]'); if (o) o.textContent = i.value + (i.dataset.unit || ''); });
      try { const r = Function('v', 'with(v){return ' + f + '}')(v); big.firstChild.nodeValue = (typeof r === 'number' ? (Number.isInteger(r) ? r : r.toFixed(1)) : r); } catch (e) {}
      c.querySelectorAll('[data-expr]').forEach(el => { try { el.textContent = Function('v', 'with(v){return ' + el.dataset.expr + '}')(v); } catch (e) {} });
    }
    ins.forEach(i => i.addEventListener('input', run)); run();
  });

  // ---------- toggle compare ----------
  document.querySelectorAll('.toggle').forEach(t => {
    const btns = [...t.querySelectorAll('.toggle__sw button')]; const panels = [...t.querySelectorAll('.toggle__p')];
    btns.forEach((b, i) => b.addEventListener('click', () => { btns.forEach((x, j) => x.setAttribute('aria-pressed', j === i ? 'true' : 'false')); panels.forEach((p, j) => { p.classList.toggle('on', j === i); p.setAttribute('aria-hidden', j === i ? 'false' : 'true'); }); }));
  });
  // ---------- tabs ----------
  document.querySelectorAll('.tabs').forEach(t => {
    const btns = [...t.querySelectorAll('.tabs__bar button')]; const panels = [...t.querySelectorAll('.tabs__p')];
    const initial = btns.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const empty = t.querySelector('.tabs__empty');
    function select(i) {
      btns.forEach((b, j) => { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === (i < 0 ? 0 : i) ? 0 : -1; });
      panels.forEach((p, j) => { p.classList.toggle('on', j === i); p.setAttribute('aria-hidden', j === i ? 'false' : 'true'); });
      if (empty) empty.hidden = i >= 0;
    }
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(i));
      b.addEventListener('keydown', e => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
        e.preventDefault(); e.stopPropagation();
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 :
          (i + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
        select(next); btns[next].focus();
      });
    });
    onInactive.push(s => { if (s.contains(t)) select(initial); });
  });
  // ---------- hotspots ----------
  document.querySelectorAll('.hot').forEach(h => {
    const pts = [...h.querySelectorAll('.hot__pt')]; const tips = [...h.querySelectorAll('.hot__tip')];
    pts.forEach((p, i) => p.addEventListener('click', () => { const open = !tips[i].classList.contains('on'); tips.forEach((t, j) => { t.classList.toggle('on', j === i && open); pts[j].setAttribute('aria-expanded', j === i && open ? 'true' : 'false'); }); }));
    onInactive.push(s => { if (s.contains(h)) { tips.forEach(t => t.classList.remove('on')); pts.forEach(p => p.setAttribute('aria-expanded', 'false')); } });
  });
  // ---------- poll ----------
  document.querySelectorAll('.poll').forEach(p => {
    const opts = [...p.querySelectorAll('.poll__o')]; const votes = opts.map(() => 0);
    function paint() { const tot = votes.reduce((a, b) => a + b, 0) || 1; opts.forEach((o, i) => { o.querySelector('.poll__f').style.width = Math.round(votes[i] / tot * 100) + '%'; o.querySelector('.poll__v').textContent = Math.round(votes[i] / tot * 100) + '%'; }); }
    opts.forEach((o, i) => o.addEventListener('click', () => { votes[i]++; paint(); }));
    onInactive.push(s => { if (s.contains(p)) { votes.fill(0); opts.forEach(o => { o.querySelector('.poll__f').style.width = '0'; o.querySelector('.poll__v').textContent = ''; }); } });
  });

  // ---------- chain simulator: .csim, the call walks a visible chain of controls ----------
  document.querySelectorAll('.csim').forEach(sim => {
    let data; try { data = JSON.parse(sim.querySelector('.csim__data').textContent); } catch (e) { return; }
    const sel = {};
    const word = k => { const e = sim.querySelector('.csim__pool [data-fk="' + k + '"]'); return e ? e.textContent : ''; };
    const stages = [...sim.querySelectorAll('.csim__st')];
    const arrows = [...sim.querySelectorAll('.csim__ar')];
    const out = sim.querySelector('.csim__out');
    const verdict = sim.querySelector('.csim__verdict');
    const why = sim.querySelector('.csim__why');
    function paint() {
      const off = (data.off || {})[sel.c] || [];
      const row = data.m[(sel.t || '') + (sel.c || '')];
      arrows.forEach(a => a.dataset.on = row && (arrows.indexOf(a) + 1) < row.stop ? '1' : '');
      stages.forEach((st, i) => {
        const n = i + 1, b = st.querySelector('.csim__badge');
        if (off.indexOf(n) >= 0) { st.dataset.state = 'off'; b.textContent = word('s_off'); return; }
        if (!row) { st.dataset.state = ''; b.textContent = ''; return; }
        if (n < row.stop) { st.dataset.state = 'pass'; b.textContent = word('s_pass'); }
        else if (n === row.stop) { st.dataset.state = row.v; b.textContent = n === stages.length ? word('s_run') : word('v_' + row.v); }
        else { st.dataset.state = 'skip'; b.textContent = word('s_skip'); }
      });
      out.dataset.v = row ? row.v : '';
      verdict.textContent = row ? word('v_' + row.v) : '·';
      why.textContent = row ? word(row.why) : word('empty');
    }
    sim.querySelectorAll('.csim__o').forEach(b => b.addEventListener('click', () => {
      const box = b.closest('.csim__opts'); sel[box.dataset.k] = b.dataset.v;
      box.querySelectorAll('.csim__o').forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      paint();
    }));
    onInactive.push(s => { if (!s.contains(sim)) return; sel.t = null; sel.c = null; sim.querySelectorAll('.csim__o').forEach(x => x.setAttribute('aria-pressed', 'false')); paint(); });
    langRepaint.push(paint);
    paint();
  });
  if (langRepaint.length) new MutationObserver(() => langRepaint.forEach(f => f()))
    .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // ---------- markdown: <script type="text/markdown" class="mdsrc"> rendered into the next .md ----------
  function md(src) {
    const lines = src.replace(/\r/g, '').split('\n'); let out = '', inCode = false, inList = false, inTable = false;
    const inl = t => esc(t).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    const closeList = () => { if (inList) { out += '</ul>'; inList = false; } };
    const closeTable = () => { if (inTable) { out += '</table>'; inTable = false; } };
    for (const raw of lines) {
      if (/^```/.test(raw)) { closeList(); closeTable(); inCode = !inCode; out += inCode ? '<pre>' : '</pre>'; continue; }
      if (inCode) { out += esc(raw) + '\n'; continue; }
      if (/^\|/.test(raw)) { if (/^\|\s*-/.test(raw)) continue; const cells = raw.split('|').slice(1, -1); if (!inTable) { inTable = true; out += '<table><tr>' + cells.map(c => '<th>' + inl(c.trim()) + '</th>').join('') + '</tr>'; } else out += '<tr>' + cells.map(c => '<td>' + inl(c.trim()) + '</td>').join('') + '</tr>'; continue; }
      closeTable();
      const h = /^(#{1,4}) (.*)/.exec(raw); if (h) { closeList(); out += '<h' + (h[1].length + 2) + '>' + inl(h[2]) + '</h' + (h[1].length + 2) + '>'; continue; }
      if (/^[-*] /.test(raw)) { if (!inList) { out += '<ul>'; inList = true; } out += '<li>' + inl(raw.slice(2)) + '</li>'; continue; }
      if (/^> /.test(raw)) { closeList(); out += '<blockquote>' + inl(raw.slice(2)) + '</blockquote>'; continue; }
      if (!raw.trim()) { closeList(); continue; }
      closeList(); out += '<p>' + inl(raw) + '</p>';
    }
    closeList(); closeTable(); return out;
  }
  document.querySelectorAll('script.mdsrc').forEach(s => { const t = s.nextElementSibling; if (t && t.classList.contains('md')) t.innerHTML = md(s.textContent); });
  window.psMarkdown = md;
})();
</script>
