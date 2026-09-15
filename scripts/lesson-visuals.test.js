const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Module, createRequire } = require('node:module');
const { test } = require('node:test');
const { pathToFileURL } = require('node:url');
const { root, locales, pages } = require('./site-content');
// The repository requires Node 24, which can load this data-only TypeScript module.
const registry = require('../site/lib/lesson-visuals.ts');
const { lessonVisualAssets, lessonVisuals, lessonVisualFor } = registry;
const copy = require('../site/lesson-visuals.json');
const labs = require('../mslearn-github-copilot/catalog.json').labs;
const componentPath = path.join(root, 'site/components/LessonVisual.astro');
const component = fs.readFileSync(componentPath, 'utf8');

const reviewedAssets = [
  'assets/images/general/agent-loop.png',
  'assets/images/general/agents-window-session-target.png',
  'assets/images/general/context-assembly.png',
  'assets/images/general/context-engineering-workflow.png',
  'assets/images/general/tdd-implementation-diagram.png'
];

function pngMetadata(file, base = '') {
  const bytes = fs.readFileSync(file);
  assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], file);
  assert.equal(bytes.subarray(12, 16).toString('ascii'), 'IHDR', file);
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  assert.ok(width > 0 && height > 0, file);
  // A built-URL fixture, not an emitted file. Never resolve images from a root-relative source URL.
  return { src: `${base}/_astro/${path.basename(file, '.png')}.fixture.png`, width, height, format: 'png' };
}

test('lesson visuals: the reviewed originals exist without unrelated image families', () => {
  assert.deepEqual(Object.values(lessonVisualAssets).sort(), reviewedAssets);
  assert.deepEqual([...new Set(Object.values(lessonVisuals))].sort(), Object.keys(lessonVisualAssets).sort());
  const imports = [...component.matchAll(/import \w+ from '(\.\.\/\.\.\/assets\/images\/general\/[^']+)';/g)]
    .map(([, file]) => path.relative(root, path.resolve(path.dirname(componentPath), file)).split(path.sep).join('/'));
  assert.deepEqual(imports.sort(), reviewedAssets, 'Astro must import exactly the reviewed originals.');
  for (const source of reviewedAssets) pngMetadata(path.join(root, source));
});

test('lesson visuals: every target is a published lesson with its reviewed pedagogical match', () => {
  const documents = new Map(pages().map(page => [page.source, page]));
  const reviewedAdventures = {
    'adventures/00-foundations/portals-of-nexus/README.md': 'agents-window-session-target',
    'adventures/00-foundations/context-mirrors/README.md': 'context-assembly',
    'adventures/01-basics/eldoria-laws/README.md': 'context-assembly',
    'adventures/01-basics/tempora-loop/README.md': 'agent-loop',
    'adventures/02-intermediate/stellaris-agents/README.md': 'tdd-implementation-diagram',
    'adventures/04-surfaces/automaton-foundry/README.md': 'agent-loop'
  };
  const reviewedLabs = {
    '01-interface': 'agents-window-session-target',
    '02-csharp': 'context-assembly',
    '02-python': 'context-assembly',
    '04-xunit': 'tdd-implementation-diagram',
    '04-pytest': 'tdd-implementation-diagram',
    '13-greenfield': 'context-engineering-workflow',
    '14-brownfield': 'context-engineering-workflow',
    '15-customization': 'context-assembly',
    '16-sdk': 'agent-loop',
    '17-modernization': 'context-engineering-workflow'
  };
  const expected = { ...reviewedAdventures };
  for (const [id, visual] of Object.entries(reviewedLabs)) {
    const lab = labs.find(entry => entry.id === id);
    assert.ok(lab, `Missing lab ID: ${id}`);
    const source = `mslearn-github-copilot/Instructions/Labs/${lab.file}`;
    assert.equal(documents.get(source)?.labId, id, source);
    expected[source] = visual;
  }
  assert.deepEqual(lessonVisuals, expected, 'Adding a target requires an explicit reference review.');
  for (const [source, visual] of Object.entries(expected)) {
    assert.ok(fs.statSync(path.join(root, source)).isFile(), source);
    assert.ok(documents.has(source), `Unpublished target: ${source}`);
    assert.equal(lessonVisualFor(source), visual, source);
  }
});

test('lesson visuals: indexes, rubrics, references and path lookalikes have no fallback', () => {
  const source = 'adventures/00-foundations/context-mirrors/README.md';
  const omitted = [
    undefined, '', null, '__proto__', 'constructor', 'toString',
    'README.md', 'adventures/README.md', 'docs/adventures.md',
    'mslearn-github-copilot/README.md',
    'mslearn-github-copilot/Instructions/Reference/COPILOT.md',
    source.replace('README.md', 'rubric.md'),
    `/${source}`, `./${source}`, `legacy/${source}`, `site-locales/es/${source}`,
    `${source}#context`, `${source}?reference=true`,
    '01-interface', 'LAB_AK_01_examine_settings_interface.md'
  ];
  for (const page of pages()) {
    if (!Object.hasOwn(lessonVisuals, page.source)) omitted.push(page.source);
  }
  for (const candidate of omitted) assert.equal(lessonVisualFor(candidate), undefined, String(candidate));
});

test('lesson visuals: every image has complete, distinct localized reading and snapshot cautions', () => {
  assert.deepEqual(Object.keys(copy).sort(), [...locales].sort());
  const uiKeys = ['eyebrow', 'expandLabel', 'imageLanguage', 'noticeLabel', 'originalLabel', 'snapshotLabel'];
  const cautionPatterns = { en: /\bnot\b/i, es: /\bno\b/i, 'pt-br': /\bnão\b/i };
  for (const locale of locales) {
    const text = copy[locale];
    assert.deepEqual(Object.keys(text).sort(), [...uiKeys, 'visuals'].sort(), locale);
    for (const key of uiKeys) {
      assert.equal(typeof text[key], 'string', `${locale}/${key}`);
      assert.ok(text[key].trim(), `${locale}/${key}`);
      if (locale !== 'en') assert.notEqual(text[key], copy.en[key], `${locale}/${key}`);
    }
    assert.deepEqual(Object.keys(text.visuals).sort(), Object.keys(lessonVisualAssets).sort(), locale);
    for (const [id, visual] of Object.entries(text.visuals)) {
      assert.deepEqual(Object.keys(visual).sort(), ['alt', 'caution', 'notice', 'title'], `${locale}/${id}`);
      for (const [key, value] of Object.entries(visual)) {
        assert.equal(typeof value, 'string', `${locale}/${id}/${key}`);
        assert.ok(value.trim().length >= 12 && value.length <= 350, `${locale}/${id}/${key}`);
        if (locale !== 'en') assert.notEqual(value, copy.en.visuals[id][key], `${locale}/${id}/${key}`);
      }
      assert.notEqual(visual.alt, visual.title, `${locale}/${id}: alt must describe the image.`);
      assert.notEqual(visual.notice, visual.alt, `${locale}/${id}: explain what to inspect, not just what is pictured.`);
      assert.match(visual.caution, cautionPatterns[locale], `${locale}/${id}: qualify the snapshot.`);
    }
  }
});

test('lesson visuals: reference copy does not invent measured results or product availability', () => {
  const noMetrics = /\d|%|benchmarks?|SWE-bench|VSCBench/iu;
  const noResultClaims = /\b(?:all tests pass|tests passed|proven faster|always available|pruebas superadas|siempre disponible|testes aprovados|sempre disponível)\b/iu;
  for (const [locale, text] of Object.entries(copy)) {
    for (const visual of Object.values(text.visuals)) {
      for (const value of Object.values(visual)) {
        assert.doesNotMatch(value, noMetrics, locale);
        assert.doesNotMatch(value, noResultClaims, locale);
      }
    }
  }
});

/*
 * Compile and render the real .astro template in memory: no generated site, build,
 * server, output files or new test framework. Only Astro's Image boundary is a
 * test double; it receives metadata read from the real PNGs. These tests prove
 * selection, semantics and URL forwarding, not image optimization or browser layout.
 */
async function createRenderer(base = '') {
  const { transform } = require('@astrojs/compiler-rs');
  const { transpileModule, ModuleKind, ScriptTarget } = require('typescript');
  const { experimental_AstroContainer } = require('astro/container');
  const { createComponent, render, addAttribute } = require('astro/runtime/server/index.js');
  const imageCalls = [];
  const Image = createComponent((_result, props) => {
    imageCalls.push(props);
    const width = props.width ?? props.src.width;
    const height = props.height ?? Math.round(width * props.src.height / props.src.width);
    return render`<img${addAttribute(props.src.src, 'src')}${addAttribute(props.alt, 'alt')}${addAttribute(width, 'width')}${addAttribute(height, 'height')}${addAttribute(props.loading, 'loading')}${addAttribute(props.decoding, 'decoding')}${addAttribute(props.class, 'class')}>`;
  }, 'AstroImageTestBoundary');
  const compiled = transform(component, {
    filename: pathToFileURL(componentPath).href,
    internalURL: 'astro/compiler-runtime',
    resultScopedSlot: true,
    // Like Astro's Vite pipeline, supply a resolver; our module loader handles the imports.
    resolvePath: specifier => specifier
  });
  assert.deepEqual(compiled.diagnostics, [], 'The component must compile without Astro diagnostics.');
  assert.equal(compiled.scripts.length, 0, 'The disclosure must not require client JavaScript.');
  const output = transpileModule(compiled.code, {
    compilerOptions: { module: ModuleKind.CommonJS, target: ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText;
  const load = createRequire(componentPath);
  const componentModule = new Module(componentPath);
  componentModule.filename = componentPath;
  componentModule.require = specifier => {
    if (specifier === 'astro:assets') return { Image };
    if (specifier === '../lib/lesson-visuals') return registry;
    if (specifier.includes('?astro&type=style')) return {};
    if (specifier.endsWith('.png')) return pngMetadata(path.resolve(path.dirname(componentPath), specifier), base);
    return load(specifier);
  };
  componentModule._compile(output, componentPath);
  const container = await experimental_AstroContainer.create();
  return async props => {
    imageCalls.length = 0;
    const markup = await container.renderToString(componentModule.exports.default, { props });
    return { markup, imageCalls: [...imageCalls] };
  };
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));
}

test('lesson visuals: selected lessons render one localized figure and a no-JS original disclosure', async () => {
  const render = await createRenderer('/nested/site');
  for (const locale of locales) {
    for (const [source, id] of Object.entries(lessonVisuals)) {
      const { markup, imageCalls } = await render({ locale, source });
      const text = copy[locale];
      const visual = text.visuals[id];
      const metadata = pngMetadata(path.join(root, lessonVisualAssets[id]), '/nested/site');
      const aside = attributes(markup.match(/<aside\b[^>]*>/)[0]);
      assert.equal(aside.lang, locale);
      assert.equal(aside['data-lesson-visual'], id);
      assert.ok(markup.includes(`id="${aside['aria-labelledby']}"`), source);
      for (const value of [visual.title, visual.notice, visual.caution, text.noticeLabel, text.imageLanguage]) {
        assert.ok(markup.includes(value), `${locale}/${source}: ${value}`);
      }
      assert.equal((markup.match(/<figure\b/g) || []).length, 1);
      assert.ok(markup.indexOf(visual.caution) < markup.indexOf('<details'), 'The caution must be visible while collapsed.');
      const details = markup.match(/<details\b[^>]*>/)[0];
      assert.doesNotMatch(details, /\sopen(?:[=\s>])/);
      assert.match(markup, /<details\b[^>]*>\s*<summary\b[^>]*>/);
      assert.ok(markup.includes(text.expandLabel));
      assert.ok(markup.includes(text.originalLabel));
      assert.equal(attributes(markup.match(/<a\b[^>]*>/)[0]).href, metadata.src, source);
      assert.doesNotMatch(markup, /<(?:script|canvas|button|dialog)\b|\btabindex="-1"|\bonclick=/i);
      const images = [...markup.matchAll(/<img\b[^>]*>/g)].map(([tag]) => attributes(tag));
      assert.equal(images.length, 2, 'A compact preview and an optional larger original, not a gallery.');
      for (const image of images) {
        assert.equal(image.alt, visual.alt);
        assert.equal(image.loading, 'lazy');
        assert.equal(image.decoding, 'async');
      }
      assert.equal(images[1].src, metadata.src);
      assert.equal(Number(images[1].width), metadata.width);
      assert.equal(Number(images[1].height), metadata.height);
      assert.equal(imageCalls.length, 1);
      assert.equal(imageCalls[0].src.src, metadata.src, 'A swapped static import must not select an unrelated picture.');
      assert.equal(imageCalls[0].format, 'webp');
      assert.equal(imageCalls[0].layout, 'none');
      assert.equal(imageCalls[0].width, Math.min(640, metadata.width));
      assert.ok(imageCalls[0].widths.every(width => width <= metadata.width), 'Never upscale a small original.');
    }
  }
});

test('lesson visuals: imported original URLs are used unchanged at root and nested deployment bases', async () => {
  const source = 'adventures/00-foundations/portals-of-nexus/README.md';
  for (const base of ['', '/review/nested-base']) {
    const render = await createRenderer(base);
    const { markup } = await render({ locale: 'en', source });
    const metadata = pngMetadata(path.join(root, lessonVisualAssets[lessonVisualFor(source)]), base);
    assert.equal(attributes(markup.match(/<a\b[^>]*>/)[0]).href, metadata.src);
  }
});

test('lesson visuals: absent and unrelated sources render no markup or images in every locale', async () => {
  const render = await createRenderer();
  const sources = [
    undefined, '', 'adventures/README.md', 'docs/adventures.md',
    'adventures/00-foundations/context-mirrors/rubric.md',
    'adventures/03-advanced/mythos-parallel/README.md',
    'mslearn-github-copilot/README.md',
    'mslearn-github-copilot/Instructions/Reference/COPILOT.md',
    'mslearn-github-copilot/Instructions/Labs/LAB_AK_10_implement_performance_profiling.md'
  ];
  for (const locale of locales) {
    for (const source of sources) {
      const { markup, imageCalls } = await render({ locale, source });
      assert.equal(markup.trim(), '', `${locale}/${source}`);
      assert.deepEqual(imageCalls, []);
    }
  }
});

test('lesson visuals: scoped styles preserve uncropped colors, wrapping and native focus cues', () => {
  assert.doesNotMatch(component, /<style[^>]*is:global|:global\(|object-fit:\s*cover|filter:\s*invert|white-space:\s*nowrap/);
  assert.match(component, /@container lesson-visual \(min-width: 38rem\)/);
  assert.match(component, /overflow-wrap:\s*anywhere/);
  assert.match(component, /block-size:\s*auto/);
  assert.match(component, /object-fit:\s*contain/);
  assert.match(component, /summary:focus-visible/);
  assert.match(component, /min-block-size:\s*var\(--he-touch-target\)/);
  assert.doesNotMatch(component, /summary[^{]*\{[^}]*display:\s*none/);
  assert.doesNotMatch(component, /\b(?:animation|transition):/);
});
