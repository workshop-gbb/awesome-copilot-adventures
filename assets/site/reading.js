import { readingState, toggleReading } from './learning.mjs';

export function enhanceReading({ ui, sources, base, locale }, onChange = () => {}) {
  const storageKey = `${base}:reading:v1`;
  const trackers = [...document.querySelectorAll('[data-reading-tracker]')];
  const format = new Intl.NumberFormat(locale);
  let state = { version: 1, read: [] };
  let available = true;

  const status = message => {
    for (const node of document.querySelectorAll('[data-reading-status]')) node.textContent = message;
  };
  const render = () => {
    for (const tracker of trackers) {
      const marked = available && state.read.includes(tracker.dataset.readingSource);
      tracker.dataset.readingState = available ? marked ? 'marked' : 'idle' : 'unavailable';
      tracker.hidden = false;
      const count = tracker.querySelector('[data-reading-count]');
      count.textContent = available ? format.format(state.read.length) : '--';
      if (available) count.removeAttribute('aria-label');
      else count.setAttribute('aria-label', ui.readingUnavailable);
      const mark = tracker.querySelector('[data-mark-reading]');
      if (mark) {
        mark.disabled = !available;
        mark.setAttribute('aria-pressed', String(marked));
        mark.querySelector('[data-mark-reading-label]').textContent = marked ? ui.unmarkRead : ui.markRead;
      }
      tracker.querySelector('[data-reset-reading]').disabled = available && state.read.length === 0;
    }
    for (const badge of document.querySelectorAll('[data-read-badge]')) {
      badge.hidden = !available || !state.read.includes(badge.closest('[data-source]').dataset.source);
      badge.setAttribute('aria-label', ui.markedRead);
    }
    onChange();
  };
  const failed = error => {
    if (!(error instanceof DOMException || error instanceof SyntaxError || error instanceof TypeError)) throw error;
    available = false;
    render();
    status(ui.readingStorageError);
    console.error('Reading progress storage failed.', error);
  };
  const load = (announce = false) => {
    try {
      state = readingState(localStorage.getItem(storageKey), sources);
      available = true;
    } catch (error) {
      failed(error);
      return;
    }
    render();
    status(announce ? ui.readingLoaded : '');
  };
  const closeConfirmation = (tracker, restoreFocus = true) => {
    tracker.querySelector('[data-reading-confirm]').hidden = true;
    if (restoreFocus) {
      const request = tracker.querySelector('[data-reset-reading]');
      (request.disabled ? tracker.querySelector('[data-reading-manage] summary') : request).focus();
    }
  };

  for (const tracker of trackers) {
    const mark = tracker.querySelector('[data-mark-reading]');
    mark?.addEventListener('click', () => {
      if (!available) {
        status(ui.readingStorageError);
        return;
      }
      try {
        const next = toggleReading(state, mark.dataset.markReading, sources);
        localStorage.setItem(storageKey, JSON.stringify(next));
        state = next;
      } catch (error) {
        failed(error);
        return;
      }
      render();
      status(state.read.includes(mark.dataset.markReading) ? ui.readingSaved : ui.readingRemoved);
    });
    tracker.querySelector('[data-retry-reading]').addEventListener('click', () => load(true));
    tracker.querySelector('[data-reset-reading]').addEventListener('click', () => {
      tracker.querySelector('[data-reading-confirm]').hidden = false;
      tracker.querySelector('[data-cancel-reading-reset]').focus();
    });
    tracker.querySelector('[data-cancel-reading-reset]').addEventListener('click', () => closeConfirmation(tracker));
    tracker.querySelector('[data-confirm-reading-reset]').addEventListener('click', () => {
      try {
        // Never clear the browser's unrelated preferences or per-lesson evidence.
        localStorage.removeItem(storageKey);
        state = { version: 1, read: [] };
        available = true;
      } catch (error) {
        failed(error);
        return;
      }
      render();
      closeConfirmation(tracker);
      status(ui.readingCleared);
    });
    const manage = tracker.querySelector('[data-reading-manage]');
    manage.addEventListener('toggle', () => {
      if (!manage.open) closeConfirmation(tracker, false);
    });
    manage.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !tracker.querySelector('[data-reading-confirm]').hidden) {
        event.preventDefault();
        event.stopPropagation();
        closeConfirmation(tracker);
      }
    });
  }
  if (trackers.length || document.querySelector('[data-discovery]')) load();
  addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) load();
  });
  addEventListener('pageshow', event => {
    if (event.persisted) load();
  });
  return { get read() { return available ? state.read : []; } };
}
