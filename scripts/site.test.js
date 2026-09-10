const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');
const { root, locales, tokensFor, pages, translationSegments, loadTranslations, siteSources, relative } = require('./site-content');
const {
  html, localizedUrl, explorerUrl, validateTranslations, headingSlug,
  retainHeadingAnchors, createLinkResolver, renderDocument,   textPreview, readSource, buildArtifacts
} = require('./build-site');
const ui = require('./site-ui.json');
const { decodeHtml, adventureVideoErrors } = require('./check-rendered-site');
const { markdownLinkTargets } = require('./markdown-helpers');
const { mediaId, mediaImage, mediaImages, renderMedia, loadAdventureMedia, loadHandsOnMedia } = require('./site-media');

function assertWebPCover(cover) {
  const bytes = fs.readFileSync(path.join(root, cover.source));
  assert.equal(bytes.subarray(0, 4).toString('ascii'), 'RIFF', cover.source);
  assert.equal(bytes.subarray(8, 12).toString('ascii'), 'WEBP', cover.source);
  const format = bytes.subarray(12, 16).toString('ascii');
  assert.ok(['VP8X', 'VP8 '].includes(format), cover.source);
  const width = format === 'VP8X' ? bytes.readUIntLE(24, 3) + 1 : bytes.readUInt16LE(26) & 0x3fff;
  const height = format === 'VP8X' ? bytes.readUIntLE(27, 3) + 1 : bytes.readUInt16LE(28) & 0x3fff;
  assert.equal(width, cover.width, cover.source);
  assert.equal(height, cover.height, cover.source);
}

test('adventure media covers every current adventure without losing its concept illustration', () => {
  const media = loadAdventureMedia();
  const lessons = pages().filter(page => page.source.startsWith('adventures/') && page.source.endsWith('/README.md'));
  assert.deepEqual(media.covers.map(cover => cover.slug).sort(), lessons.map(page => page.source.split('/')[2]).sort());
  assert.equal(media.films.length, 3);
  for (const cover of media.covers) {
    const page = lessons.find(page => page.source.split('/')[2] === cover.slug);
    const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
    assert.match(markdown, new RegExp(`${cover.slug}-hero\\.webp`));
    assert.match(markdown, new RegExp(`<details>[\\s\\S]*${cover.slug}-hero\\.svg[\\s\\S]*</details>`));
    assertWebPCover(cover);
  }
});

test('hands-on media maps all supplied covers to guides and preserves the concept illustrations', () => {
  const media = loadHandsOnMedia();
  const labs = require('../mslearn-github-copilot/catalog.json').labs;
  const lessons = pages().filter(page => page.group === 'hands-on');
  assert.deepEqual(media.covers.map(cover => cover.id), labs.map(lab => lab.id));
  assert.equal(lessons.length, media.covers.length);
  for (const [index, cover] of media.covers.entries()) {
    assert.equal(cover.original, `assets/images/hands-on/L${String(index + 1).padStart(2, '0')}.jpeg`);
    const page = lessons.find(page => page.labId === cover.id);
    assert.ok(page, cover.id);
    const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
    assert.equal(markdown.match(/!\[[^\]]*]\(([^)]+)\)/)?.[1], `../../../${cover.source}`);
    assert.match(markdown, new RegExp(`<details>[\\s\\S]*hands-on/${cover.id}\\.svg[\\s\\S]*</details>`));
    assertWebPCover(cover);
  }
});

test('hands-on media rejects missing assets, duplicate mappings and incorrect cover metadata', () => {
  const files = siteSources();
  const media = loadHandsOnMedia(files);
  assert.throws(() => loadHandsOnMedia(files, { version: 2, covers: [] }), /Invalid hands-on media catalog/);
  assert.throws(() => loadHandsOnMedia([], media), /Missing or unsupported/);
  assert.throws(() => loadHandsOnMedia(files, { ...media, covers: [...media.covers, media.covers[0]] }), /duplicate/);
  assert.throws(() => loadHandsOnMedia(files, { ...media, covers: [media.covers[0], { ...media.covers[1], original: media.covers[0].original }] }), /Invalid hands-on cover/);
  assert.throws(() => loadHandsOnMedia(files, { ...media, covers: [{ ...media.covers[0], source: '../outside.webp' }] }), /Missing or unsupported/);
  assert.throws(() => loadHandsOnMedia(files, { ...media, covers: [{ ...media.covers[0], height: 0 }] }), /Invalid hands-on cover/);
  const withoutConcept = files.filter(file => !file.endsWith('/hands-on/setup-dotnet.svg'));
  assert.throws(() => loadHandsOnMedia(withoutConcept, media), /Missing or unsupported/);
});

test('adventure media rejects missing sources, duplicate identifiers and unsafe playback metadata', () => {
  const files = siteSources();
  const media = loadAdventureMedia(files);
  assert.throws(() => loadAdventureMedia([], media), /Missing or unsupported/);
  assert.throws(() => loadAdventureMedia(files, { ...media, covers: [...media.covers, media.covers[0]] }), /duplicate/);
  assert.throws(() => loadAdventureMedia(files, { ...media, films: [{ ...media.films[0], silent: false }] }), /Invalid adventure film/);
  assert.throws(() => loadAdventureMedia(files, { ...media, films: [{ ...media.films[0], poster: '../outside.webp' }] }), /Missing or unsupported/);
  assert.throws(() => loadAdventureMedia(files, { ...media, covers: [{ ...media.covers[0], width: 0 }] }), /Invalid adventure cover/);
});

test('film controls and visual descriptions have complete copy in every site language', () => {
  const copy = require('../site/adventure-films.json');
  const media = loadAdventureMedia();
  for (const locale of locales) {
    assert.deepEqual(Object.keys(copy[locale]).sort(), Object.keys(copy.en).sort());
    assert.deepEqual(Object.keys(copy[locale].films).sort(), media.films.map(film => film.id).sort());
    assert.ok(Object.entries(copy[locale]).filter(([key]) => key !== 'films').every(([, value]) => typeof value === 'string' && value.trim()));
    for (const film of Object.values(copy[locale].films)) {
      assert.deepEqual(Object.keys(film).sort(), ['description', 'posterAlt', 'title']);
      assert.ok(Object.values(film).every(value => typeof value === 'string' && value.trim()));
    }
  }
});

test('adventure films use integrated ambient playback instead of detached play controls', () => {
  const component = fs.readFileSync(path.join(root, 'site/components/AdventureFilms.astro'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'assets/site/adventure-films.js'), 'utf8');
  assert.ok(component.includes('data-film-trigger'));
  assert.ok(!component.includes('data-film-play'));
  assert.ok(!component.includes('data-film-still'));
  assert.ok(!/<video[\s\S]*?\bcontrols\b/.test(component));
  assert.ok(script.includes("trigger.addEventListener('mouseenter'"));
  // Focus reveals the cue; it must not start playback, or the first key press would pause instead of play.
  assert.ok(script.includes("trigger.addEventListener('focus', () => { card.dataset.focused = 'true'; })"));
  assert.ok(!/addEventListener\('focus', \(\) => playFilm/.test(script), 'Keyboard focus must not autoplay.');
  assert.ok(script.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
  assert.ok(script.includes("matchMedia('(hover: none)')"));
  assert.ok(script.includes("error?.name === 'AbortError'"));
});

function integratedFilmMarkup() {
  return `<section data-adventure-films data-video-error="Playback failed." data-video-playing="Playing." data-video-paused="Paused.">
    <p id="film-motion-note">Hover or focus to preview; activate to toggle playback.</p>
    <figure data-adventure-film>
      <button type="button" data-film-trigger aria-pressed="false" aria-label="Play visual story: Example" aria-describedby="example-description film-motion-note">
        <img data-film-poster src="/poster.webp" alt="A navigator examines a workbench.">
        <video data-adventure-video data-video-src="/example.mp4" poster="/poster.webp" loop muted playsinline preload="none" aria-hidden="true"></video>
      </button>
      <figcaption>
        <h3 id="example-title">Example</h3>
        <p id="example-description">A navigator compares instruments.</p>
        <a href="/example.mp4">Open silent video</a>
        <p data-film-status role="status"></p>
      </figcaption>
    </figure>
  </section>`;
}

test('adventure video validation accepts described integrated controls with interaction-only looping', () => {
  const markup = integratedFilmMarkup();
  assert.deepEqual(adventureVideoErrors(markup), []);
  assert.deepEqual(adventureVideoErrors(markup.replace(' loop', '')), []);
  assert.deepEqual(adventureVideoErrors(markup.replaceAll('"', "'")), []);
  assert.deepEqual(adventureVideoErrors('<video controls src="/unrelated.mp4"></video>'), []);
});

test('adventure video validation rejects eager playback and inaccessible or missing fallbacks', () => {
  const markup = integratedFilmMarkup();
  const mutations = [
    ['autoplay', text => text.replace('<video ', '<video autoplay ')],
    ['false autoplay is still enabled', text => text.replace('<video ', '<video autoplay="false" ')],
    ['eager source', text => text.replace('<video ', '<video src="/example.mp4" ')],
    ['nested source', text => text.replace('</video>', '<source src="/example.mp4"></video>')],
    ['native controls', text => text.replace('<video ', '<video controls ')],
    ['eager preload', text => text.replace('preload="none"', 'preload="metadata"')],
    ['unmuted video', text => text.replace(' muted', '')],
    ['missing inline playback', text => text.replace(' playsinline', '')],
    ['exposed decorative video', text => text.replace('aria-hidden="true"', 'aria-hidden="false"')],
    ['missing video poster', text => text.replace(' poster="/poster.webp"', '')],
    ['missing deferred source', text => text.replace('data-video-src="/example.mp4"', 'data-video-src=""')],
    ['missing trigger', text => text.replace('data-film-trigger', 'data-unrelated-trigger')],
    ['submit control', text => text.replace('type="button"', 'type="submit"')],
    ['unnamed control', text => text.replace('aria-label="Play visual story: Example"', 'aria-label=" "')],
    ['hidden control', text => text.replace('<button ', '<button hidden ')],
    ['disabled control', text => text.replace('<button ', '<button disabled ')],
    ['missing initial state', text => text.replace('aria-pressed="false"', '')],
    ['unresolved description', text => text.replace('example-description film-motion-note', 'missing-description film-motion-note')],
    ['missing scene description', text => text.replace('example-description film-motion-note', 'film-motion-note')],
    ['missing motion description', text => text.replace('example-description film-motion-note', 'example-description')],
    ['missing poster alternative', text => text.replace('alt="A navigator examines a workbench."', 'alt=""')],
    ['mismatched poster', text => text.replace('src="/poster.webp"', 'src="/different.webp"')],
    ['missing direct download', text => text.replace('href="/example.mp4"', 'href="/different.mp4"')],
    ['missing live status', text => text.replace('role="status"', '')],
    ['missing error announcement', text => text.replace('data-video-error="Playback failed."', '')],
    ['missing play announcement', text => text.replace('data-video-playing="Playing."', '')],
    ['missing pause announcement', text => text.replace('data-video-paused="Paused."', '')]
  ];
  for (const [reason, mutate] of mutations) {
    assert.ok(adventureVideoErrors(mutate(markup)).length > 0, reason);
  }
});

test('adventure film interaction keeps activation, reduced motion, focus and errors accessible', async () => {
  const events = properties => ({
    ...properties,
    listeners: new Map(),
    addEventListener(name, listener) { this.listeners.set(name, listener); },
    async emit(name, event = {}) {
      await this.listeners.get(name)?.(event);
      await new Promise(resolve => setImmediate(resolve));
    }
  });
  const reducedMotion = events({ matches: false });
  const hoverless = events({ matches: false });
  const lifecycle = events({});
  const failures = [];
  const players = [0, 1].map(index => {
    const attributes = new Map();
    const trigger = events({
      setAttribute(name, value) { attributes.set(name, value); },
      getAttribute(name) { return attributes.get(name); }
    });
    const videoAttributes = new Map();
    const video = events({
      dataset: { videoSrc: `/film-${index}.mp4` }, paused: true, currentTime: 0, playCount: 0,
      hasAttribute(name) { return videoAttributes.has(name); },
      load() {},
      pause() { this.paused = true; },
      async play() { this.playCount++; this.paused = false; }
    });
    Object.defineProperty(video, 'src', { set(value) { videoAttributes.set('src', value); } });
    const status = { textContent: '' };
    const elements = { '[data-adventure-video]': video, '[data-film-trigger]': trigger, '[data-film-status]': status };
    const card = { dataset: {}, querySelector(selector) { return elements[selector]; } };
    return { card, trigger, video, status };
  });
  const gallery = {
    dataset: { videoPlaying: 'Playing.', videoPaused: 'Paused.', videoError: 'Playback failed.' },
    querySelectorAll() { return players.map(player => player.card); }
  };
  const document = events({ hidden: false, querySelector() { return gallery; } });
  const script = fs.readFileSync(path.join(root, 'assets/site/adventure-films.js'), 'utf8');
  require('node:vm').runInNewContext(`${script.replace('export function', 'function')}\nenhanceAdventureFilms();`, {
    document,
    matchMedia: query => query === '(prefers-reduced-motion: reduce)' ? reducedMotion : hoverless,
    addEventListener: lifecycle.addEventListener.bind(lifecycle),
    console: { error: (...args) => failures.push(args), info() {} }
  });
  const [first, second] = players;
  assert.ok(players.every(player => !player.video.hasAttribute('src') && player.video.paused));
  await first.trigger.emit('mouseenter');
  assert.equal(first.trigger.getAttribute('aria-pressed'), 'true');
  assert.equal(first.video.paused, false);
  await first.trigger.emit('click');
  assert.equal(first.video.paused, true);
  assert.equal(first.trigger.getAttribute('aria-pressed'), 'false');
  assert.equal(first.status.textContent, 'Paused.');
  await first.trigger.emit('click');
  assert.equal(first.video.paused, false);
  assert.equal(first.status.textContent, 'Playing.');
  await first.trigger.emit('blur');
  assert.equal(first.video.paused, true);
  reducedMotion.matches = true;
  await second.trigger.emit('mouseenter');
  await second.trigger.emit('focus');
  assert.equal(second.video.hasAttribute('src'), false);
  assert.equal(second.card.dataset.focused, 'true');
  await second.trigger.emit('click');
  assert.equal(second.video.paused, false);
  assert.equal(second.status.textContent, 'Playing.');
  await first.trigger.emit('click');
  assert.equal(second.video.paused, true);
  assert.equal(second.trigger.getAttribute('aria-pressed'), 'false');
  await reducedMotion.emit('change', { matches: true });
  assert.ok(players.every(player => player.video.paused && player.card.dataset.playing === undefined));
  reducedMotion.matches = false;
  hoverless.matches = true;
  const playCount = second.video.playCount;
  await second.trigger.emit('focus');
  assert.equal(second.video.playCount, playCount, 'Focus must never start playback.');
  await second.trigger.emit('click');
  assert.equal(second.video.paused, false);
  document.hidden = true;
  await document.emit('visibilitychange');
  assert.ok(players.every(player => player.video.paused));
  document.hidden = false;
  await document.emit('visibilitychange');
  assert.ok(players.every(player => player.video.paused));
  second.video.play = async () => { throw new Error('Playback permission denied'); };
  await second.trigger.emit('click');
  assert.equal(second.trigger.getAttribute('aria-pressed'), 'false');
  assert.equal(second.status.textContent, 'Playback failed.');
  assert.equal(failures.length, 1);
});

test('code copying uses an integrated persistent toolbar', () => {
  const script = fs.readFileSync(path.join(root, 'assets/site/site.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'assets/site/site.css'), 'utf8');
  assert.ok(script.includes("'code-toolbar'"));
  assert.ok(script.includes("'code-language'"));
  assert.ok(script.includes("'copy-icon'"));
  assert.ok(script.includes("message.classList.remove('sr-only')"), 'Clipboard failures must be visible, not only announced to screen readers.');
  assert.ok(styles.includes('.code-toolbar'));
  assert.ok(!styles.includes('.code-wrapper:hover .code-copy'));
});

test('source link checks include reference definitions but ignore literal code examples', () => {
  const source = [
    '[Lesson](./lesson.md#evidence)',
    '![Illustration](./hero.svg)',
    '[Guide][reference]',
    '[reference]: <./guide with spaces.md> "Guide title"',
    '<img src="./diagram.svg" alt="Diagram">',
    '`[example](placeholder)` and ``a ` [example](nested-placeholder)``.',
    '```md',
    '[Example](fenced-placeholder)',
    '```',
    'An unmatched ` marker does not hide [a real link](./real.md).'
  ].join('\n');
  assert.deepEqual(markdownLinkTargets(source).sort(), [
    './lesson.md#evidence', './hero.svg', '<./guide with spaces.md>',
    './diagram.svg', './real.md'
  ].sort());
  assert.deepEqual(markdownLinkTargets('[Read the `guide`](./guide.md)'), ['./guide.md']);
});

test('every lesson mechanism scene names a published lesson and an implemented drawing', () => {
  const scenes = fs.readFileSync(path.join(root, 'site/lib/scenes.ts'), 'utf8');
  const registry = fs.readFileSync(path.join(root, 'site/lib/lesson-scenes.ts'), 'utf8');
  const declared = [...scenes.matchAll(/^ {2}'([a-z-]+)': \{$/gm)].map(match => match[1]);
  const drawn = [...scenes.matchAll(/^ {2}'([a-z-]+)': \(l[,)]/gm)].map(match => match[1]);
  assert.ok(declared.length >= 11, 'The mechanism catalog must cover the curriculum.');
  assert.deepEqual([...declared].sort(), [...drawn].sort(), 'Every declared scene needs a drawing and the reverse.');
  const sources = new Set(pages().map(page => page.source));
  const entries = [...registry.matchAll(/'([^']+\.md)': '([a-z-]+)'/g)];
  assert.ok(entries.length >= 10, 'Most adventures should open with their mechanism.');
  for (const [, source, kind] of entries) {
    assert.ok(sources.has(source), `Scene registered for a missing lesson: ${source}`);
    assert.ok(declared.includes(kind), `Unknown mechanism scene: ${kind}`);
  }
  // A scene carries its own text in the three published languages, never an English fallback.
  // Only the specification block holds localized tuples; the drawing block holds layout arrays.
  const specification = scenes.slice(scenes.indexOf('export const SCENES'), scenes.indexOf('export const sceneKinds'));
  const tuples = [...specification.matchAll(/\[('(?:[^'\\]|\\.)*'(?:, *'(?:[^'\\]|\\.)*')*)\]/g)];
  assert.ok(tuples.length > 120);
  for (const [, body] of tuples) {
    const parts = body.split(/', *'/).length;
    assert.ok(parts === 1 || parts === 3, `A localized scene tuple must hold three languages: ${body.slice(0, 60)}`);
  }
  for (const [, label, replay] of [[0, 'sceneKicker', 'sceneReplay']]) {
    for (const dictionary of Object.values(ui)) assert.ok(dictionary[label] && dictionary[replay]);
  }
});

test('the evidence transcript reports the fixture result instead of invented output', async () => {
  const { evidenceLines, verifyPatch } = await import('../assets/site/simulation.mjs');
  for (const patch of ['incomplete', 'corrected']) {
    const results = verifyPatch(patch);
    const lines = evidenceLines(patch);
    assert.equal(lines[0].kind, 'command');
    assert.match(lines[0].text, /^node --test /);
    const checks = lines.filter(line => ['pass', 'fail'].includes(line.kind)).slice(0, results.length);
    assert.equal(checks.length, results.length);
    results.forEach((result, index) => {
      assert.equal(checks[index].kind, result.passed ? 'pass' : 'fail');
      assert.ok(checks[index].text.includes(JSON.stringify(result.actual)));
    });
    const passed = results.filter(result => result.passed).length;
    assert.ok(lines.some(line => line.text === `${passed} passed, ${results.length - passed} failed, ${results.length} total`));
    assert.ok(lines.at(-1).text.endsWith(passed === results.length ? '0' : '1'));
  }
  assert.throws(() => evidenceLines('unknown'), /Unknown/);
});

test('each lesson links to the practice simulation that matches its capability', () => {
  const registry = fs.readFileSync(path.join(root, 'site/lib/lesson-practice.ts'), 'utf8');
  const topics = new Set(['workflow', 'context', 'verification', 'evidence']);
  const panels = fs.readFileSync(path.join(root, 'site/components/SimulationStudio.astro'), 'utf8');
  for (const topic of topics) assert.ok(panels.includes(`data-studio-panel="${topic}"`), topic);
  const slugs = [...registry.matchAll(/^ {2}'([a-z0-9-]+)': '([a-z]+)',?$/gm)];
  const adventures = pages().filter(page => page.source.startsWith('adventures/') && page.source.endsWith('/README.md'));
  const mapped = new Set(slugs.map(match => match[1]));
  for (const page of adventures) {
    const slug = page.source.split('/')[2];
    assert.ok(mapped.has(slug), `Adventure without a practice topic: ${slug}`);
  }
  for (const [, , topic] of slugs) assert.ok(topics.has(topic) || topic === 'workflow', topic);
  // Every hands-on group resolves to a real panel, so no lab falls back silently.
  const groups = new Set(require('../mslearn-github-copilot/catalog.json').labs.map(lab => lab.group));
  for (const group of groups) assert.ok(registry.includes(`'${group}':`), `Lab group without a practice topic: ${group}`);
  assert.ok(!fs.readFileSync(path.join(root, 'site/layouts/Site.astro'), 'utf8').includes('eldoria|algora'),
    'The lesson practice link must not be routed by a filename regular expression.');
});

test('the hands-on index publishes every catalogued lab under a localized group', () => {
  const component = fs.readFileSync(path.join(root, 'site/components/LabIndex.astro'), 'utf8');
  const catalog = require('../mslearn-github-copilot/catalog.json');
  const lessons = pages().filter(page => page.group === 'hands-on');
  assert.equal(catalog.labs.length, lessons.length);
  for (const lab of catalog.labs) {
    assert.ok(lessons.some(page => page.labId === lab.id), `Lab without a published page: ${lab.id}`);
    assert.ok(component.includes(`'${lab.group}':`), `Lab group without a localized label: ${lab.group}`);
  }
  const keys = [...component.matchAll(/ui\.(labGroup[A-Za-z]+)/g)].map(match => match[1]);
  assert.equal(new Set(keys).size, new Set(catalog.labs.map(lab => lab.group)).size);
  for (const [locale, dictionary] of Object.entries(ui)) {
    for (const key of keys) assert.ok(dictionary[key]?.trim(), `${locale}: ${key}`);
  }
  // The markdown tables the component replaces must not come back and duplicate it.
  const index = fs.readFileSync(path.join(root, 'mslearn-github-copilot/index.md'), 'utf8');
  assert.ok(!index.includes('| Lab |'), 'The lab list is rendered from the catalog, not from a table.');
  assert.ok(index.includes('```mermaid'), 'The Spec Kit decision diagram must stay on the page.');
});

test('every lesson briefing states a translated capability or a real estimate', () => {
  const briefing = fs.readFileSync(path.join(root, 'site/lib/briefing.ts'), 'utf8');
  const documents = pages();
  const adventures = documents.filter(page => page.source.startsWith('adventures/') && page.source.endsWith('/README.md'));
  assert.equal(adventures.length, 14);
  for (const page of adventures) {
    assert.ok(page.capability?.trim(), `Adventure without a capability: ${page.source}`);
    assert.equal(page.status, 'content-ready');
    for (const locale of locales.filter(locale => locale !== 'en')) {
      const dictionary = loadTranslations(locale);
      assert.ok(dictionary[page.capabilityId]?.trim(), `${locale} capability missing for ${page.source}`);
    }
  }
  const labs = documents.filter(page => page.group === 'hands-on');
  assert.ok(labs.every(page => /^\d+ minutes$/.test(page.duration)), 'Every lab declares a facilitation estimate.');
  // The prose callout the briefing replaced must not return and duplicate it.
  for (const page of adventures) {
    const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
    assert.ok(!markdown.includes('> **Status:**'), `Duplicated status callout in ${page.source}`);
  }
  // The briefing escapes every value it renders and stays empty when a page declares nothing.
  assert.ok(briefing.includes('function esc(') && briefing.includes("if (!page.capability && !facts.length) return '';"));
  for (const key of ['briefingCapability', 'briefingLevel', 'briefingStack', 'briefingTime', 'briefingStatus', 'minutesLabel', 'statusContentReady']) {
    assert.ok(briefing.includes(`ui.${key}`), `The briefing must use the ${key} label.`);
    for (const [locale, dictionary] of Object.entries(ui)) assert.ok(dictionary[key]?.trim(), `${locale}: ${key}`);
  }
});

test('each lesson check has exactly one defensible answer in all three languages', () => {
  const quizzes = fs.readFileSync(path.join(root, 'site/lib/lesson-quizzes.ts'), 'utf8');
  const renderer = fs.readFileSync(path.join(root, 'site/lib/quiz.ts'), 'utf8');
  const sources = new Set(pages().map(page => page.source));
  const entries = [...quizzes.matchAll(/^ {2}'([^']+\.md)': \{$/gm)].map(match => match[1]);
  for (const source of entries) assert.ok(sources.has(source), `Check registered for a missing lesson: ${source}`);
  // Every adventure and every lab meets its own misconception before the learner records evidence.
  const lessons = pages().filter(page => (page.source.startsWith('adventures/') && page.source.endsWith('/README.md'))
    || page.group === 'hands-on');
  assert.equal(lessons.length, 40);
  for (const page of lessons) {
    assert.ok(entries.includes(page.source), `Lesson without a retrieval check: ${page.source}`);
  }
  // One correct option per question, and every option explains itself.
  const blocks = quizzes.split(/^ {2}'[^']+\.md': \{$/m).slice(1);
  assert.equal(blocks.length, entries.length);
  for (const [index, block] of blocks.entries()) {
    assert.equal((block.match(/correct: true/g) || []).length, 1, `${entries[index]}: needs exactly one correct option.`);
    assert.equal((block.match(/^ {8}why: \[/gm) || []).length, (block.match(/^ {8}text: \[/gm) || []).length,
      `${entries[index]}: every option needs a reason.`);
  }
  for (const [, body] of quizzes.matchAll(/\[('(?:[^'\\]|\\.)*'(?:, *'(?:[^'\\]|\\.)*')*)\]/g)) {
    assert.equal(body.split(/', *'/).length, 3, `A localized option must hold three languages: ${body.slice(0, 60)}`);
  }
  // Nothing is preselected and the full answer list survives without JavaScript.
  assert.ok(!renderer.includes('aria-pressed="true"'));
  assert.ok(renderer.includes('data-quiz-options hidden') && renderer.includes('class="quiz-answers"'));
  assert.ok(renderer.includes('role="status"') && renderer.includes('aria-live="polite"'));
  for (const key of ['quizKicker', 'quizEmpty', 'quizCorrect', 'quizIncorrect']) {
    for (const [locale, dictionary] of Object.entries(ui)) assert.ok(dictionary[key]?.trim(), `${locale}: ${key}`);
  }
});

test('the workflow simulation shows where a failed review stops the handoff', () => {
  const component = fs.readFileSync(path.join(root, 'site/components/SimulationStudio.astro'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'assets/site/studio.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'assets/site/studio.css'), 'utf8');
  assert.ok(component.includes('data-workflow-map'), 'The stage map must be addressable.');
  assert.ok(script.includes("dataset.outcome = workflow.status"), 'The map must carry the run outcome.');
  // A blocked run severs the next handoff instead of only tinting a border.
  assert.ok(styles.includes('[data-outcome="blocked"] li[data-state="pending"]::before'));
  assert.ok(styles.includes('border-top-style: dashed'));
  assert.ok(styles.includes('[data-outcome="complete"] li[data-state="current"]'));
  // Motion is opt-out: every stage animation sits behind the reduced-motion query.
  const motion = styles.slice(styles.indexOf('@media (prefers-reduced-motion: no-preference)'));
  for (const name of ['he-stage-arrive', 'he-stage-refuse']) {
    assert.ok(motion.includes(name), `${name} must only run when motion is welcome.`);
    assert.ok(styles.includes(`@keyframes ${name}`));
  }
});

test('permanently dark surfaces share one token scope instead of hand-written palettes', () => {
  const styles = fs.readFileSync(path.join(root, 'assets/site/site.css'), 'utf8');
  const scope = styles.slice(styles.indexOf('.he-inverse {'), styles.indexOf('.container {'));
  assert.ok(scope.includes('.he-inverse {'), 'The inverted scope must exist.');
  for (const token of ['--ink:', '--ink-2:', '--ink-3:', '--bg:', '--bg-alt:', '--rule:', '--rule-2:']) {
    assert.ok(scope.includes(token), `The inverted scope must map ${token}`);
  }
  for (const [file, selector] of [
    ['site/components/Home.astro', 'class="hero he-inverse"'],
    ['site/components/Footer.astro', 'class="site-footer he-inverse"'],
    ['site/components/AdventureFilms.astro', 'class="adventure-films he-inverse"']
  ]) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes(selector), `${file} must adopt the inverted scope.`);
  }
  // Those surfaces read their ink and ground from the scope, not from literals.
  const hero = styles.slice(styles.indexOf('.hero {'), styles.indexOf('.hero-aurora'));
  const footer = styles.slice(styles.indexOf('.site-footer {'), styles.indexOf('.footer-atmosphere'));
  for (const [name, block] of [['hero', hero], ['footer', footer]]) {
    assert.ok(block.includes('background: var(--bg)') && block.includes('color: var(--ink)'), `${name} must use the scope.`);
    assert.equal(block.match(/#[0-9a-fA-F]{3,6}\b/g), null, `${name} must not reintroduce colour literals.`);
  }
});

test('the evidence checklist is usable locally without ever claiming a check ran', () => {
  const script = fs.readFileSync(path.join(root, 'assets/site/checklist.js'), 'utf8');
  const site = fs.readFileSync(path.join(root, 'assets/site/site.js'), 'utf8');
  assert.ok(site.includes('enhanceChecklist('), 'The checklist enhancement must be loaded.');
  // Stored per document, in this browser only, and enabled only once script runs.
  assert.ok(site.includes('${base}:evidence:${config.source'), 'Ticks are stored per document.');
  assert.ok(script.includes('localStorage.getItem') && script.includes('localStorage.setItem'));
  assert.ok(script.includes('box.disabled = false'), 'Markdown renders the boxes disabled; script enables them.');
  assert.ok(script.includes("role', 'status'"), 'Progress must be announced.');
  for (const [locale, dictionary] of Object.entries(ui)) {
    for (const key of ['checklistProgress', 'checklistNote', 'checklistClear']) {
      assert.ok(dictionary[key]?.trim(), `${locale}: ${key}`);
    }
    assert.match(dictionary.checklistProgress, /\{done}.*\{total}/, `${locale}: progress needs both counts`);
    // The wording must keep a tick separate from evidence that something actually ran.
    assert.match(dictionary.checklistNote, /navegador|navigator|browser/i, `${locale}: note must say where it is stored`);
  }
});

test('every adventure ends by pointing at the next lesson in the path', () => {
  const helper = fs.readFileSync(path.join(root, 'site/lib/next-lesson.ts'), 'utf8');
  assert.ok(helper.includes("catalog.find(document => document.url === paragraph[1])"),
    'The card must resolve the link the Markdown actually points at.');
  const documents = pages();
  const adventures = documents.filter(page => page.source.startsWith('adventures/') && page.source.endsWith('/README.md'));
  const routes = new Set(documents.map(page => page.route));
  let linked = 0;
  for (const page of adventures) {
    const markdown = fs.readFileSync(path.join(root, page.source), 'utf8');
    const section = markdown.split(/^## Next adventure$/m)[1];
    if (!section) continue;
    // The last adventure closes the path instead of pointing onward; every other one links.
    if (section.match(/\[[^\]]+\]\(([^)]+)\)/)) linked += 1;
  }
  assert.equal(linked, adventures.length - 1, 'All but the final adventure name their successor.');
  assert.ok(routes.size > 0);
  for (const [locale, dictionary] of Object.entries(ui)) assert.ok(dictionary.nextLesson?.trim(), `${locale}: nextLesson`);
});

test('the shared design tokens and static reference have no missing local dependencies', () => {
  const directory = path.join(root, 'docs/design-system/hub-editorial');
  const layout = path.join(root, 'site/layouts/Site.astro');
  const imported = fs.readFileSync(layout, 'utf8').match(/import '([^']*\/tokens\.css)'/);
  assert.ok(imported, 'The site must import the canonical design tokens.');
  assert.equal(path.resolve(path.dirname(layout), imported[1]), path.join(directory, 'tokens.css'));
  const tokens = fs.readFileSync(path.join(directory, 'tokens.css'), 'utf8');
  for (const [, font] of tokens.matchAll(/url\("([^"]+)"\)/g)) {
    assert.ok(fs.statSync(path.resolve(directory, font)).size > 0, font);
  }
  for (const filename of ['index.html', 'foundation.html', 'starter.html']) {
    const source = fs.readFileSync(path.join(directory, filename), 'utf8');
    for (const [, target] of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|data:|#)/.test(target)) continue;
      assert.ok(fs.existsSync(path.resolve(directory, target.split(/[?#]/)[0])), `${filename}: ${target}`);
    }
  }
});

test('locale dictionaries cover identical UI controls with real language tags', () => {
  const keys = Object.keys(ui.en).sort();
  for (const [locale, dictionary] of Object.entries(ui)) {
    assert.deepEqual(Object.keys(dictionary).sort(), keys, locale);
    assert.ok(Object.values(dictionary).every(value => typeof value === 'string' && value.trim()), locale);
  }
  assert.equal(ui['pt-br'].languageTag, 'pt-BR');
  assert.notEqual(ui.en.heroTitle, ui.es.heroTitle);
  assert.notEqual(ui.en.heroTitle, ui['pt-br'].heroTitle);
});

test('responsive navigation keeps its CSS and interaction breakpoint aligned for longer translated labels', () => {
  const script = fs.readFileSync(path.join(root, 'assets/site/site.js'), 'utf8');
  const styles = fs.readFileSync(path.join(root, 'assets/site/site.css'), 'utf8');
  const header = fs.readFileSync(path.join(root, 'site/components/Header.astro'), 'utf8');
  const query = script.match(/const mobile = matchMedia\('\(max-width: (\d+)px\)'\)/)?.[1];
  assert.ok(query, 'The menu script must declare one numeric max-width breakpoint.');
  assert.ok(styles.includes(`@media (max-width: ${query}px) {`), 'The stylesheet must switch at the same width as the script.');
  // The primary navigation stays visible on a laptop; the collapse point is the width at which the
  // longest translated labels stop fitting, not an arbitrarily early one.
  assert.ok(Number(query) <= 1280, 'The navigation must remain visible at common laptop widths.');
  // Long section titles are shortened for the navigation bar so the six links fit before collapsing.
  assert.ok(header.includes('ui.navHandsOn') && header.includes('ui.navStudio'));
  for (const dictionary of Object.values(ui)) {
    assert.ok(dictionary.navHandsOn.length <= dictionary['hands-on'].length, 'navHandsOn must be a short form.');
    assert.ok(dictionary.navStudio.length <= 12, 'navStudio must be a short form.');
  }
});

test('every current learning segment has a structurally valid translation in each published language', () => {
  const segments = translationSegments(pages());
  for (const locale of locales.filter(locale => locale !== 'en')) {
    assert.doesNotThrow(() => validateTranslations(segments, locale, loadTranslations(locale)), locale);
  }
});

test('dialog Escape dismisses the dialog without propagating to surrounding navigation', async () => {
  const { closeOnEscape } = await import('../assets/site/dialog.mjs');
  const dialog = new EventTarget();
  let closed = 0;
  let propagationStopped = 0;
  dialog.close = () => { closed++; };
  closeOnEscape(dialog);
  dialog.dispatchEvent(new Event('keydown'));
  assert.equal(closed, 0);
  const escape = new Event('keydown', { cancelable: true });
  escape.key = 'Escape';
  escape.stopPropagation = () => { propagationStopped++; };
  assert.equal(dialog.dispatchEvent(escape), false);
  assert.equal(escape.defaultPrevented, true);
  assert.equal(closed, 1);
  assert.equal(propagationStopped, 1);
});

test('clipboard copying preserves commands, Markdown, Unicode and whitespace exactly', async () => {
  const { copyText } = await import('../assets/site/clipboard.mjs');
  const copied = [];
  const clipboard = { async writeText(text) { copied.push(text); } };
  const samples = [
    'node --test --test-concurrency=1 greeting.test.mjs\n',
    '# Evidence\n\n```js\nconst message = "<test> & ação";\n```\n',
    '  first line\n\tsecond line\n\n',
    'flowchart LR\n    accTitle: A map\n    A["Ask"] --> B["Plan"]\n',
    ''
  ];
  for (const sample of samples) await copyText(sample, clipboard);
  assert.deepEqual(copied, samples);
});

test('clipboard unavailability and denied permission remain explicit failures', async () => {
  const { copyText } = await import('../assets/site/clipboard.mjs');
  await assert.rejects(copyText('command', undefined), /Clipboard API is unavailable/);
  await assert.rejects(copyText('command', {}), /Clipboard API is unavailable/);
  await assert.rejects(copyText(null, { writeText() {} }), /must be text/);
  const denied = new DOMException('Permission denied', 'NotAllowedError');
  await assert.rejects(copyText('command', { async writeText() { throw denied; } }), error => error === denied);
});

test('prerequisites are discoverable and official resource links open safely in a new tab', () => {
  const page = pages().find(document => document.source === 'docs/prerequisites.md');
  assert.equal(page.route, '/prerequisites/');
  assert.match(page.verified, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(page.verified >= '2026-09-08');
  const source = fs.readFileSync(path.join(root, page.source), 'utf8');
  const anchors = [...source.matchAll(/<a\b([^>]+)>/g)];
  assert.ok(anchors.length > 20);
  for (const [, attributes] of anchors) {
    assert.match(attributes, /href="https:\/\//);
    assert.match(attributes, /target="_blank"/);
    assert.match(attributes, /rel="noopener noreferrer"/);
  }
  for (const file of ['site/components/Header.astro', 'site/components/Sidebar.astro', 'site/components/Home.astro']) {
    assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /\bhref\.prerequisites\b/, file);
  }
  for (const locale of locales) {
    const rendered = renderDocument(page, locale, loadTranslations(locale), createLinkResolver(pages(), siteSources()));
    assert.ok(rendered.includes('target="_blank" rel="noopener noreferrer"'), locale);
    const { data } = buildArtifacts([locale]);
    assert.equal(data.locales[locale].href.prerequisites, `/awesome-copilot-adventures/${locale}/prerequisites/`);
  }
});

test('prose extraction preserves executable fences and surrounding whitespace exactly', () => {
  const source = '# Heading\n\nIntro.\n\n````markdown\n```js\nconst original = 1;\n```\n````\n\nAfter.\n';
  const tokens = tokensFor(source);
  assert.equal(tokens.map(token => token.text).join(''), source);
  const example = tokens.find(token => token.kind === 'code');
  assert.ok(example.text.includes('const original = 1;'));
  assert.equal(example.id, undefined);
});

test('translation validation fails closed on missing prose, changed links and altered code', () => {
  const segment = { id: 'sample', text: 'Use `sendAndWait` and [docs](https://docs.github.com/).', kind: 'prose', sources: ['lesson.md'] };
  assert.throws(() => validateTranslations([segment], 'es', {}), /missing/);
  assert.throws(() => validateTranslations([segment], 'es', { sample: 'Use `sendAndWait` and [docs](https://example.com/).' }), /changed link targets/);
  assert.throws(() => validateTranslations([segment], 'es', { sample: 'Use `send` and [docs](https://docs.github.com/).' }), /changed inline code/);
  assert.doesNotThrow(() => validateTranslations([segment], 'es', { sample: 'Usa `sendAndWait` y la [documentación](https://docs.github.com/).' }));
  const protectedSegment = { id: 'protected', kind: 'prose', text: '> [!NOTE]\n> Stop after 3 attempts.', sources: ['lesson.md'] };
  assert.throws(() => validateTranslations([protectedSegment], 'es', { protected: '> [!NOTA]\n> Detente después de 4 intentos.' }), /protected structure/);
  const heading = { id: 'heading', kind: 'prose', text: '\n# One clear next step', sources: ['lesson.md'] };
  assert.throws(() => validateTranslations([heading], 'es', { heading: '\nUn siguiente paso claro' }), /protected structure/);
  assert.throws(() => validateTranslations([heading], 'es', { heading: '\n## Un siguiente paso claro' }), /protected structure/);
  assert.doesNotThrow(() => validateTranslations([heading], 'es', { heading: '\n# Un siguiente paso claro' }));
  const title = { id: 'title', kind: 'title', text: 'Original illustrations', sources: ['lesson.md'] };
  assert.throws(() => validateTranslations([title], 'es', { title: '# Ilustraciones originales' }), /protected structure/);
});

test('translated headings retain same-document anchors including duplicates', () => {
  const used = new Map();
  assert.equal(headingSlug('Ask → Plan → Agent workflow'), 'ask--plan--agent-workflow');
  const output = retainHeadingAnchors('## Evidence\n\n## Evidence', '## Evidencia\n\n## Evidencia', used);
  assert.ok(output.includes('{#evidence}'));
  assert.ok(output.includes('{#evidence-1}'));
  assert.throws(() => retainHeadingAnchors('## Evidence', '# Evidencia', new Map()), /structure/);
  assert.throws(() => retainHeadingAnchors('## Evidence', 'Evidencia', new Map()), /omitted/);
});

test('Astro Markdown plugin applies stable anchors without leaving visible markers', async () => {
  const { createSatteriMarkdownProcessor } = await import('@astrojs/markdown-satteri');
  const { stableHeadingAnchors } = await import('./heading-anchors.mjs');
  const renderer = await createSatteriMarkdownProcessor({ syntaxHighlight: false, hastPlugins: [stableHeadingAnchors()] });
  const result = await renderer.render('## Evidência {#evidence}\n\nTexto.');
  assert.match(result.code, /<h2 id="evidence">Evidência<\/h2>/);
  assert.ok(!result.code.includes('{#'));
  const taskHeading = await renderer.render('## Task 1 - Inspect {#task-1---inspect}\n\n## Ask → Plan {#ask--plan}');
  assert.match(taskHeading.code, /<h2 id="task-1---inspect">/);
  assert.match(taskHeading.code, /<h2 id="ask--plan">/);
  assert.ok(!taskHeading.code.includes('{#'));
});

test('routes are project-base-aware and source paths are encoded rather than interpolated', () => {
  assert.equal(localizedUrl('pt-br', '/hands-on/'), '/awesome-copilot-adventures/pt-br/hands-on/');
  assert.equal(explorerUrl('es', '.github/agents/example.agent.md'), '/awesome-copilot-adventures/es/repository/?path=.github%2Fagents%2Fexample.agent.md');
  assert.equal(html('<script>"&'), '&lt;script&gt;&quot;&amp;');
  assert.equal(decodeHtml('?path=a&amp;view=b&#35;c&#x2f;d'), '?path=a&view=b#c/d');
});

test('source resolver sends lessons, code and directories to the correct in-site surface', () => {
  const resolve = createLinkResolver(pages(), siteSources());
  assert.equal(resolve('harness-guide.md#roles', 'docs/index.md', 'es'), '/awesome-copilot-adventures/es/harnesses/#roles');
  assert.equal(resolve('../labs/', 'docs/index.md', 'en'), '/awesome-copilot-adventures/en/repository/?path=labs');
  assert.equal(resolve('../mslearn-github-copilot/index.md', 'docs/index.md', 'pt-br'), '/awesome-copilot-adventures/pt-br/hands-on/');
  assert.equal(resolve('https://github.com/paulasilvatech/awesome-copilot-adventures/blob/main/docs/harness-guide.md', 'README.md', 'es'), '/awesome-copilot-adventures/es/harnesses/');
  assert.equal(resolve('https://github.com/workshop-gbb/awesome-copilot-adventures/blob/main/docs/harness-guide.md', 'README.md', 'es'), '/awesome-copilot-adventures/es/harnesses/');
  assert.equal(resolve('https://docs.github.com/en/copilot', 'docs/index.md', 'en'), 'https://docs.github.com/en/copilot');
  assert.equal(resolve('https://workshop-gbb.github.io/awesome-copilot-adventures/pt-br/', 'README.md', 'es'), '/awesome-copilot-adventures/pt-br/');
  assert.throws(() => resolve('https://workshop-gbb.github.io/awesome-copilot-adventures/es/missing/', 'README.md', 'es'), /Unknown localized route/);
  assert.throws(() => resolve('../../outside.md', 'docs/index.md', 'en'), /escapes/);
  assert.throws(() => resolve('missing.md', 'docs/index.md', 'en'), /Unresolved/);
});

test('rendering never uses English as a silent translation fallback', () => {
  const page = pages().find(page => page.source === 'docs/index.md');
  assert.throws(() => renderDocument(page, 'es', {}, createLinkResolver(pages(), siteSources())), /Missing es translation/);
});

test('SVG media translations preserve identifiers, geometry and escaped text', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420"><title>Test map</title><desc>Read and test.</desc><rect width="260" height="96" fill="#111111"/><text>DEMO</text><text>1</text><text>Read the input</text></svg>';
  const image = mediaImage('assets/images/hands-on/demo.svg', svg);
  assert.equal(image.tokens.length, 3);
  const dictionary = {
    [mediaId('Test map')]: 'Mapa de teste',
    [mediaId('Read and test.')]: 'Leia e teste.',
    [mediaId('Read the input')]: 'Leia <input> & valide'
  };
  const { bytes, title, description } = renderMedia(image, 'pt-br', dictionary);
  const localized = bytes.toString('utf8');
  assert.equal(title, 'Mapa de teste');
  assert.equal(description, 'Leia e teste.');
  assert.match(localized, /lang="pt-BR" xml:lang="pt-BR"/);
  assert.match(localized, /width="960" height="420"/);
  assert.ok(localized.includes('<text>DEMO</text><text>1</text>'));
  assert.ok(localized.includes('<rect width="260" height="96" fill="#111111"/>'));
  assert.ok(localized.includes('Leia &lt;input&gt; &amp; valide'));
  assert.equal(image.svg, svg);
  assert.throws(() => renderMedia(image, 'es', {}), /Missing es media translation/);
  assert.throws(() => renderMedia(image, 'unknown', {}), /Unsupported media locale/);
  assert.throws(() => mediaImage(image.source, svg.replace('Read the input', '<tspan>Read</tspan>')), /Unsupported illustration text structure/);
});

test('all current illustrations have localized previews without changing original downloads', () => {
  const images = mediaImages();
  assert.equal(images.length, 40);
  const { artifacts, manifest, documents } = buildArtifacts();
  const previews = new Map(manifest.filter(entry => entry.previews).map(entry => [entry.path, entry.previews]));
  const resolve = createLinkResolver(documents, siteSources(), previews);
  for (const image of images) {
    const entry = manifest.find(entry => entry.path === image.source);
    const original = readSource(path.join(root, image.source));
    const object = JSON.parse(artifacts.get(`site-generated/public/site-data/objects/${entry.hash}.json`));
    assert.deepEqual(Buffer.from(object.content, 'base64'), original);
    assert.deepEqual(artifacts.get(`site-generated/public/site-data/media/${entry.hash}.svg`), original);
    assert.equal(new Set(Object.values(entry.previews).map(preview => preview.url)).size, 3);
    for (const locale of locales) {
      const preview = entry.previews[locale];
      const bytes = artifacts.get(`site-generated/public${preview.url.slice('/awesome-copilot-adventures'.length)}`);
      const expected = renderMedia(image, locale, loadTranslations(locale));
      assert.deepEqual(bytes, expected.bytes, `${locale}: ${image.source}`);
      assert.equal(preview.title, expected.title);
      assert.equal(preview.description, expected.description);
      assert.equal(resolve(`/${image.source}`, 'README.md', locale, true), preview.url);
    }
  }
  assert.ok(manifest.filter(entry => entry.path.startsWith('assets/images/legacy/'))
    .every(entry => entry.legacy && !entry.previews));
});

test('credits identify the maintainer and both original projects in every language', () => {
  const settings = require('../site.config.json');
  assert.deepEqual(settings.maintainer, {
    name: 'Paula Silva', handle: '@paulasilvatech',
    profile: 'https://github.com/paulasilvatech', website: 'https://agenticdevopsplatform.ai'
  });
  const documents = pages();
  const creditPage = documents.find(document => document.source === 'NOTICE.md');
  const resolve = createLinkResolver(documents, siteSources());
  for (const locale of locales) {
    const text = renderDocument(creditPage, locale, loadTranslations(locale), resolve);
    for (const expected of [settings.maintainer.name, settings.maintainer.handle, settings.maintainer.website,
      'https://github.com/microsoft/CopilotAdventures',
      'https://github.com/MicrosoftLearning/mslearn-github-copilot-dev']) {
      assert.ok(text.includes(expected), `${locale}: ${expected}`);
    }
    assert.ok(ui[locale].creditsEvolution);
    assert.ok(ui[locale].fullCredits);
  }
});

test('learner archives resolve to direct downloads with the original ZIP bytes', () => {
  const resolve = createLinkResolver(pages(), siteSources());
  const file = 'assets/lab-kits/hands-on/01-interface.zip';
  assert.equal(resolve(`../${file}`, 'docs/downloads.md', 'pt-br'), `/awesome-copilot-adventures/${file}`);
  const { artifacts, manifest } = buildArtifacts(['en']);
  assert.deepEqual(artifacts.get(`site-generated/public/${file}`), fs.readFileSync(path.join(root, file)));
  assert.equal(manifest.find(entry => entry.path === file).mime, 'application/zip');
});

test('learning navigation uses curriculum order and leaves rubrics accessible through lessons', () => {
  const documents = pages();
  const nexus = documents.find(page => page.source === 'adventures/00-foundations/portals-of-nexus/README.md');
  const mirrors = documents.find(page => page.source === 'adventures/00-foundations/context-mirrors/README.md');
  assert.ok(nexus.navigationOrder < mirrors.navigationOrder);
  assert.equal(nexus.navigationSection, mirrors.navigationSection);
  assert.equal(documents.find(page => page.source === 'adventures/00-foundations/portals-of-nexus/rubric.md').navigationHidden, true);
  assert.ok(documents.find(page => page.labId === 'setup-dotnet').navigationOrder
    < documents.find(page => page.labId === 'setup-sdk').navigationOrder);
});

test('original binary and malformed UTF-8 are not misclassified as source text', () => {
  assert.equal(textPreview(Buffer.from('const example = "ação";\n')), true);
  assert.equal(textPreview(Buffer.from([0, 1, 2])), false);
  assert.equal(textPreview(Buffer.from([0xc3, 0x28])), false);
});

test('localized search is accent-insensitive and prioritizes guides over original paths', async () => {
  const { searchRecords, resultExcerpt } = await import(pathToFileURL(path.join(root, 'assets/site/search.mjs')));
  const records = [
    { title: 'modernizacao.py', text: 'modernizacao.py', original: true },
    { title: 'Modernização com Spec Kit', text: 'Caracterização, compatibilidade e migração.', original: false },
    { title: 'Grafos', text: 'Grafos e nós.', original: false }
  ];
  const matches = searchRecords(records, 'modernizacao');
  assert.equal(matches.length, 2);
  // A lesson always outranks a repository path, and paths are capped so they cannot bury it.
  assert.equal(matches[0].title, records[1].title);
  assert.equal(matches.at(-1).original, true);
  assert.equal(searchRecords(records, '').length, 0);
  assert.equal(searchRecords(records, 'sem resultados').length, 0);
  assert.equal(searchRecords(records, 'compatibilidade migracao')[0].title, records[1].title);
  const flooded = [...Array(20)].map((value, index) => ({ title: `path/modernizacao-${index}.py`, text: 'modernizacao', original: true }));
  const tiered = searchRecords([...flooded, records[1]], 'modernizacao');
  assert.ok(!tiered[0].original, 'The document comes first even against twenty paths.');
  assert.equal(tiered.filter(record => record.original).length, 5, 'Paths are capped.');
  assert.equal(searchRecords(records, 'modernizacao', 1).filter(record => !record.original).length, 1);
  assert.ok(resultExcerpt({ text: '[!TIP] Keep it small.' }, 'small').startsWith('Keep'), 'Admonition markers are not prose.');
  assert.ok(resultExcerpt(records[1], 'migração').includes('migração'));
});

test('reading marks are explicit, locale-independent and reject invalid stored data', async () => {
  const { readingState, toggleReading } = await import('../assets/site/learning.mjs');
  const allowed = ['docs/start-here.md', 'adventures/example/README.md'];
  const empty = readingState(null, allowed);
  assert.deepEqual(empty.read, []);
  const marked = toggleReading(empty, allowed[0], allowed);
  assert.deepEqual(marked.read, [allowed[0]]);
  assert.deepEqual(toggleReading(marked, allowed[0], allowed).read, []);
  assert.deepEqual(readingState(JSON.stringify({ version: 1, read: [allowed[0], allowed[0], 'retired.md'] }), allowed).read, [allowed[0]]);
  assert.throws(() => readingState('broken JSON', allowed), SyntaxError);
  assert.throws(() => readingState('{"version":2,"read":[]}', allowed), /Invalid/);
  assert.throws(() => readingState('{"version":1,"read":[1]}', allowed), /Invalid/);
  assert.throws(() => toggleReading(empty, 'unknown.md', allowed), /not in/);
  assert.deepEqual(empty.read, []);
});

test('library filters combine category, accented search and user-selected reading marks', async () => {
  const { filterLibrary } = await import('../assets/site/learning.mjs');
  const documents = [
    { title: 'Modernização com Spec Kit', source: 'labs/modernization.md', group: 'hands-on' },
    { title: 'Agentes e contexto', source: 'adventures/agents.md', group: 'adventures' },
    { title: 'Guia de contexto', source: 'docs/context.md', group: 'guides' }
  ];
  assert.equal(filterLibrary(documents).length, 3);
  assert.deepEqual(filterLibrary(documents, { query: 'modernizacao', group: 'hands-on' }), [documents[0]]);
  assert.equal(filterLibrary(documents, { query: 'contexto', group: 'hands-on' }).length, 0);
  assert.deepEqual(filterLibrary(documents, { group: 'read', read: ['docs/context.md'] }), [documents[2]]);
});

test('simulation translations cover the same non-empty controls and descriptions in every locale', () => {
  const copy = require('../site/simulations.json');
  const paths = (object, prefix = '') => Object.entries(object).flatMap(([key, value]) =>
    typeof value === 'object' ? paths(value, `${prefix}${key}.`) : [{ path: `${prefix}${key}`, value }]);
  const expected = paths(copy.en).map(entry => entry.path).sort();
  for (const [locale, dictionary] of Object.entries(copy)) {
    const entries = paths(dictionary);
    assert.deepEqual(entries.map(entry => entry.path).sort(), expected, locale);
    assert.ok(entries.every(entry => typeof entry.value === 'string' && entry.value.trim()), locale);
  }
});

test('workflow playback is explicit, bounded, pausable and stopped by a failed review', async () => {
  const { createWorkflow, transitionWorkflow } = await import('../assets/site/simulation.mjs');
  const initial = createWorkflow();
  assert.deepEqual(initial, { scenario: 'passing', cursor: -1, status: 'ready' });
  let state = transitionWorkflow(initial, 'play');
  state = transitionWorkflow(state, 'next');
  assert.equal(state.cursor, 0);
  assert.equal(state.status, 'running');
  state = transitionWorkflow(state, 'pause');
  assert.equal(state.status, 'paused');
  state = transitionWorkflow(state, 'next');
  assert.equal(state.cursor, 1);
  assert.equal(state.status, 'paused');
  for (let index = 0; index < 3; index++) state = transitionWorkflow(state, 'next');
  assert.equal(state.status, 'complete');
  assert.equal(transitionWorkflow(state, 'next'), state);
  assert.deepEqual(transitionWorkflow(state, 'reset'), initial);
  state = createWorkflow('failing');
  for (let index = 0; index < 4; index++) state = transitionWorkflow(state, 'next');
  assert.equal(state.status, 'blocked');
  assert.equal(state.cursor, 3);
  assert.equal(transitionWorkflow(state, 'play'), state);
  assert.equal(transitionWorkflow(state, 'next'), state);
  assert.equal(transitionWorkflow(state, 'reset').scenario, 'failing');
  assert.throws(() => createWorkflow('unknown'), /Unknown/);
  assert.throws(() => transitionWorkflow(initial, 'unknown'), /Unknown/);
  assert.throws(() => transitionWorkflow({ ...initial, cursor: 9 }, 'next'), /Invalid/);
  assert.equal(initial.cursor, -1);
});

test('context workbench distinguishes missing, focused, distracting and over-budget selections', async () => {
  const { evaluateContext } = await import('../assets/site/simulation.mjs');
  const focused = ['task', 'code', 'tests'];
  assert.equal(evaluateContext([]).status, 'missing');
  assert.deepEqual(evaluateContext(['task', 'code']).missing, ['tests']);
  assert.equal(evaluateContext(focused).status, 'ready');
  assert.equal(evaluateContext(focused).units, 7);
  assert.equal(evaluateContext([...focused, 'task']).units, 7);
  assert.equal(evaluateContext([...focused, 'unrelated']).status, 'noisy');
  assert.equal(evaluateContext([...focused, 'logs']).status, 'over');
  assert.throws(() => evaluateContext(['unknown']), /Unknown/);
});

test('fixture verification executes bounded examples and exposes the failing implementation', async () => {
  const { verifyPatch, fixtureCases } = await import('../assets/site/simulation.mjs');
  const failing = verifyPatch('incomplete');
  assert.equal(failing.length, 3);
  assert.equal(failing.filter(result => result.passed).length, 1);
  assert.equal(failing[0].actual, 'Ada');
  assert.equal(failing[2].actual, 'RangeError');
  assert.ok(verifyPatch('corrected').every(result => result.passed));
  assert.equal(fixtureCases[0].expected, 'ada');
  assert.throws(() => verifyPatch('constructor'), /Unknown/);
  assert.throws(() => verifyPatch('unknown'), /Unknown/);
});

test('publication covers every source byte and every learning page without recursive copies', () => {
  const { artifacts, data, documents, manifest } = buildArtifacts(['en']);
  assert.equal(manifest.length, data.sourceCount);
  assert.deepEqual(manifest.map(entry => entry.path), siteSources().map(relative));
  for (const file of ['patterns.js', 'history.js', 'logger.js']) {
    assert.ok(manifest.some(entry => entry.path === `labs/context-mirrors/starter/lib/${file}`), `Missing published starter source: ${file}`);
  }
  assert.ok(!manifest.some(entry => /^(site-pages|site-data)\//.test(entry.path)));
  assert.equal(data.adventureCount, 14);
  assert.equal(data.handsOnCount, 26);
  assert.equal(data.adventureFilms.length, 3);
  const adventureMedia = loadAdventureMedia();
  for (const film of data.adventureFilms) {
    const original = adventureMedia.films.find(entry => entry.id === film.id);
    assert.deepEqual(artifacts.get(`site-generated/public${film.url.slice('/awesome-copilot-adventures'.length)}`),
      fs.readFileSync(path.join(root, original.source)));
    assert.deepEqual(artifacts.get(`site-generated/public${film.poster.slice('/awesome-copilot-adventures'.length)}`),
      fs.readFileSync(path.join(root, original.poster)));
    assert.ok(manifest.some(entry => entry.path === film.original));
  }
  const adventureCards = data.locales.en.catalog.filter(page => page.group === 'adventures' && page.source.endsWith('/README.md'));
  assert.equal(adventureCards.length, 14);
  assert.ok(adventureCards.every(page => page.image.endsWith('.webp')));
  const handsOnCards = data.locales.en.catalog.filter(page => page.group === 'hands-on');
  assert.equal(handsOnCards.length, 26);
  for (const cover of loadHandsOnMedia().covers) {
    const card = handsOnCards.find(page => page.labId === cover.id);
    const bytes = fs.readFileSync(path.join(root, cover.source));
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    assert.equal(card.image, `/awesome-copilot-adventures/site-data/media/${hash}.webp`, cover.id);
    assert.deepEqual(artifacts.get(`site-generated/public/site-data/media/${hash}.webp`), bytes);
    assert.ok(manifest.some(entry => entry.path === cover.original), cover.original);
  }
  assert.equal(data.documentCount, documents.length);
  assert.ok(manifest.some(entry => entry.path === 'site/lib/catalog.ts'));
  assert.ok(manifest.some(entry => entry.path === 'docs/design-system/hub-editorial/tokens.css'));
  assert.ok(!documents.some(document => document.source.startsWith('docs/design-system/')));
  assert.ok(documents.some(document => document.route === '/simulations/'));
  assert.equal(data.locales.en.href.simulations, '/awesome-copilot-adventures/en/simulations/');
  const illustrated = data.locales.en.catalog.filter(document => document.image);
  assert.ok(illustrated.length >= data.adventureCount);
  for (const document of illustrated) {
    assert.ok(artifacts.has(`site-generated/public${document.image.slice('/awesome-copilot-adventures'.length)}`), document.image);
  }
  assert.ok(translationSegments(documents).length > 1000);
  for (const entry of manifest) {
    const object = JSON.parse(artifacts.get(`site-generated/public/site-data/objects/${entry.hash}.json`));
    const decoded = Buffer.from(object.content, 'base64');
    assert.equal(decoded.length, entry.size, entry.path);
    assert.equal(crypto.createHash('sha256').update(decoded).digest('hex'), entry.hash, entry.path);
    assert.ok(decoded.equals(readSource(path.join(root, entry.path))), entry.path);
  }
  const publication = [...artifacts].filter(([name]) => name.startsWith('site-generated/content/en/') && name.endsWith('.md'));
  assert.equal(publication.length, documents.length);
  const declaredRoutes = new Set(documents.map(document => `/en${document.route}`));
  declaredRoutes.add('/en/library/');
  declaredRoutes.add('/en/repository/');
  for (const href of Object.values(data.locales.en.href)) {
    assert.ok(declaredRoutes.has(href.replace('/awesome-copilot-adventures', '')), href);
  }
  assert.ok(JSON.parse(artifacts.get('site-generated/redirects.json')).includes('/hands-on/'));
});
