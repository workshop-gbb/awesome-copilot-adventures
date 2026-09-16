const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { test } = require('node:test');
const { runInNewContext } = require('node:vm');
const ts = require('typescript');
const { root, locales } = require('./site-content');
const { decodeHtml, htmlAttributes } = require('./check-rendered-site');
const ui = require('./site-ui.json');

function loadModule(file, globals = {}) {
  const filename = path.join(root, file);
  const requireFromFile = createRequire(filename);
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  const exports = {};
  runInNewContext(outputText, {
    exports,
    require: name => requireFromFile(name === './icons' ? './icons.ts' : name),
    ...globals
  }, { filename });
  return exports;
}

const { SCENES, sceneKinds, renderScene } = loadModule('site/lib/scenes.ts');
const labels = locale => ({
  kicker: ui[locale].sceneKicker,
  replay: ui[locale].sceneReplay,
  scroll: ui[locale].sceneScroll,
  zoom: ui[locale].sceneZoom,
  fit: ui[locale].sceneFit
});

test('scenes: every localized diagram preserves its complete text and accessible controls', () => {
  const localeIndex = { en: 0, 'pt-br': 1, es: 2 };
  for (const locale of locales) {
    for (const kind of sceneKinds) {
      const id = `${kind}-${locale}`;
      const rendered = renderScene(kind, locale, labels(locale), id);
      const readable = decodeHtml(rendered);
      const spec = SCENES[kind];
      const index = localeIndex[locale];
      for (const text of [spec.title, spec.description, ...Object.values(spec.labels)]) {
        assert.ok(readable.includes(text[index]), `${id}: missing ${text[index]}`);
      }
      for (const caption of spec.captions) {
        assert.ok(readable.includes(caption[0][index]), id);
        assert.ok(readable.includes(caption[1][index]), id);
      }
      for (const label of Object.values(labels(locale))) assert.ok(readable.includes(label), id);
      assert.ok(rendered.includes(`role="img" aria-labelledby="${id}-title ${id}-desc"`), id);
      assert.ok(rendered.includes(`id="${id}-stage" tabindex="0" role="region"`), id);
      assert.ok(rendered.includes(`aria-describedby="${id}-scroll"`), id);
      assert.ok(rendered.includes(`aria-controls="${id}-stage" aria-pressed="false"`), id);
      assert.match(rendered, /data-zoomed="false"/);
      assert.doesNotMatch(rendered, /data-active="false"/, 'The no-JavaScript diagram must remain visible.');
    }
  }
});

test('scenes: wrapped labels and node boundaries stay inside each complete SVG viewBox', () => {
  for (const locale of locales) {
    for (const kind of sceneKinds) {
      const rendered = renderScene(kind, locale, labels(locale), `${kind}-${locale}`);
      const [, width, height] = rendered.match(/class="scn" viewBox="0 0 (\d+) (\d+)"/).map(Number);
      const boxes = [...rendered.matchAll(/<(?:foreignObject|rect)\b([^>]*)>/g)];
      assert.ok(boxes.length > 0, `${kind}/${locale}`);
      for (const [, attributes] of boxes) {
        const values = htmlAttributes(attributes);
        const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(name => Number(values.get(name)));
        assert.ok([x, y, w, h].every(Number.isFinite), `${kind}: ${attributes}`);
        assert.ok(x >= 0 && y >= 0 && w > 0 && h > 0, `${kind}: ${attributes}`);
        assert.ok(x + w <= width && y + h <= height, `${kind}: clipped ${attributes}`);
      }
      const textBoxes = [...rendered.matchAll(/<foreignObject\b[^>]*>([\s\S]*?)<\/foreignObject>/g)];
      for (const [, body] of textBoxes) {
        assert.match(body, /xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/);
        assert.match(body, /class="sc-copy(?: |")/);
      }
    }
  }
});

test('scenes: long skill, artifact and connection labels use bounded wrapping in all languages', () => {
  for (const locale of locales) {
    for (const [kind, expected] of [['skill-loading', 6], ['agent-handoff', 5], ['mcp-connection', 6]]) {
      const rendered = renderScene(kind, locale, labels(locale));
      assert.equal([...rendered.matchAll(/<foreignObject\b/g)].length, expected, `${kind}/${locale}`);
    }
  }
  const rendered = renderScene('skill-loading', 'en', {
    kicker: '<script>', replay: '"Replay"', scroll: 'Read & inspect', zoom: '<Zoom>', fit: '"Fit"'
  });
  assert.doesNotMatch(rendered, /<script>/);
  assert.match(rendered, /data-zoom-label="&lt;Zoom&gt;"/);
  assert.match(rendered, /data-fit-label="&quot;Fit&quot;"/);
});

test('scenes: handoff return connectors do not cross other artifact cards', () => {
  const rendered = renderScene('agent-handoff', 'en', labels('en'));
  const artifacts = [...rendered.matchAll(/<rect\b([^>]*)>/g)]
    .map(([, attributes]) => htmlAttributes(attributes))
    .filter(attributes => attributes.get('class') === 'sc-zone');
  const returns = [...rendered.matchAll(/<path\b([^>]*)>/g)]
    .map(([, attributes]) => htmlAttributes(attributes).get('d')?.match(/^M\d+ \d+ V(\d+) H(\d+) V(\d+)$/))
    .filter(Boolean);
  assert.equal(artifacts.length, 2);
  assert.equal(returns.length, 2);
  for (const [, bottom, returnX, top] of returns) {
    for (const artifact of artifacts) {
      const [x, y, width, height] = ['x', 'y', 'width', 'height'].map(name => Number(artifact.get(name)));
      if (Number(top) < y + height && Number(bottom) > y) {
        assert.ok(Number(returnX) <= x - 8 || Number(returnX) >= x + width + 8,
          `Handoff at x=${returnX} crosses the artifact card at x=${x}.`);
      }
    }
  }
});

test('scenes: the overview fits by default and only explicit enlargement enables local scrolling', () => {
  const css = fs.readFileSync(path.join(root, 'assets/site/scenes.css'), 'utf8');
  assert.match(css, /\.he-scene \.scn\s*\{[^}]*width:\s*100%;[^}]*min-width:\s*0;/);
  assert.match(css, /\.he-scene\[data-zoomed="true"\] \.scn\s*\{[^}]*min-width:\s*1120px;/);
  assert.match(css, /\.he-scene__stage\s*\{[^}]*max-width:\s*100%;[^}]*overflow-x:\s*auto;/);
  assert.match(css, /\.he-scene \.sc-copy\s*\{[^}]*overflow-wrap:\s*anywhere;/);
  assert.match(css, /@container scene \(max-width: 639px\)[\s\S]*?\.he-scene__captions\s*\{[^}]*grid-template-columns:\s*1fr;/);
  assert.doesNotMatch(css, /text-overflow:\s*ellipsis|line-clamp|\.sc-copy[^}]*overflow:\s*hidden/);
});

function sceneHarness(reducedMotion) {
  const listeners = new Map();
  const stage = { scrollLeft: 0 };
  const scene = { dataset: { zoomed: 'false' }, querySelector: () => stage };
  const button = {
    dataset: { zoomLabel: ui['pt-br'].sceneZoom, fitLabel: ui['pt-br'].sceneFit },
    attributes: new Map([['aria-pressed', 'false']]),
    textContent: ui['pt-br'].sceneZoom,
    closest: () => scene,
    addEventListener: (name, listener) => listeners.set(name, listener),
    setAttribute(name, value) { this.attributes.set(name, value); }
  };
  const observed = [];
  let notifyVisibility;
  let threshold;
  const media = { matches: reducedMotion, addEventListener() {} };
  const globals = {
    document: {
      querySelectorAll(selector) {
        if (selector === '[data-scene]') return [scene];
        if (selector === '[data-scene-zoom]') return [button];
        if (selector === '[data-scene-replay]') return [];
        throw new Error(`Unexpected selector: ${selector}`);
      }
    },
    matchMedia: () => media,
    window: { IntersectionObserver: true },
    IntersectionObserver: class {
      constructor(callback, options) {
        notifyVisibility = callback;
        threshold = options.threshold;
      }
      observe(target) { observed.push(target); }
      disconnect() {}
    },
    addEventListener() {}
  };
  loadModule('assets/site/scenes.js', globals).enhanceScenes();
  return { scene, stage, button, observed, threshold, notifyVisibility, click: () => listeners.get('click')() };
}

test('scenes: tall enlarged diagrams activate even when less than a third is visible', () => {
  const { scene, threshold, notifyVisibility } = sceneHarness(false);
  assert.equal(threshold, 0);
  notifyVisibility([{ target: scene, isIntersecting: true, intersectionRatio: 0.02 }]);
  assert.equal(scene.dataset.active, 'true');
  notifyVisibility([{ target: scene, isIntersecting: false, intersectionRatio: 0 }]);
  assert.equal(scene.dataset.active, 'false');
});

for (const reducedMotion of [false, true]) {
  test(`scenes: enlargement and fit remain operable with reduced motion ${reducedMotion}`, () => {
    const { scene, stage, button, observed, click } = sceneHarness(reducedMotion);
    assert.equal(scene.dataset.zoomed, 'false');
    assert.equal(observed.length, reducedMotion ? 0 : 1);
    if (reducedMotion) assert.equal(scene.dataset.active, 'true');
    click();
    assert.equal(scene.dataset.zoomed, 'true');
    assert.equal(button.attributes.get('aria-pressed'), 'true');
    assert.equal(button.textContent, ui['pt-br'].sceneFit);
    stage.scrollLeft = 480;
    click();
    assert.equal(scene.dataset.zoomed, 'false');
    assert.equal(button.attributes.get('aria-pressed'), 'false');
    assert.equal(button.textContent, ui['pt-br'].sceneZoom);
    assert.equal(stage.scrollLeft, 0);
  });
}
