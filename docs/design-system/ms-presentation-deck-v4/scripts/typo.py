"""typo v3.0.0: title and subtitle typography rules that every deck must follow.

1. Divider title fits in ONE line. Base 60px, shrinks per locale down to 41px; only if even that
   does not fit it falls back to two balanced lines at 48px.
2. Content title: base 56px. Tries one line down to 46px; otherwise two balanced lines at 56px.
3. No orphans, no lost breaks: function words (o, a, de, um, the, and, los, del ...) glue to the next
   word with NBSP and the last two words of a title or subtitle are glued. relaxNbsp() releases the
   glue if a chain ever overflows its box, so this never creates a horizontal overflow.
4. Build-time: the greedy NBSP chains from older decks (3 or 4 last words glued) are normalized to
   plain spaces, because a glued block wider than half the line produces exactly the broken
   "Faça o / agente terminar o trabalho." shape. The runtime rule above replaces them.

Usage in a build:  html = normalize_nbsp(html);  html = inject(html)
"""
import json
import re

FUNCTION_WORDS = frozenset("""
a an and are as at be but by do for from he if in is it no nor not of on or so the to we
o os e de da das dos em na nas no nos um uma uns umas ao aos à às com por sem se que
el la las los lo le les del al un una en y con sin su sus ni
""".split())


def is_function_word(word):
    return word.lstrip('¿¡("\'“').lower() in FUNCTION_WORDS

CSS = r"""
/* --- tipografia v3: divider em uma linha, titulo de conteudo em uma linha quando couber, sem orfas --- */
.section-title { font-size: 60px; line-height: 1.04; letter-spacing: -.03em; max-width: none; white-space: nowrap; margin: 0 0 18px; }
.section-number ~ .section-title { margin-top: 0; }
.section-number--bars { margin-bottom: 42px; }
.section-number ~ .subtitle, .slide--dark .section-title + .subtitle { font-size: 22px; line-height: 1.42; max-width: 1120px; }
.section-title[data-fitlines] { white-space: normal; }
.section-title[data-fitlines] span { display: block; white-space: nowrap; }
.title { font-size: 56px; line-height: 1.08; letter-spacing: -.025em; max-width: none; }
.title.title--medium { font-size: 40px; }
.title.title--small { font-size: 32px; }
.subtitle { max-width: none; font-size: 20px; }
.slide p, .slide li, .slide dd, .slide td, .slide figcaption, .subtitle, .lead, .tile__p, .lr__d, .why__p, .kpi__d, .card p { text-wrap: pretty; }
.title, .section-title, .tile__t, .kpi__l, .lr__t, .slide h2, .slide h3, .card h3 { text-wrap: balance; }
"""

JS = r"""
/* PS-TYPO v3: titulos em uma linha, sem orfas, sem quebra perdida. */
(function () {
  var SMALL = __PS_FUNCTION_WORDS__;
  var NB = String.fromCharCode(160);
  function isFn(w) { return !!SMALL[w.replace(/^[¿¡("'“]+/, '').toLowerCase()]; }
  function glueNode(node) {
    var parts = node.nodeValue.replace(/\u00a0/g, ' ').split(' ');
    if (parts.length < 2) return;
    var out = parts[0];
    for (var i = 1; i < parts.length; i++) {
      var prev = parts[i - 1], cur = parts[i];
      out += (prev && cur && isFn(prev) ? NB : ' ') + cur;
    }
    node.nodeValue = out;
  }
  function textNodes(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, a = [];
    while ((n = w.nextNode())) { if (n.parentElement && n.parentElement.closest('pre, code, svg, .gterm, .code-block')) continue; if (/\S/.test(n.nodeValue)) a.push(n); }
    return a;
  }
  function glue(el) {
    var nodes = textNodes(el); if (!nodes.length) return;
    var words = 0; nodes.forEach(function (n) { words += n.nodeValue.trim().split(/\s+/).length; });
    nodes.forEach(glueNode);
    if (words < 3) return;
    for (var i = nodes.length - 1; i >= 0; i--) {
      var v = nodes[i].nodeValue, m = v.replace(/\s+$/, ''), j = m.lastIndexOf(' ');
      if (j > 0) { nodes[i].nodeValue = m.slice(0, j) + NB + m.slice(j + 1) + v.slice(m.length); return; }
      if (m.indexOf(NB) >= 0) return;
    }
  }
  function fitOne(el, minRatio, twoLineScale) {
    el.style.fontSize = ''; el.style.whiteSpace = 'nowrap';
    var base = parseFloat(getComputedStyle(el).fontSize) || 0, W = el.clientWidth;
    if (!base || !W) { el.style.whiteSpace = ''; return; }
    var min = Math.max(Math.round(base * minRatio), Math.min(28, base));
    if (el.scrollWidth <= W + 1) return;
    var size = Math.max(min, Math.floor(base * W / el.scrollWidth));
    el.style.fontSize = size + 'px';
    var g = 0;
    while (el.scrollWidth > W + 1 && size > min && g++ < 40) { size -= 1; el.style.fontSize = size + 'px'; }
    if (el.scrollWidth > W + 1) { el.style.whiteSpace = ''; el.style.fontSize = twoLineScale ? Math.round(base * twoLineScale) + 'px' : ''; }
  }
  function skip(el) { return el.closest('.cover2') || el.hasAttribute('data-fitlines') || el.closest('[data-fitlines]'); }
  function psTypo() {
    var slide = document.querySelector('.slide[data-active="true"]'); if (!slide) return;
    slide.querySelectorAll('.section-title, .title, .subtitle, .lead, .hero-stmt, .tile__t, .kpi__l, .lr__t, .card h3').forEach(function (el) { if (el.closest('.cover2')) return; glue(el); });
    slide.querySelectorAll('.section-title').forEach(function (el) { if (skip(el)) return; fitOne(el, .68, .8); });
    slide.querySelectorAll('.title').forEach(function (el) { if (skip(el)) return; fitOne(el, .82, 0); });
    if (window.relaxNbsp) try { relaxNbsp(slide); } catch (e) {}
  }
  var prev = window.psFitAll;
  window.psFitAll = function () { if (prev) prev(); psTypo(); };
  window.psTypo = psTypo;
  if (document.readyState !== 'loading') psTypo();
})();
"""
JS = JS.replace("__PS_FUNCTION_WORDS__", json.dumps(dict.fromkeys(sorted(FUNCTION_WORDS), 1), ensure_ascii=False))

_PRE = re.compile(r'<pre[ >].*?</pre>', re.S)

def normalize_nbsp(html):
    """Replace raw NBSP characters by spaces everywhere except inside <pre> blocks."""
    out = []; pos = 0
    for m in _PRE.finditer(html):
        out.append(html[pos:m.start()].replace('\xa0', ' ')); out.append(m.group(0)); pos = m.end()
    out.append(html[pos:].replace('\xa0', ' '))
    return ''.join(out)

def inject(html):
    """Append the typography CSS + JS right before </body> (after every other layer)."""
    html = re.sub(r'<style>\s*/\* --- tipografia v3:.*?</style>\s*', '', html, flags=re.S)
    html = re.sub(r'<script>\s*/\* PS-TYPO v3:.*?</script>\s*', '', html, flags=re.S)
    blk = '<style>' + CSS + '</style>\n<script>' + JS + '</script>\n'
    i = html.rindex('</body>')
    return html[:i] + blk + html[i:]

def apply(html):
    return inject(normalize_nbsp(html))
