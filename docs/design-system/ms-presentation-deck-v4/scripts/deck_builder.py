"""deck_builder v3.0.0: the one assembler every deck goes through.

    from deck_builder import Deck
    D = Deck(version='1.0.0', title=('EN title', 'PT title', 'ES title'), file_stem='MyDeck', profile='technical')
    D.cover('Line one.', 'Line two in blue.')                      # 3-locale tuples or plain strings
    D.who(intro=(...), p1=(...), p2=(...))                          # Paula's photo slide, texts per locale
    D.read_before(body_html, notes)                                 # optional
    D.agenda()                                                      # placeholder, filled at write()
    D.part('I', 'red', title3, eyebrow3, sub3, notes3)              # divider: bars + title + subtitle
    D.content('red', eyebrow3, title3, body_html, notes3, dark=False, nofill=False, icons=(),
              family='diagram', archetype='request-path', hero=True)
    D.closing(t1, t2, tagline3, code_title, code_lines)
    D.write('/path/Deck_v1_0_0_YYYYMMDD_multi.html')

What the builder guarantees on every deck: the skeleton engine (trilingual chrome, presenter, overview,
notes), the icon sprite, the visual layer + families CSS, code-background deco on every content slide,
bar numerals on dividers, links in a new tab, the closing without a next step, fillCanvas, runtime
interactives, the v3 typography layer (one-line divider titles, no orphans), version stamping.
"""
import sys
import deck_structure
import typo
from visual_taxonomy import classify_slide, normalize_profile, slug
from scenes_kit import EXTRA_CSS as SCENE_CSS
from roman_bars import roman_svg, roman_inline, CSS as ROM_CSS
from codebg import deco, CSS as CBG_CSS
from visual_ext import CSS_EXT, LEGACY_LAYOUT_CSS
from visual_layer import CSS as VCSS, sprite
import os
import re
import json
import datetime
HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.normpath(os.path.join(HERE, '..', 'assets'))
sys.path.insert(0, HERE)

LOCS = ['en', 'pt-BR', 'es']
ACC = {'red': 'var(--ps-color-ms-red-500)', 'yellow': 'var(--ps-color-ms-yellow-500)',
       'blue': 'var(--ps-color-ms-blue-500)', 'green': 'var(--ps-color-ms-green-500)'}
ROLE1 = 'Developer Solutions Advisor, Software Latam Leader'
ROLE2 = 'Data &amp; AI, Global Black Belt at Microsoft Americas'
EMAIL = 'paulasilva@microsoft.com'
TAGLINE = ('Building the future of software development with AI and Agentic DevOps.',
           'Construindo o futuro do desenvolvimento de software com IA e Agentic DevOps.',
           'Construyendo el futuro del desarrollo de software con IA y Agentic DevOps.')
WATCH = ('Watch out', 'Atenção', 'Atención')

LINK_CSS = ('\n/* links: sempre hyperlink visivel, nova aba */\na[href^="http"], .lk .lku { color: var(--ps-text-blue); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }\n'
            '.lk:hover .lku, a[href^="http"]:hover { color: var(--ps-text-blue); text-decoration-thickness: 2px; }\n.lk { text-decoration: none; }\n.lk .lku { font-family: var(--ps-font-mono); }\n.glow { display: none; }\n'
            '.agenda--5 .ag { min-height: 70px; padding: 9px 14px 9px 10px; }\n.agenda--5 .ag__n .rn { height: 28px; }\n.agenda--5 .ag__t { font-size: 20px; }\n'
            '.why { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; margin-top: 16px; }\n.why__i { padding: 12px 14px; border-radius: 8px; background: var(--ps-color-paper); border: 1px solid var(--ps-color-rule); border-left: 5px solid var(--wc); font-size: 13px; line-height: 1.45; color: var(--ps-color-ink-2); }\n'
            '.why__i b { display: block; font-family: var(--ps-font-mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--wc); margin-bottom: 4px; }\n'
            '.why__i--blue { --wc: var(--ps-color-ms-blue-500); } .why__i--green { --wc: var(--ps-color-ms-green-500); } .why__i--yellow { --wc: var(--ps-color-ms-yellow-500); } .why__i--red { --wc: var(--ps-color-ms-red-500); }\n')


def t3(v):
    """Accepts a 3-tuple (en, pt, es) or one string used for the three locales."""
    if isinstance(v, (tuple, list)):
        v = list(v) + [v[0]] * (3 - len(v))
        return v[0], v[1], v[2]
    return v, v, v


class Deck:
    def __init__(self, version='1.0.0', title=('deck', 'deck', 'deck'), file_stem='Deck', skeleton=None, who_snippet=None, date=None, profile='standard'):
        self.version = version
        self.stem = file_stem
        self.date = date or datetime.date.today().isoformat()
        self.profile = normalize_profile(profile)
        with open(skeleton or os.path.join(ASSETS, 'template_skeleton_multi.html'), encoding='utf-8') as skeleton_file:
            self.skel = skeleton_file.read()
        with open(who_snippet or os.path.join(ASSETS, 'who_slide_snippet.html'), encoding='utf-8') as who_file:
            self.who_html = who_file.read()
        self.I18N = {l: {'notes': {}} for l in LOCS}
        self.slides = []
        self.parts = []
        self._n = 0
        self.agenda_idx = None
        self.agenda_title = None
        self._component_styles = {}
        self.reg('meta.title', *t3(title))
        self.reg('labels.watch', *WATCH)
    # ---------- i18n ----------

    def nk(self):
        self._n += 1
        return f'k{self._n}'

    def component_style(self, name, css):
        """Register a shared component's scoped CSS once per deck."""
        if name in self._component_styles and self._component_styles[name] != css:
            raise ValueError(f'Conflicting styles for component "{name}"')
        self._component_styles[name] = css

    def reg(self, key, en, pt=None, es=None):
        pt = pt if pt is not None else en
        es = es if es is not None else en
        for l, v in zip(LOCS, (en, pt, es)):
            d = self.I18N[l]
            parts = key.split('.')
            for p in parts[:-1]:
                d = d.setdefault(p, {})
            d[parts[-1]] = v
        return f'data-i18n="{key}"'

    def N(self, en, pt=None, es=None, timing='~1 min'):
        """Speaker notes in the standard shape: [NÚCLEO] paragraph + [TIMING]."""
        en, pt, es = en, (pt if pt is not None else en), (es if es is not None else en)
        return tuple(f"**[NÚCLEO]**\n{x}\n\n**[TIMING]** {timing}" for x in (en, pt, es))

    def W(self, en, pt=None, es=None):
        k = self.nk()
        en, pt, es = t3((en, pt if pt is not None else en,
                        es if es is not None else en))
        return f'<div class="watch" style="margin-top:14px;max-width:1280px;"><b {self.reg(f"{k}.wl", *WATCH)}>Watch out</b><span {self.reg(f"{k}.wt", en, pt, es)}>{en}</span></div>'
    # ---------- slides ----------

    def add(self, html, notes=('', '', '')):
        self.slides.append((html, t3(notes)))

    def cover(self, l1, l2, notes=None):
        k = self.nk()
        l1 = t3(l1)
        l2 = t3(l2)
        self.add(f'<section class="slide slide--light cover2" data-active="true" data-ps-family="structure" data-ps-archetype="cover" style="--accent: var(--ps-color-ms-blue-500); --label: var(--ps-label-ms);"><h1 class="title"><span {self.reg(f"{k}.l1", *l1)}>{l1[0]}</span><span class="accent-blue" {self.reg(f"{k}.l2", *l2)}>{l2[0]}</span></h1></section>',
                 notes or self.N('Cover: say the two sentences and move on.', 'Capa: diga as duas frases e siga.', 'Portada: diga las dos frases y siga.'))

    def who(self, intro, p1, p2, title=('Who built this, and why.', 'Quem fez isso, e por quê.', 'Quién hizo esto, y por qué.'), eyebrow=('About', 'Sobre', 'Acerca de'), notes=None):
        h = re.sub(r'\s*data-active="[^"]*"', '', self.who_html)
        h = re.sub(r'<img\b(?![^>]*data-ps-asset-kind=)',
                   '<img data-ps-asset-kind="portrait"', h)
        h = h.replace('Developer Solutions Advisor, Latam Leader', ROLE1).replace(
            'Developer Solutions Advisor and Latam Leader', 'Developer Solutions Advisor and Software Latam Leader')
        for key, val in (('who.eyebrow', t3(eyebrow)), ('who.title', t3(title)), ('who.intro', t3(intro)), ('who.p1', t3(p1)), ('who.p2', t3(p2)), ('who.ck', ('Contact', 'Contato', 'Contacto'))):
            self.reg(key, *val)
            h = re.sub(r'(data-i18n="' + re.escape(key) +
                       r'"[^>]*>)[^<]*', lambda m: m.group(1) + val[0], h, count=1)
        h = re.sub(
            r'(<section class="[^"]+")', r'\1 data-ps-family="structure" data-ps-archetype="who"', h, count=1)
        self.add(h, notes or self.N('Optional speaker context: photo, quote with the blue bar, two paragraphs about the deck, and the corporate email only.',
                                    'Contexto opcional da apresentadora: foto, citação com a barra azul, dois parágrafos sobre o deck e só o e-mail corporativo.',
                                    'Contexto opcional de la presentadora: foto, cita con la barra azul, dos párrafos sobre el deck y solo el correo corporativo.'))

    def read_before(self, body, notes, title=('How to use this deck.', 'Como usar este deck.', 'Cómo usar este deck.'), eyebrow=('Read before', 'Leia antes', 'Lea antes'), accent='blue'):
        self.content(accent, eyebrow, title, body, notes,
                     family='editorial', archetype='read-before')

    def content(self, accent, eyebrow, title, body, notes, dark=False, nofill=False, icons=(), snug=False, family=None, archetype=None, hero=None):
        """eyebrow/title: 3-tuples. Adds the code background, the eyerow (with optional product icons) and the title."""
        k = self.nk()
        idx = len(self.slides)
        eyebrow = t3(eyebrow)
        title = t3(title)
        detected_archetype, detected_family, detected_hero = classify_slide(
            body)
        slide_archetype = slug(archetype or detected_archetype)
        slide_family = slug(family or detected_family)
        is_hero = detected_hero if hero is None else bool(hero)
        visual_meta = f' data-ps-family="{slide_family}" data-ps-archetype="{slide_archetype}"'
        if is_hero:
            visual_meta += ' data-ps-hero="1"'
        ey = f'<div class="eyebrow" {self.reg(f"{k}.eyebrow", *eyebrow)}>{
            eyebrow[0]}</div>'
        strip = ''.join(
            f'<svg class="pic pic--brand" viewBox="0 0 24 24" role="img"><use href="#{i}"/></svg>' for i in icons)
        head = f'<div class="eyerow">{ey}<div class="icostrip">{strip}</div></div>' if icons else ey
        cls = 'slide slide--' + \
            ('dark' if dark else 'light') + (' slide--snug' if snug else '')
        nf = ' data-nofill="1"' if nofill else ''
        html = ('<section class="' + cls + '"' + nf + visual_meta + ' style="--accent: ' + ACC[accent] + '; --label: var(--ps-label-ms);">' + deco(idx, dark) + head
                + '<h2 class="title title--small" ' + self.reg(f"{k}.title", *title) + '>' + title[0] + '</h2>' + body + '</section>')
        self.add(html, notes)

    def part(self, roman, accent, title, eyebrow, sub, notes):
        """Divider: bars numeral, one-line title, subtitle. Nothing else."""
        self.parts.append(
            (roman, accent, t3(title), t3(eyebrow), len(self.slides)))
        k = self.nk()
        title = t3(title)
        sub = t3(sub)
        self.add(f'<section class="slide slide--dark" data-ps-family="structure" data-ps-archetype="divider" style="--accent: {ACC[accent]}; --label: var(--ps-label-ms);">{roman_svg(roman)}'
                 f'<h1 class="section-title" {self.reg(f"{k}.title", *title)}>{title[0]}</h1><p class="subtitle" {self.reg(f"{k}.sub", *sub)}>{sub[0]}</p></section>', notes)

    def agenda(self, title=('Agenda.', 'Agenda.', 'Agenda.'), notes=None):
        self.agenda_idx = len(self.slides)
        self.agenda_title = t3(title)
        self.add('<!--AGENDA-->', notes or self.N('Agenda: clickable rows, numeral in the part color, ranges generated from the divider positions. Press A from any slide to return here.',
                                                  'Agenda: linhas clicáveis, algarismo na cor da parte, faixas geradas a partir da posição dos dividers. Aperte A em qualquer slide para voltar aqui.',
                                                  'Agenda: filas clicables, numeral en el color de la parte, rangos generados desde la posición de los dividers. Pulse A en cualquier slide para volver.'))

    def closing(self, t1, t2, tagline=TAGLINE, code_title='', code_lines=(), notes=None):
        k = self.nk()
        t1 = t3(t1)
        t2 = t3(t2)
        tagline = t3(tagline)
        code = ''
        if code_lines:
            body = '\n'.join(code_lines)
            code_heading = t3(code_title)
            code = (f'<div class="code-block" data-nofit="1" style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(240, 240, 240, 0.12); margin-top: 0; max-height: 380px; overflow: hidden;"><div class="code-block__header" {self.reg(f"{k}.codeHeader", *code_heading)}>{code_heading[0]}</div>'
                    f'<pre style="margin:0;padding:14px 18px;font-family:var(--ps-font-mono);font-size:11.5px;line-height:1.6;color:#E6E6E6;white-space:pre-wrap">{body}</pre></div>')
        grid = 'grid-template-columns: 1fr 480px;' if code else 'grid-template-columns: 1fr;'
        self.add(f'''<section class="slide slide--dark" data-ps-family="structure" data-ps-archetype="closing" style="--accent: var(--ps-color-ms-blue-500); --label: var(--ps-label-ms);">{deco(999, True)}
  <div class="eyebrow" {self.reg(f"{k}.eyebrow", "Closing", "Fechamento", "Cierre")}>Closing</div>
  <h1 class="section-title" data-fitlines style="margin-bottom: 20px;"><span {self.reg(f"{k}.t1", *t1)}>{t1[0]}</span><span class="accent-blue" {self.reg(f"{k}.t2", *t2)}>{t2[0]}</span></h1>
  <p class="subtitle" style="font-style: italic; margin-bottom: 32px;" {self.reg(f"{k}.tag", *tagline)}>{tagline[0]}</p>
  <div style="display: grid; {grid} gap: 48px; align-items: start;">
    <div>
      <div style="font-family: var(--ps-font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ps-color-dark-ink-3); margin-bottom: 12px;" {self.reg(f"{k}.contact", "Contact", "Contato", "Contacto")}>Contact</div>
      <div style="font-size: 17px; font-weight: 500; color: var(--ps-color-dark-ink); margin-bottom: 4px;">Paula Silva</div>
      <div style="font-size: 14px; color: var(--ps-color-dark-ink-2); margin-bottom: 3px;">{ROLE1}</div>
      <div style="font-size: 13px; color: var(--ps-color-dark-ink-3); margin-bottom: 12px;">{ROLE2}</div>
      <a href="mailto:{EMAIL}" style="font-size: 15px; color: var(--ps-color-dark-ink); text-decoration: none; border-bottom: 1px solid var(--ps-color-dark-rule);">{EMAIL}</a>
      <div style="font-family: var(--ps-font-mono); font-size: 10.5px; color: var(--ps-color-dark-ink-3); margin-top: 14px;"><span {self.reg(f"{k}.published", "Published", "Publicado", "Publicado")}>Published</span> {self.date} · v{self.version}</div>
    </div>
    {code}
  </div></section>''', notes or self.N('Closing: two-line title, italic tagline, contact on the left. No next step block.', 'Fechamento: título em duas linhas, tagline em itálico, contato à esquerda. Sem bloco de próximo passo.', 'Cierre: título en dos líneas, tagline en cursiva, contacto a la izquierda. Sin bloque de siguiente paso.'))
    # ---------- assembly ----------

    def _agenda_html(self):
        n_all = len(self.slides)
        rows = []
        for i, (roman, accent, title3, eyebrow3, didx) in enumerate(self.parts):
            # last part ends before the closing
            end = (self.parts[i + 1][4] - 1) if i + \
                1 < len(self.parts) else n_all - 2
            a, b = didx + 1, end + 1
            kk = f'agenda.r{i+1}'
            nn = f'agenda.n{i+1}'
            self.reg(kk, f'slides {a} to {b}',
                     f'slides {a} a {b}', f'slides {a} a {b}')
            self.reg(nn, f'{b - a + 1} slides',
                     f'{b - a + 1} slides', f'{b - a + 1} slides')
            t = f'agendaPart{i+1}'
            self.reg(f'{t}.t', *title3)
            self.reg(f'{t}.e', *eyebrow3)
            rows.append(f'<a class="ag" href="#" data-goto="{didx}" style="--accent: {ACC[accent]};" role="button"><span class="ag__n">{roman_inline(roman)}</span><span class="ag__body"><span class="ag__t" data-i18n="{t}.t">{title3[0]}</span><span class="ag__a" data-i18n="{t}.e">{eyebrow3[0]}</span></span><span class="ag__r"><span data-i18n="{kk}">slides {a} to {b}</span><span class="ag__c" data-i18n="{nn}">{b - a + 1} slides</span></span><span class="ag__go">→</span></a>')
        nrows = max(1, (len(self.parts) + 1) // 2)
        extra = (' agenda--5' if nrows > 4 else '') + \
            f'" style="grid-template-rows: repeat({nrows}, 1fr);"'
        title = self.agenda_title
        return (f'<section class="slide slide--light slide--snug" data-ps-family="structure" data-ps-archetype="agenda" style="--accent: var(--ps-color-ms-blue-500); --label: var(--ps-label-ms);"><div class="eyebrow" {self.reg("agenda.eyebrow", "Agenda · click to jump", "Agenda · clique para pular", "Agenda · clic para saltar")}>Agenda · click to jump</div>'
                f'<h2 class="title title--small" {self.reg("agenda.title", *title)}>{title[0]}</h2>'
                f'<div class="agenda stagger{extra}>{"".join(rows)}</div><div class="agenda__hint" {self.reg("agenda.hint", "Every part opens on its divider. Press A from any slide to come back here.", "Cada parte abre no seu divider. Aperte A de qualquer slide para voltar aqui.", "Cada parte abre en su divider. Pulse A desde cualquier slide para volver aquí.")}>Every part opens on its divider. Press A from any slide to come back here.</div></section>')

    def html(self):
        if self.agenda_idx is not None:
            self.slides[self.agenda_idx] = (
                self._agenda_html(), self.slides[self.agenda_idx][1])
        for i, (html, notes) in enumerate(self.slides, 1):
            for l, t in zip(LOCS, notes):
                self.I18N[l]['notes'][f's{i}'] = t
        h = self.skel.replace('<!--SLIDES-->', '\n\n'.join(s for s, _ in self.slides)).replace(
            '/*I18N*/{}', json.dumps(self.I18N, ensure_ascii=False, indent=0))
        h = h.replace(
            '</head>', f'<meta name="ps-deck-profile" content="{self.profile}">\n</head>', 1)
        h = h.replace('<body>', '<body>' + sprite(), 1)
        with open(os.path.join(HERE, 'runtime.js'), encoding='utf-8') as runtime_file:
            runtime = runtime_file.read()
        with open(os.path.join(HERE, 'fill_canvas.js'), encoding='utf-8') as fill_file:
            fill = fill_file.read()
        tail = '<style>' + VCSS + CSS_EXT + LEGACY_LAYOUT_CSS + CBG_CSS + ROM_CSS + LINK_CSS + \
            ''.join(self._component_styles.values()) + \
            '</style>\n' + SCENE_CSS + runtime + fill
        i = h.rindex('</body>')
        h = h[:i] + tail + h[i:]
        # every http link opens in a new tab
        h = re.sub(r'<a (?![^>]*target=)([^>]*href="http[^"]*"[^>]*)>',
                   r'<a \1 target="_blank" rel="noopener">', h)
        h = re.sub(r'<meta name="author" content="[^"]*">',
                   f'<meta name="author" content="Paula Silva, {ROLE1}, {ROLE2}">', h)
        h = re.sub(r'<title[^>]*>[^<]*</title>', lambda m: m.group(0).split('>')
                   [0] + '>' + self.I18N['en']['meta']['title'] + '</title>', h, count=1)
        return deck_structure.install(typo.apply(h), skeleton=self.skel)

    def write(self, out=None, topic_dir=None, qa_dir=None):
        from pathlib import Path
        from deck_publication import publish

        out = out or f'{self.stem}_v{self.version.replace(".", "_")}_{self.date.replace("-", "")}_multi.html'
        if topic_dir is not None:
            out = str(Path(topic_dir) / Path(out).name)
        h = self.html()
        if topic_dir is not None or Path(out).resolve().parent.parent.name == 'decks':
            publish(Path(out), h, qa_dir=qa_dir)
        else:
            with open(out, 'w', encoding='utf-8') as deck_file:
                deck_file.write(h)
        print(
            f'{out}: {len(self.slides)} slides, parts {[(p[0], p[4] + 1) for p in self.parts]}, {len(h)} bytes')
        return out
