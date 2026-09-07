const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');
const { root, tokensFor, pages, translationSegments, siteSources, relative } = require('./site-content');
const {
  html, localizedUrl, explorerUrl, validateTranslations, headingSlug,
  retainHeadingAnchors, createLinkResolver, renderDocument,   textPreview, readSource, buildArtifacts
} = require('./build-site');
const ui = require('./site-ui.json');
const { decodeHtml } = require('./check-rendered-site');

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
  assert.equal(matches[0].title, records[1].title);
  assert.equal(searchRecords(records, '').length, 0);
  assert.equal(searchRecords(records, 'sem resultados').length, 0);
  assert.equal(searchRecords(records, 'compatibilidade migracao')[0].title, records[1].title);
  assert.equal(searchRecords(records, 'modernizacao', 1).length, 1);
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
  assert.equal(data.documentCount, documents.length);
  assert.ok(manifest.some(entry => entry.path === 'site/lib/catalog.ts'));
  assert.ok(manifest.some(entry => entry.path === 'docs/design-system/design-system/hub-editorial/tokens.css'));
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
