import { searchRecords, resultExcerpt } from './search.mjs';
import { enhanceSite } from './enhancements.js';
import { enhanceMedia } from './media.js';
import { closeOnEscape } from './dialog.mjs';
import { enhanceAdventureFilms } from './adventure-films.js';
import { copyText } from './clipboard.mjs';
import { enhanceScenes } from './scenes.js';

const config = JSON.parse(document.getElementById('site-config').textContent);
const { ui, locale, base } = config;
const repository = `https://github.com/${config.repository}`;
const number = new Intl.NumberFormat(locale);

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

async function json(url, signal) {
  const response = await fetch(url, { signal, credentials: 'same-origin' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.json();
}

function updateLanguageLinks() {
  document.querySelectorAll('a[data-locale]').forEach(link => {
    const url = new URL(link.href);
    url.hash = location.hash;
    url.search = location.search;
    link.href = url.href;
    if (link.dataset.locale === locale) link.setAttribute('aria-current', 'page');
  });
}

function navigation() {
  document.documentElement.dataset.enhanced = 'true';
  document.querySelectorAll('[data-site-control]').forEach(control => { control.hidden = false; });
  const menu = document.querySelector('.menu-button');
  const masthead = document.querySelector('.masthead');
  const mobile = matchMedia('(max-width: 1200px)');
  const setOpen = open => {
    masthead.dataset.menuOpen = String(open);
    menu.setAttribute('aria-expanded', String(open));
  };
  menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
  const mainNavigation = document.getElementById('main-navigation');
  mainNavigation.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('click', event => {
    if (mobile.matches && !masthead.contains(event.target) && menu.getAttribute('aria-expanded') === 'true') setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
  const learningMenu = document.querySelector('[data-learning-menu]');
  if (learningMenu) {
    const small = matchMedia('(max-width: 900px)');
    const setLearningMenu = () => { learningMenu.open = !small.matches; };
    setLearningMenu();
    small.addEventListener('change', setLearningMenu);
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      menu.focus();
    }
  });
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  const theme = document.querySelector('.theme-toggle');
  theme.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
  theme.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.heTheme = next;
    theme.setAttribute('aria-pressed', String(next === 'dark'));
    try {
      localStorage.setItem('aca-theme', next);
    } catch (error) {
      if (!(error instanceof DOMException)) throw error;
      console.warn('Theme preference could not be saved.', error.name);
    }
  });
  if ('ResizeObserver' in window) {
    new ResizeObserver(() => {
      if (menu.getAttribute('aria-expanded') !== 'true') {
        document.documentElement.style.setProperty('--header', `${masthead.offsetHeight}px`);
      }
    }).observe(masthead);
  }
}

function tableOfContents() {
  const toc = document.getElementById('toc');
  if (!toc) return;
  let step = 0;
  for (const heading of document.querySelectorAll('.document h2[id], .document h3[id]')) {
    const link = element('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.dataset.level = heading.tagName.slice(1);
    if (link.dataset.level === '2') {
      step += 1;
      const index = element('span', String(step).padStart(2, '0'), 'toc-index');
      index.setAttribute('aria-hidden', 'true');
      link.append(index);
    }
    link.append(element('span', heading.textContent, 'toc-label'));
    toc.append(link);
  }
  if (!toc.childElementCount) return;
  const rail = toc.closest('.page-toc');
  rail.hidden = false;
  rail.dataset.steps = String(step);
  const progress = element('p', '', 'toc-progress');
  progress.append(element('strong', '00', 'toc-current'), element('span', ` / ${String(step).padStart(2, '0')}`));
  toc.before(progress);
}

function alerts() {
  const labels = {
    en: { NOTE: 'Note', TIP: 'Tip', IMPORTANT: 'Important', WARNING: 'Warning', CAUTION: 'Caution' },
    es: { NOTE: 'Nota', TIP: 'Consejo', IMPORTANT: 'Importante', WARNING: 'Advertencia', CAUTION: 'Precaución' },
    'pt-br': { NOTE: 'Nota', TIP: 'Dica', IMPORTANT: 'Importante', WARNING: 'Aviso', CAUTION: 'Cuidado' }
  };
  for (const quote of document.querySelectorAll('.document blockquote')) {
    const paragraph = quote.querySelector('p');
    const node = paragraph?.firstChild;
    if (node?.nodeType !== Node.TEXT_NODE) continue;
    const match = node.textContent.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)]\s*/);
    if (!match) continue;
    node.textContent = node.textContent.slice(match[0].length);
    quote.dataset.alert = match[1].toLowerCase();
    quote.prepend(element('strong', labels[locale][match[1]], 'alert-label'));
  }
}

function codeCopy(root = document, selector = '.document pre') {
  for (const pre of root.querySelectorAll(selector)) {
    if (pre.closest('.code-wrapper')) continue;
    const code = pre.querySelector('code');
    if (!code) continue;
    pre.tabIndex = 0;
    const wrapper = element('div', undefined, 'code-wrapper');
    const toolbar = element('div', undefined, 'code-toolbar');
    const languageClass = [...code.classList].find(name => name.startsWith('language-'));
    const language = element('span', languageClass?.slice('language-'.length).toUpperCase() || 'CODE', 'code-language');
    pre.before(wrapper);
    const button = element('button', undefined, 'code-copy');
    button.type = 'button';
    const icon = element('span', '', 'copy-icon');
    icon.setAttribute('aria-hidden', 'true');
    const label = element('span', ui.copy, 'copy-label');
    button.append(icon, label);
    const message = element('span', '', 'copy-message sr-only');
    message.setAttribute('role', 'status');
    let feedbackTimeout;
    button.addEventListener('click', async () => {
      clearTimeout(feedbackTimeout);
      button.disabled = true;
      message.textContent = '';
      message.classList.add('sr-only');
      try {
        await copyText(code.textContent, navigator.clipboard);
        label.textContent = ui.copied;
        button.dataset.copied = 'true';
        message.textContent = ui.copied;
        feedbackTimeout = setTimeout(() => {
          label.textContent = ui.copy;
          delete button.dataset.copied;
          message.textContent = '';
        }, 1500);
      } catch (error) {
        label.textContent = ui.copy;
        delete button.dataset.copied;
        message.classList.remove('sr-only');
        message.textContent = ui.copyError;
        console.error('Code copy failed.', error);
      } finally {
        button.disabled = false;
      }
    });
    toolbar.append(language, button, message);
    wrapper.append(toolbar, pre);
  }
}

async function diagrams() {
  const codeBlocks = [...document.querySelectorAll('code.language-mermaid, .language-mermaid pre code')];
  if (!codeBlocks.length) return;
  const blocks = codeBlocks.map(code => {
    const source = code.textContent;
    const container = code.closest('div.language-mermaid') || code.closest('pre');
    const details = element('details', undefined, 'mermaid-source');
    const pre = element('pre');
    pre.append(element('code', source));
    details.append(element('summary', ui.diagramSource), pre);
    const frame = element('div', undefined, 'mermaid-frame');
    frame.setAttribute('role', 'figure');
    container.replaceWith(frame, details);
    return { source, frame, details };
  });
  let mermaid;
  try {
    ({ default: mermaid } = await import(/* @vite-ignore */ `https://cdn.jsdelivr.net/npm/mermaid@${config.mermaidVersion}/dist/mermaid.esm.min.mjs`));
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, maxTextSize: 50000 });
  } catch (error) {
    for (const block of blocks) {
      block.frame.replaceWith(element('p', ui.diagramError, 'diagram-error'));
      block.details.open = true;
    }
    console.error('Mermaid could not be loaded.', error);
    return;
  }
  for (const [index, block] of blocks.entries()) {
    try {
      const { svg, bindFunctions } = await mermaid.render(`diagram-${index}`, block.source);
      // Mermaid runs in strict mode; repository source is never inserted as raw HTML.
      block.frame.innerHTML = svg;
      const title = block.frame.querySelector('title');
      if (title) block.frame.setAttribute('aria-label', title.textContent);
      if (bindFunctions) bindFunctions(block.frame);
    } catch (error) {
      block.frame.replaceWith(element('p', ui.diagramError, 'diagram-error'));
      block.details.open = true;
      console.error('A Mermaid diagram could not be rendered.', error);
    }
  }
}

function search() {
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const status = document.getElementById('search-status');
  const results = document.getElementById('search-results');
  let records;
  let loading;
  let opener;
  let timer;

  const render = () => {
    if (!records) return;
    results.replaceChildren();
    const matches = searchRecords(records, input.value);
    status.textContent = input.value.trim()
      ? (matches.length ? `${ui.searchResults}: ${number.format(matches.length)}` : ui.searchEmpty) : '';
    for (const record of matches) {
      const item = element('li');
      item.append(element('span', ui[record.group] || ui.original, 'result-type'));
      const link = element('a', record.title);
      link.href = record.url;
      item.append(link, element('p', resultExcerpt(record, input.value)));
      results.append(item);
    }
  };
  const load = async () => {
    if (records) return render();
    if (loading) return loading;
    status.textContent = ui.loading;
    loading = json(`${base}/site-data/search-${locale}.json?v=${config.revision}`).then(value => {
      if (!Array.isArray(value) || value.some(record => typeof record.title !== 'string'
        || typeof record.text !== 'string' || !record.url?.startsWith(`${base}/${locale}/`))) {
        throw new Error('Invalid search index.');
      }
      records = value;
      render();
    }).catch(error => {
      status.textContent = ui.searchError;
      const retry = element('button', ui.retry, 'quiet-button');
      retry.type = 'button';
      retry.addEventListener('click', load);
      status.append(retry);
      console.error('Search index loading failed.', error);
    }).finally(() => { loading = undefined; });
    return loading;
  };
  const open = event => {
    if (dialog.open) return;
    opener = event?.currentTarget || document.activeElement;
    dialog.showModal();
    input.focus();
    void load();
  };
  document.querySelector('.search-trigger').addEventListener('click', open);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    }
  });
  dialog.addEventListener('close', () => opener?.focus());
  closeOnEscape(dialog);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(render, 100);
  });
}

async function sourceExplorer() {
  if (config.kind !== 'repository') return;
  const tree = document.getElementById('source-files');
  const filter = document.getElementById('source-filter');
  const status = document.getElementById('source-status');
  const count = document.getElementById('source-count');
  const content = document.getElementById('source-content');
  const preview = document.getElementById('source-preview');
  const download = document.getElementById('source-download');
  let manifest;
  let selected;
  let objectUrl;
  let controller;
  let downloadedBlob;
  let clearMedia = () => {};

  const currentPath = () => new URLSearchParams(location.search).get('path') || '';
  const showError = (error, retry) => {
    content.hidden = true;
    status.hidden = false;
    status.textContent = ui.sourceError;
    const button = element('button', ui.retry, 'quiet-button source-error-retry');
    button.type = 'button';
    button.addEventListener('click', retry);
    status.append(button);
    console.error('Source explorer request failed.', error);
  };
  const list = () => {
    const query = filter.value.trim().toLowerCase();
    const matches = manifest.filter(entry => entry.path.toLowerCase().includes(query));
    count.textContent = `${number.format(matches.length)} / ${number.format(manifest.length)} ${ui.sourceCount}`;
    tree.replaceChildren();
    if (!matches.length) tree.append(element('p', ui.sourceNoMatches, 'source-meta'));
    const fragment = document.createDocumentFragment();
    for (const entry of matches) {
      const link = element('a', entry.path);
      link.href = `${base}/${locale}/repository/?path=${encodeURIComponent(entry.path)}`;
      link.dataset.path = entry.path;
      if (entry.path === selected?.path) link.setAttribute('aria-current', 'page');
      fragment.append(link);
    }
    tree.append(fragment);
  };

  const select = async name => {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    selected = manifest.find(entry => entry.path === name);
    content.hidden = true;
    status.hidden = false;
    downloadedBlob = undefined;
    download.disabled = true;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    clearMedia();
    preview.replaceChildren();
    list();
    updateLanguageLinks();
    if (!selected) {
      const directory = name && manifest.some(entry => entry.path.startsWith(`${name.replace(/\/$/, '')}/`));
      status.textContent = !name || directory ? ui.sourceSelect : ui.sourceMissing;
      if (directory) { filter.value = name; list(); }
      return;
    }
    const entry = selected;
    status.textContent = ui.loading;
    try {
      const object = await json(`${base}/site-data/objects/${entry.hash}.json`, signal);
      if (object.encoding !== 'base64' || object.sha256 !== entry.hash || typeof object.content !== 'string') {
        throw new Error('Source object does not match the inventory.');
      }
      const bytes = Uint8Array.from(atob(object.content), character => character.charCodeAt(0));
      if (bytes.length !== entry.size) throw new Error('Source size does not match the inventory.');
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const hash = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
      if (hash !== entry.hash) throw new Error('Source integrity check failed.');
      if (signal.aborted) return;
      downloadedBlob = new Blob([bytes], { type: entry.mime });
      objectUrl = URL.createObjectURL(downloadedBlob);
      document.getElementById('source-title').textContent = entry.path;
      document.getElementById('source-details').textContent = `${number.format(entry.size)} ${ui.sourceBytes} · SHA-256 ${entry.hash}`;
      const localizedPreview = entry.previews?.[locale];
      if (entry.previews && !localizedPreview) throw new Error(`Missing ${locale} media preview: ${entry.path}`);
      document.getElementById('source-notice').textContent = entry.legacy ? ui.legacyNotice
        : localizedPreview ? ui.mediaPreviewNotice : ui.sourceNotice;
      const reading = document.getElementById('source-reading');
      reading.hidden = !entry.read;
      if (entry.read) reading.href = `${base}/${locale}${entry.read}`;
      document.getElementById('source-github').href = `${repository}/blob/main/${entry.path.split('/').map(encodeURIComponent).join('/')}`;
      if (entry.mime.startsWith('image/')) {
        const image = element('img');
        image.src = localizedPreview?.url || objectUrl;
        image.alt = localizedPreview?.description || `${ui.source}: ${entry.path}`;
        preview.append(image);
        clearMedia = enhanceMedia(config.media, [image]);
      } else if (entry.mime.startsWith('video/') || entry.mime.startsWith('audio/')) {
        const media = element(entry.mime.startsWith('video/') ? 'video' : 'audio');
        media.controls = true;
        media.playsInline = true;
        media.preload = 'metadata';
        media.src = objectUrl;
        preview.append(media);
      } else if (entry.text) {
        const pre = element('pre', undefined, 'source-preview-code');
        pre.tabIndex = 0;
        pre.append(element('code', new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
        preview.append(pre);
        codeCopy(preview, 'pre');
      } else {
        preview.append(element('p', ui.binaryNotice));
      }
      download.disabled = false;
      content.hidden = false;
      status.hidden = true;
    } catch (error) {
      if (signal.aborted) return;
      showError(error, () => select(entry.path));
    }
  };

  const load = async () => {
    status.textContent = ui.loading;
    try {
      const entries = await json(`${base}/site-data/sources.json?v=${config.revision}`);
      if (!Array.isArray(entries) || entries.some(entry => typeof entry.path !== 'string'
        || !/^[a-f0-9]{64}$/.test(entry.hash) || !Number.isSafeInteger(entry.size) || entry.size < 0)) {
        throw new Error('Invalid source inventory.');
      }
      manifest = entries;
      await select(currentPath());
    } catch (error) {
      showError(error, load);
    }
  };
  filter.addEventListener('input', () => { if (manifest) list(); });
  tree.addEventListener('click', event => {
    const link = event.target.closest('a[data-path]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.pushState(null, '', link.href);
    void select(link.dataset.path);
  });
  window.addEventListener('popstate', () => { if (manifest) void select(currentPath()); });
  download.addEventListener('click', () => {
    if (!downloadedBlob || !selected) {
      status.hidden = false;
      status.textContent = ui.sourceError;
      return;
    }
    const link = element('a');
    link.href = objectUrl;
    link.download = selected.path.split('/').at(-1);
    link.click();
  });
  window.addEventListener('pagehide', event => {
    if (!event.persisted) {
      controller?.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  });
  await load();
}

navigation();
tableOfContents();
alerts();
search();
enhanceSite(config, updateLanguageLinks);
enhanceMedia(config.media);
enhanceAdventureFilms();
enhanceScenes();
void sourceExplorer();
void diagrams();
codeCopy();

if (config.kind === 'not-found') {
  const requestedLocale = location.pathname.slice(base.length).split('/')[1];
  if (['es', 'pt-br'].includes(requestedLocale) && requestedLocale !== locale) {
    location.replace(`${base}/${requestedLocale}/404/`);
  }
}
