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

test('publication covers every source byte and every learning page without recursive copies', () => {
  const { artifacts, data, documents, manifest } = buildArtifacts(['en']);
  assert.equal(manifest.length, data.sourceCount);
  assert.deepEqual(manifest.map(entry => entry.path), siteSources().map(relative));
  assert.ok(!manifest.some(entry => /^(site-pages|site-data)\//.test(entry.path)));
  assert.equal(data.adventureCount, 14);
  assert.equal(data.handsOnCount, 26);
  assert.equal(data.documentCount, documents.length);
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
