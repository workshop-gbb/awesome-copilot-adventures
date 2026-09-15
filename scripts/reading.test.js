const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const labels = require('./site-ui.json');

const script = fs.readFileSync(path.join(__dirname, '../assets/site/reading.js'), 'utf8');
const storageKey = '/workshop:reading:v1';
const source = 'docs/start-here.md';
const sources = [source, 'adventures/00-foundations/context-mirrors/README.md'];

async function setup({ raw = null, error, withTracker = true, locale = 'en' } = {}) {
  const { readingState, toggleReading } = await import('../assets/site/learning.mjs');
  let focused;
  let storageFailure = error;
  let changes = 0;
  const errors = [];
  const saved = new Map([['/workshop:evidence:example', 'keep'], ['theme', 'dark']]);
  if (raw !== null) saved.set(storageKey, raw);
  const node = (properties = {}) => ({
    hidden: false, disabled: false, textContent: '', dataset: {},
    attributes: new Map(), listeners: new Map(),
    setAttribute(key, value) { this.attributes.set(key, value); },
    getAttribute(key) { return this.attributes.get(key); },
    removeAttribute(key) { this.attributes.delete(key); },
    addEventListener(event, handler) { this.listeners.set(event, handler); },
    emit(event, data = {}) { return this.listeners.get(event)?.(data); },
    focus() { focused = this; },
    ...properties
  });
  const label = node();
  const mark = node({ dataset: { markReading: source }, querySelector: () => label });
  const nodes = {
    '[data-reading-count]': node(),
    '[data-reading-status]': node(),
    '[data-mark-reading]': mark,
    '[data-reset-reading]': node(),
    '[data-retry-reading]': node(),
    '[data-reading-confirm]': node({ hidden: true }),
    '[data-cancel-reading-reset]': node(),
    '[data-confirm-reading-reset]': node(),
    '[data-reading-manage]': node({ open: false }),
    '[data-reading-manage] summary': node()
  };
  const tracker = node({
    hidden: true, dataset: { readingSource: source },
    querySelector: selector => nodes[selector]
  });
  const badge = node({ closest: () => ({ dataset: { source } }) });
  const lifecycle = node();
  const localStorage = {
    getItem(key) { if (storageFailure) throw storageFailure; return saved.get(key) ?? null; },
    setItem(key, value) { if (storageFailure) throw storageFailure; saved.set(key, value); },
    removeItem(key) { if (storageFailure) throw storageFailure; saved.delete(key); }
  };
  const document = {
    querySelector: () => ({}),
    querySelectorAll(selector) {
      if (selector === '[data-reading-tracker]') return withTracker ? [tracker] : [];
      if (selector === '[data-reading-status]') return withTracker ? [nodes[selector]] : [];
      if (selector === '[data-read-badge]') return [badge];
      throw new Error(`Unexpected selector: ${selector}`);
    }
  };
  const controller = vm.runInNewContext(
    `${script.replace(/^import .+;\n/gm, '').replace('export function', 'function')}\nenhanceReading(config, changed);`,
    {
      readingState, toggleReading, document, localStorage, Intl, DOMException, SyntaxError, TypeError,
      config: { ui: labels[locale], sources, base: '/workshop', locale },
      console: { error: (...args) => errors.push(args) },
      addEventListener: lifecycle.addEventListener.bind(lifecycle),
      changed: () => changes++
    }
  );
  return {
    tracker, nodes, label, badge, saved, lifecycle, controller, errors,
    get focused() { return focused; },
    get changes() { return changes; },
    failStorage: value => { storageFailure = value; }
  };
}

test('reading controls preserve their icon and mark only after storage succeeds in every language', async () => {
  for (const locale of ['en', 'es', 'pt-br']) {
    const app = await setup({ locale });
    const mark = app.nodes['[data-mark-reading]'];
    assert.equal(app.tracker.hidden, false);
    assert.equal(app.nodes['[data-reset-reading]'].disabled, true);
    assert.equal(app.label.textContent, labels[locale].markRead);
    mark.emit('click');
    assert.equal(app.tracker.dataset.readingState, 'marked');
    assert.equal(mark.getAttribute('aria-pressed'), 'true');
    assert.equal(mark.textContent, '', 'Updating the label must not replace the icon.');
    assert.equal(app.label.textContent, labels[locale].unmarkRead);
    assert.deepEqual(JSON.parse(app.saved.get(storageKey)).read, [source]);
    assert.equal(app.badge.hidden, false);
    assert.equal(app.nodes['[data-reading-status]'].textContent, labels[locale].readingSaved);
    mark.emit('click');
    assert.equal(app.tracker.dataset.readingState, 'idle');
    assert.equal(app.badge.hidden, true);
    assert.equal(app.nodes['[data-reading-status]'].textContent, labels[locale].readingRemoved);
  }
});

test('reading reset is secondary, cancel-first, and removes only this site reading key', async () => {
  const app = await setup({ raw: JSON.stringify({ version: 1, read: sources }) });
  const request = app.nodes['[data-reset-reading]'];
  request.emit('click');
  assert.equal(app.nodes['[data-reading-confirm]'].hidden, false);
  assert.equal(app.focused, app.nodes['[data-cancel-reading-reset]']);
  app.nodes['[data-cancel-reading-reset]'].emit('click');
  assert.equal(app.nodes['[data-reading-confirm]'].hidden, true);
  assert.equal(app.focused, request);
  assert.equal(JSON.parse(app.saved.get(storageKey)).read.length, 2);
  request.emit('click');
  app.nodes['[data-confirm-reading-reset]'].emit('click');
  assert.equal(app.saved.has(storageKey), false);
  assert.equal(app.saved.get('/workshop:evidence:example'), 'keep');
  assert.equal(app.saved.get('theme'), 'dark');
  assert.equal(app.focused, app.nodes['[data-reading-manage] summary']);
  assert.equal(app.nodes['[data-reading-count]'].textContent, '0');
  assert.equal(app.nodes['[data-reading-status]'].textContent, labels.en.readingCleared);
});

test('Escape cancels an inline reset without dismissing surrounding navigation', async () => {
  const app = await setup({ raw: JSON.stringify({ version: 1, read: [source] }) });
  app.nodes['[data-reset-reading]'].emit('click');
  let prevented = false;
  let stopped = false;
  app.nodes['[data-reading-manage]'].emit('keydown', {
    key: 'Escape',
    preventDefault() { prevented = true; },
    stopPropagation() { stopped = true; }
  });
  assert.equal(prevented && stopped, true);
  assert.equal(app.nodes['[data-reading-confirm]'].hidden, true);
  assert.equal(app.focused, app.nodes['[data-reset-reading]']);
  assert.equal(app.saved.has(storageKey), true);
});

test('corrupt reading data is visibly unavailable and can be reset without a false zero', async () => {
  const app = await setup({ raw: '{invalid' });
  assert.equal(app.tracker.dataset.readingState, 'unavailable');
  assert.equal(app.nodes['[data-reading-count]'].textContent, '--');
  assert.equal(app.nodes['[data-reading-count]'].getAttribute('aria-label'), labels.en.readingUnavailable);
  assert.equal(app.nodes['[data-mark-reading]'].disabled, true);
  assert.equal(app.nodes['[data-reset-reading]'].disabled, false);
  assert.equal(app.errors.length, 1);
  app.nodes['[data-reset-reading]'].emit('click');
  app.nodes['[data-confirm-reading-reset]'].emit('click');
  assert.equal(app.tracker.dataset.readingState, 'idle');
  assert.equal(app.nodes['[data-mark-reading]'].disabled, false);
  assert.equal(app.nodes['[data-reading-count]'].getAttribute('aria-label'), undefined);
});

test('denied storage never announces a save, and reload recovers the last persisted mark', async () => {
  const initial = JSON.stringify({ version: 1, read: [source] });
  const app = await setup({ raw: initial });
  app.failStorage(new DOMException('Denied', 'SecurityError'));
  app.nodes['[data-mark-reading]'].emit('click');
  assert.equal(app.tracker.dataset.readingState, 'unavailable');
  assert.equal(app.nodes['[data-reading-status]'].textContent, labels.en.readingStorageError);
  assert.equal(app.saved.get(storageKey), initial);
  app.nodes['[data-confirm-reading-reset]'].emit('click');
  assert.equal(app.saved.get(storageKey), initial);
  assert.equal(app.nodes['[data-reading-status]'].textContent, labels.en.readingStorageError);
  app.failStorage(undefined);
  app.nodes['[data-retry-reading]'].emit('click');
  assert.equal(app.tracker.dataset.readingState, 'marked');
  assert.equal(app.nodes['[data-mark-reading]'].disabled, false);
  assert.equal(app.nodes['[data-reading-status]'].textContent, labels.en.readingLoaded);
});

test('catalog-only pages load marks and update badges on storage and restored-page events', async () => {
  const app = await setup({ withTracker: false, raw: JSON.stringify({ version: 1, read: [source] }) });
  assert.equal(app.badge.hidden, false);
  assert.deepEqual(Array.from(app.controller.read), [source]);
  const changes = app.changes;
  app.saved.delete(storageKey);
  app.lifecycle.emit('storage', { key: 'theme' });
  assert.equal(app.changes, changes);
  app.lifecycle.emit('storage', { key: storageKey });
  assert.equal(app.badge.hidden, true);
  app.saved.set(storageKey, JSON.stringify({ version: 1, read: [source] }));
  app.lifecycle.emit('pageshow', { persisted: true });
  assert.equal(app.badge.hidden, false);
  assert.ok(app.changes > changes);
});

test('unexpected reading failures propagate instead of becoming success-shaped fallback state', async () => {
  await assert.rejects(setup({ error: new Error('Unexpected failure') }), /Unexpected failure/);
});
