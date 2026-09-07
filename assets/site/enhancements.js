import { readingState, toggleReading, filterLibrary } from './learning.mjs';

export function enhanceSite(config, locationChanged) {
  const { ui, sources, base, locale } = config;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const format = new Intl.NumberFormat(locale);
  const storageKey = `${base}:reading:v1`;
  let state = { version: 1, read: [] };
  let storageAvailable = true;
  const catalogControllers = [];
  const trackers = [...document.querySelectorAll('[data-reading-tracker]')];

  const status = message => {
    for (const node of document.querySelectorAll('[data-reading-status]')) node.textContent = message;
  };
  const storageError = error => {
    storageAvailable = false;
    status(ui.readingStorageError);
    for (const button of document.querySelectorAll('[data-mark-reading]')) button.disabled = true;
    console.error('Reading progress storage failed.', error);
  };
  if (trackers.length) {
    try {
      state = readingState(localStorage.getItem(storageKey), sources);
    } catch (error) {
      storageError(error);
    }
  }
  const renderReading = () => {
    for (const node of document.querySelectorAll('[data-reading-count]')) node.textContent = format.format(state.read.length);
    for (const button of document.querySelectorAll('[data-mark-reading]')) {
      const read = state.read.includes(button.dataset.markReading);
      button.setAttribute('aria-pressed', String(read));
      button.textContent = read ? ui.markedRead : ui.markRead;
    }
    for (const badge of document.querySelectorAll('[data-read-badge]')) {
      badge.hidden = !state.read.includes(badge.closest('[data-source]').dataset.source);
      badge.setAttribute('aria-label', ui.markedRead);
    }
    for (const render of catalogControllers) render();
  };
  for (const tracker of trackers) tracker.hidden = false;
  for (const button of document.querySelectorAll('[data-mark-reading]')) {
    button.addEventListener('click', () => {
      if (!storageAvailable) { status(ui.readingStorageError); return; }
      try {
        const next = toggleReading(state, button.dataset.markReading, sources);
        localStorage.setItem(storageKey, JSON.stringify(next));
        state = next;
        renderReading();
        status(state.read.includes(button.dataset.markReading) ? ui.readingSaved : ui.readingRemoved);
      } catch (error) {
        storageError(error);
      }
    });
  }
  for (const button of document.querySelectorAll('[data-reset-reading]')) {
    button.addEventListener('click', () => {
      if (!confirm(ui.clearReadingConfirm)) return;
      try {
        localStorage.removeItem(storageKey);
        state = { version: 1, read: [] };
        storageAvailable = true;
        for (const mark of document.querySelectorAll('[data-mark-reading]')) mark.disabled = false;
        renderReading();
        status(ui.readingCleared);
      } catch (error) {
        storageError(error);
      }
    });
  }
  for (const root of document.querySelectorAll('[data-discovery]')) {
    const input = root.querySelector('[data-library-query]');
    const filters = [...root.querySelectorAll('[data-library-filter]')];
    const cards = [...root.querySelectorAll('[data-library-card]')];
    const documents = cards.map(card => ({ source: card.dataset.source, title: card.dataset.title, group: card.dataset.group }));
    const compact = root.dataset.compact === 'true';
    const parameters = new URLSearchParams(location.search);
    let group = filters.some(button => button.dataset.libraryFilter === parameters.get('track')) ? parameters.get('track') : 'all';
    input.value = parameters.get('q') || '';
    let timer;
    const render = (updateAddress = false) => {
      const matches = filterLibrary(documents, { query: input.value, group, read: state.read });
      const visible = new Set((compact ? matches.slice(0, 6) : matches).map(document => document.source));
      for (const card of cards) card.hidden = !visible.has(card.dataset.source);
      for (const button of filters) button.setAttribute('aria-pressed', String(button.dataset.libraryFilter === group));
      root.querySelector('[data-library-status]').textContent = `${ui.filterShowing}: ${format.format(matches.length)}`;
      root.querySelector('[data-library-empty]').hidden = matches.length !== 0;
      const query = new URLSearchParams();
      if (group !== 'all') query.set('track', group);
      if (input.value.trim()) query.set('q', input.value.trim());
      const more = root.querySelector('[data-library-more]');
      if (more) more.href = `${base}/${locale}/library/${query.size ? `?${query}` : ''}`;
      if (updateAddress) {
        history.replaceState(null, '', `${location.pathname}${query.size ? `?${query}` : ''}${location.hash}`);
        locationChanged();
      }
    };
    for (const button of filters) button.addEventListener('click', () => { group = button.dataset.libraryFilter; render(true); });
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => render(true), 120);
    });
    root.querySelector('[data-clear-filters]').addEventListener('click', () => { group = 'all'; input.value = ''; render(true); input.focus(); });
    root.querySelector('[data-enhanced-only]').hidden = false;
    catalogControllers.push(() => render());
    render();
  }
  renderReading();

  const progress = document.getElementById('reading-progress');
  let scrollFrame;
  const updateScroll = () => {
    scrollFrame = undefined;
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.value = distance > 0 ? Math.max(0, Math.min(100, scrollY / distance * 100)) : 0;
    document.querySelector('.masthead').classList.toggle('is-scrolled', scrollY > 8);
  };
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  addEventListener('resize', updateScroll);
  updateScroll();

  if ('IntersectionObserver' in window) {
    const tocLinks = [...document.querySelectorAll('#toc a')];
    const headings = [...document.querySelectorAll('.document h2[id], .document h3[id]')];
    const headingObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      const hash = `#${encodeURIComponent(visible[0].target.id)}`;
      for (const link of tocLinks) {
        if (link.getAttribute('href') === hash) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }, { rootMargin: '-120px 0px -55% 0px' });
    headings.forEach(heading => headingObserver.observe(heading));
    const reveals = [...document.querySelectorAll('[data-reveal], .section-heading, .track-card, .progression-grid li')];
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    if (!reducedMotion.matches) {
      reveals.forEach(node => { node.classList.add('reveal-pending'); revealObserver.observe(node); });
    }
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        revealObserver.disconnect();
        reveals.forEach(node => node.classList.remove('reveal-pending'));
      }
    });
    const counterObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        counterObserver.unobserve(entry.target);
        const total = Number(entry.target.dataset.counter);
        if (reducedMotion.matches || !Number.isFinite(total)) continue;
        const started = performance.now();
        const tick = now => {
          const fraction = Math.min(1, (now - started) / 650);
          entry.target.textContent = format.format(Math.round(total * (1 - (1 - fraction) ** 3)));
          if (fraction < 1 && !document.hidden && !reducedMotion.matches) requestAnimationFrame(tick);
          else entry.target.textContent = format.format(total);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-counter]').forEach(node => counterObserver.observe(node));
    addEventListener('pagehide', event => {
      if (!event.persisted) {
        headingObserver.disconnect();
        revealObserver.disconnect();
        counterObserver.disconnect();
      }
    });
  }
  for (const details of document.querySelectorAll('[data-workflow-step]')) {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      for (const other of document.querySelectorAll('[data-workflow-step]')) if (other !== details) other.open = false;
    });
  }
}
