<style>
/* ---- layout v2.6.0: canvas cheio, sem quebra no meio da palavra ---- */
.wingrid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
.slide *:not(pre):not(code):not(.code-block *):not(.gterm *):not(.ig *):not(.lku):not(.brk):not(.brk *):not(.wrap):not(.wrap *) { overflow-wrap: normal !important; word-break: normal !important; hyphens: manual !important; }
.lku, .brk { overflow-wrap: anywhere !important; word-break: break-all !important; }
/* .wrap: text that may break inside a long token, for narrow columns of technical prose */
.slide .wrap, .slide .wrap * { overflow-wrap: break-word !important; }
.slide--airy .win { min-height: 0 !important; }
.simout { grid-template-columns: 1fr !important; }
.sim { grid-template-columns: 440px 1fr !important; }
.segbtn { font-size: 12px !important; padding: 10px 8px !important; }
#plCon { flex-direction: column; align-items: stretch; }
.ag { grid-template-columns: 122px 1fr auto minmax(22px, auto) !important; }
.ag__go { width: auto; min-width: 18px; text-align: center; }
.simcard { min-height: 210px; border-top: 5px solid var(--accent); }
.simcard .sv { font-size: 34px !important; }
.simbar .sbt { height: 16px !important; border-radius: 8px; }
.simbars { border-left: 5px solid var(--accent); }
</style>
<style>.slide.ps-measure, .slide.ps-measure *, .slide.ps-measure *::before, .slide.ps-measure *::after { animation: none !important; transition: none !important; }</style>
<script>
/* PS-FILL v3.0.0: cada slide de conteudo cresce (tipo, padding, gap) ate ocupar o palco 1280x720,
   sem estourar na vertical nem na horizontal. Roda no goToSlide, no setLocale e em fonts.ready. */
(function () {
  const STAGE_H = 720, K_MAX = 1.85, STEP = 0.03;
  const CAP = '.code-block, pre, .term, .codewin, .diff, .vsc, .chatwin, .portal, .ghpr, .browser, .phone';   /* code and product mocks grow at most 18% */
  const SKIP = 'svg, .eyerow, .eyebrow, .title, .section-title, .subtitle, .kbd-hint, .deck-brand, .lang-switcher, .notes-panel, .wm, .glow, .deco';
  function prep(slide) {
    const els = [];
    slide.querySelectorAll('*').forEach(e => {
      if (e.closest(SKIP)) return;
      if (!e.dataset.psfs) {
        const cs = getComputedStyle(e);
        e.dataset.psfs = parseFloat(cs.fontSize) || 0;
        e.dataset.pspad = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(parseFloat).join(' ');
        e.dataset.psgap = (cs.display.indexOf('grid') >= 0 || cs.display.indexOf('flex') >= 0) ? [parseFloat(cs.rowGap) || 0, parseFloat(cs.columnGap) || 0].join(' ') : '';
        e.dataset.psmt = parseFloat(cs.marginTop) || 0;
      }
      els.push(e);
    });
    return els;
  }
  function apply(els, k) {
    els.forEach(e => {
      const kk = e.closest(CAP) ? Math.min(k, 1.18) : k;
      const fs = parseFloat(e.dataset.psfs);
      if (fs) e.style.fontSize = (fs * kk).toFixed(2) + 'px';
      const p = e.dataset.pspad.split(' ').map(Number);
      if (p.some(v => v > 0)) e.style.padding = p.map(v => (v * kk).toFixed(1) + 'px').join(' ');
      if (e.dataset.psgap) { const g = e.dataset.psgap.split(' ').map(Number); if (g[0] || g[1]) e.style.gap = (g[0] * kk).toFixed(1) + 'px ' + (g[1] * kk).toFixed(1) + 'px'; }
      const mt = parseFloat(e.dataset.psmt); if (mt > 8) e.style.marginTop = (mt * kk).toFixed(1) + 'px';
    });
  }
  function fits(slide, els) {
    if (window.relaxNbsp) try { relaxNbsp(slide); } catch (e) {}
    if (slide.scrollHeight > STAGE_H + 1) { slide.dataset.psfail = 'sh ' + slide.scrollHeight; return false; }
    const R = slide.getBoundingClientRect();
    for (const e of els) {
      if (e.closest('.code-block, pre, .term, .codewin, .diff, .gantt__t, [data-nofit]')) continue;
      if (e.scrollWidth > e.clientWidth + 3 && getComputedStyle(e).overflowX !== 'auto') { slide.dataset.psfail = 'sw ' + e.className + ' ' + (e.textContent || '').trim().slice(0, 30); return false; }
      const r = e.getBoundingClientRect();
      if (r.width && (r.right > R.right - 40 + 1 || r.bottom > R.bottom + 1)) { slide.dataset.psfail = 'rect ' + e.tagName + '.' + e.className + ' r=' + Math.round(r.right) + ' b=' + Math.round(r.bottom); return false; }
    }
    return true;
  }
  window.fillCanvas = function (slide) {
    slide = slide || document.querySelector('.slide[data-active="true"]');
    if (!slide || slide.classList.contains('cover2') || slide.classList.contains('who') || slide.querySelector('.section-number, .section-title') || slide.dataset.nofill) return;
    slide.classList.add('ps-measure');
    const els = prep(slide);
    let best = 1;
    apply(els, 1);
    if (!fits(slide, els)) {
      // base does not fit: shrink gently until it does (never below 0.84)
      let k = 1;
      while (k > 0.84 && !fits(slide, els)) { k -= 0.02; apply(els, k); }
      slide.dataset.psk = k.toFixed(2); slide.classList.remove('ps-measure'); return;
    }
    for (let k = 1 + STEP; k <= K_MAX + 1e-6; k += STEP) {
      apply(els, k);
      if (fits(slide, els)) best = k; else break;
    }
    apply(els, best);
    slide.dataset.psk = best.toFixed(2);
    slide.classList.remove('ps-measure');
  };
  const _go = window.goToSlide;
  window.goToSlide = function (i) { _go(i); requestAnimationFrame(() => fillCanvas()); };
  const _sl = window.setLocale;
  window.setLocale = function (l) { _sl(l); requestAnimationFrame(() => fillCanvas()); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fillCanvas());
  requestAnimationFrame(() => fillCanvas());
})();
</script>
