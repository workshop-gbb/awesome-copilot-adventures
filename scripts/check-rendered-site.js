const fs = require('node:fs');
const path = require('node:path');
const { basePath, locales } = require('./site-content');
const { site: siteOrigin, maintainer } = require('../site.config.json');
const labels = require('./site-ui.json');
const { loadAdventureMedia, loadHandsOnMedia } = require('./site-media');

function decodeHtml(value) {
  return value.replace(/&#x([0-9a-f]+);|&#([0-9]+);|&(amp|quot|apos|lt|gt);/gi, (all, hex, decimal, name) => {
    if (hex || decimal) return String.fromCodePoint(Number.parseInt(hex || decimal, hex ? 16 : 10));
    return { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' }[name.toLowerCase()];
  });
}

function htmlAttributes(text) {
  return new Map([...text.matchAll(/(?:^|\s)([a-z_:][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi)]
    .map(([, name, doubleQuoted, singleQuoted, unquoted]) =>
      [name.toLowerCase(), decodeHtml(doubleQuoted ?? singleQuoted ?? unquoted ?? '')]));
}

function adventureVideoErrors(rendered) {
  const videos = [...rendered.matchAll(/<video\b([^>]*)>([\s\S]*?)<\/video>/g)]
    .filter(([, attributes]) => htmlAttributes(attributes).has('data-adventure-video'));
  if (!videos.length) return [];
  const failures = [];
  const ids = new Set([...rendered.matchAll(/\sid=(["'])(.*?)\1/g)].map(([, , id]) => decodeHtml(id)));
  const cards = [...rendered.matchAll(/<figure\b([^>]*)>([\s\S]*?)<\/figure>/g)]
    .filter(([, attributes]) => htmlAttributes(attributes).has('data-adventure-film'));
  const gallery = [...rendered.matchAll(/<section\b([^>]*)>/g)]
    .map(([, attributes]) => htmlAttributes(attributes)).find(attributes => attributes.has('data-adventure-films'));
  if (!['data-video-error', 'data-video-playing', 'data-video-paused'].every(name => gallery?.get(name)?.trim())) {
    failures.push('adventure films must provide localized playback and error announcements');
  }
  for (const [videoMarkup, attributes, children] of videos) {
    const video = htmlAttributes(attributes);
    if (['autoplay', 'src', 'controls'].some(name => video.has(name))
      || /<source\b[^>]*\ssrc\s*=/.test(children)
      || video.get('preload') !== 'none' || video.get('aria-hidden') !== 'true'
      || !video.get('poster')?.trim() || !video.get('data-video-src')?.trim()
      || !['muted', 'playsinline'].every(name => video.has(name))) {
      failures.push('adventure video must be interaction-loaded, muted and poster-backed, without native controls');
    }
    const card = cards.find(([, , body]) => body.includes(videoMarkup))?.[2] || '';
    const button = [...card.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)]
      .find(([, attributes, body]) => htmlAttributes(attributes).has('data-film-trigger') && body.includes(videoMarkup));
    const trigger = htmlAttributes(button?.[1] || '');
    const descriptions = (trigger.get('aria-describedby') || '').trim().split(/\s+/).filter(Boolean);
    if (trigger.get('type') !== 'button' || trigger.get('aria-pressed') !== 'false'
      || !trigger.get('aria-label')?.trim() || trigger.get('aria-hidden') === 'true'
      || ['disabled', 'hidden'].some(name => trigger.has(name))
      || descriptions.length < 2 || !descriptions.includes('film-motion-note')
      || !descriptions.every(id => ids.has(id))) {
      failures.push('adventure video must have a named, described and operable integrated toggle');
    }
    const poster = [...(button?.[2] || '').matchAll(/<img\b([^>]*)>/g)]
      .map(([, attributes]) => htmlAttributes(attributes)).find(attributes => attributes.has('data-film-poster'));
    if (!poster?.get('alt')?.trim() || poster.get('src') !== video.get('poster')) {
      failures.push('adventure video must retain its matching still image and alternative text');
    }
    const links = [...card.matchAll(/<a\b([^>]*)>/g)].map(([, attributes]) => htmlAttributes(attributes));
    const status = [...card.matchAll(/<p\b([^>]*)>/g)]
      .map(([, attributes]) => htmlAttributes(attributes)).find(attributes => attributes.has('data-film-status'));
    if (!links.some(link => link.get('href') === video.get('data-video-src')) || status?.get('role') !== 'status') {
      failures.push('adventure video must retain a direct file link and accessible playback status');
    }
  }
  return failures;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink in the built site: ${file}`);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function verifyRenderedSite(directory, selectedLocales = locales) {
  const builtRoot = path.resolve(directory);
  const allFiles = walk(builtRoot);
  const files = new Set(allFiles.map(file => path.relative(builtRoot, file).split(path.sep).join('/')));
  const sources = JSON.parse(fs.readFileSync(path.join(builtRoot, 'site-data/sources.json'), 'utf8'));
  const sourcePaths = new Set(sources.map(entry => entry.path));
  const sourceByPath = new Map(sources.map(entry => [entry.path, entry]));
  const adventureMedia = loadAdventureMedia();
  const handsOnMedia = loadHandsOnMedia();
  const mediaUrl = source => {
    const entry = sourceByPath.get(source);
    if (!entry) throw new Error(`Missing published media source: ${source}`);
    return `${basePath}/site-data/media/${entry.hash}${path.extname(source)}`;
  };
  const htmlFiles = allFiles.filter(file => file.endsWith('.html'));
  const idCache = new Map();
  const failures = [];
  let linkCount = 0;
  const localPage = pathname => {
    const name = decodeURIComponent(pathname).replace(/^\//, '');
    return [name, `${name.replace(/\/$/, '')}/index.html`, `${name}.html`].find(file => files.has(file));
  };

  for (const file of htmlFiles) {
    const name = path.relative(builtRoot, file).split(path.sep).join('/');
    const content = fs.readFileSync(file, 'utf8');
    const pagePath = `${basePath}/${name.replace(/index\.html$/, '')}`;
    const currentLocale = name.split('/')[0];
    if (selectedLocales.includes(currentLocale)) {
      const expectedTag = currentLocale === 'pt-br' ? 'pt-BR' : currentLocale;
      if (!content.includes(`<html lang="${expectedTag}"`)) failures.push(`${name}: wrong document language`);
      if (!content.includes('id="main"')) failures.push(`${name}: missing main landmark target`);
      if (!/<h1[ >]/.test(content)) failures.push(`${name}: missing primary heading`);
      const footer = decodeHtml(content.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1] || '');
      for (const text of [maintainer.name, maintainer.handle, labels[currentLocale].maintainedBy, labels[currentLocale].creditsEvolution]) {
        if (!footer.includes(text)) failures.push(`${name}: missing localized footer credit ${text}`);
      }
      for (const url of [
        maintainer.profile, maintainer.website, `${basePath}/${currentLocale}/read/notice/`,
        'https://github.com/microsoft/CopilotAdventures',
        'https://github.com/MicrosoftLearning/mslearn-github-copilot-dev'
      ]) {
        if (!footer.includes(`href="${url}"`)) failures.push(`${name}: missing footer link ${url}`);
      }
    }
    const rendered = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    if (selectedLocales.includes(currentLocale) && name === `${currentLocale}/index.html`) {
      const main = rendered.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
      if (!main.includes(`href="${basePath}/${currentLocale}/prerequisites/"`)) {
        failures.push(`${name}: missing prerequisites link in the homepage learning path`);
      }
    }
    if (selectedLocales.includes(currentLocale)) {
      if ([`${currentLocale}/index.html`, `${currentLocale}/adventures/index.html`].includes(name)) {
        const videos = [...rendered.matchAll(/<video\b[^>]*\bdata-adventure-video\b[^>]*>/g)];
        if (videos.length !== adventureMedia.films.length) failures.push(`${name}: missing adventure films`);
        const triggers = [...rendered.matchAll(/<button\b[^>]*\bdata-film-trigger\b[^>]*>/g)];
        if (triggers.length !== adventureMedia.films.length) failures.push(`${name}: missing integrated film interactions`);
        for (const film of adventureMedia.films) {
          if (!rendered.includes(`data-video-src="${mediaUrl(film.source)}"`)
            || !rendered.includes(`poster="${mediaUrl(film.poster)}"`)) {
            failures.push(`${name}: missing published film or poster: ${film.id}`);
          }
        }
      }
      const handsOnId = name.match(/^[^/]+\/hands-on\/([^/]+)\/index\.html$/)?.[1];
      const adventureSlug = name.match(/^[^/]+\/adventures\/[^/]+\/([^/]+)\/index\.html$/)?.[1];
      const cover = handsOnId ? handsOnMedia.covers.find(entry => entry.id === handsOnId)
        : adventureMedia.covers.find(entry => entry.slug === adventureSlug);
      if (cover) {
        const article = rendered.match(/<article\b[^>]*class="document"[^>]*>([\s\S]*?)<\/article>/)?.[1] || '';
        const image = article.match(/<img\b[^>]*>/)?.[0] || '';
        if (!image.includes(`src="${mediaUrl(cover.source)}"`) || !/\balt="[^"]+"/.test(image)) {
          failures.push(`${name}: first lesson image must be its new cover with alternative text`);
        }
        const conceptSource = handsOnId ? `assets/images/hands-on/${handsOnId}.svg`
          : `assets/images/adventures/${adventureSlug}-hero.svg`;
        const concept = sourceByPath.get(conceptSource)?.previews?.[currentLocale]?.url;
        const details = [...article.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)];
        if (!concept || !details.some(([, body]) => body.includes(`src="${concept}"`))) {
          failures.push(`${name}: missing expandable localized concept illustration`);
        }
      }
    }
    if (selectedLocales.includes(currentLocale) && name === `${currentLocale}/prerequisites/index.html`) {
      const article = rendered.match(/<article\b[^>]*class="document"[^>]*>([\s\S]*?)<\/article>/)?.[1];
      if (!article) failures.push(`${name}: missing prerequisites article`);
      for (const [, attributes] of (article || '').matchAll(/<a\b([^>]+)>/g)) {
        const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
        if (!href || !/^https?:\/\//.test(href)) continue;
        if (!/\btarget="_blank"/.test(attributes)
          || !/\brel="[^"]*\bnoopener\b[^"]*"/.test(attributes)
          || !/\brel="[^"]*\bnoreferrer\b[^"]*"/.test(attributes)) {
          failures.push(`${name}: external prerequisite link must open safely in a new tab: ${href}`);
        }
      }
    }
    failures.push(...adventureVideoErrors(rendered).map(error => `${name}: ${error}`));
    for (const match of rendered.matchAll(/\b(href|src|poster|data-video-src)=(["'])([\s\S]*?)\2/g)) {
      const target = decodeHtml(match[3]);
      if (/^(data:|blob:|mailto:|tel:)/i.test(target)) continue;
      const url = new URL(target, `${siteOrigin}${pagePath}`);
      if (url.origin !== siteOrigin) continue;
      if (!url.pathname.startsWith(`${basePath}/`) && url.pathname !== basePath) {
        failures.push(`${name}: URL lost the project base path: ${target}`);
        continue;
      }
      const destination = localPage(url.pathname.slice(basePath.length));
      const targetLocale = url.pathname.slice(basePath.length).split('/')[1];
      if (locales.includes(targetLocale) && !selectedLocales.includes(targetLocale)) continue;
      if (!destination) {
        failures.push(`${name}: missing rendered target ${target}`);
        continue;
      }
      linkCount++;
      const sourcePath = url.searchParams.get('path');
      if (sourcePath && url.pathname.endsWith('/repository/') && !sourcePaths.has(sourcePath)
        && !sources.some(entry => entry.path.startsWith(`${sourcePath.replace(/\/$/, '')}/`))) {
        failures.push(`${name}: unknown source path ${sourcePath}`);
      }
      if (url.hash && destination.endsWith('.html')) {
        if (!idCache.has(destination)) {
          const html = fs.readFileSync(path.join(builtRoot, destination), 'utf8');
          idCache.set(destination, new Set([...html.matchAll(/\b(?:id|name)=(["'])(.*?)\1/g)].map(match => decodeHtml(match[2]))));
        }
        if (!idCache.get(destination).has(decodeURIComponent(url.hash.slice(1)))) {
          failures.push(`${name}: missing rendered fragment ${target}`);
        }
      }
    }
  }
  for (const locale of selectedLocales) {
    if (!files.has(`${locale}/index.html`)) failures.push(`Missing ${locale} homepage`);
    if (!files.has(`${locale}/library/index.html`)) failures.push(`Missing ${locale} complete library`);
    if (!files.has(`${locale}/repository/index.html`)) failures.push(`Missing ${locale} repository explorer`);
    if (!files.has(`${locale}/prerequisites/index.html`)) failures.push(`Missing ${locale} prerequisites guide`);
    const searchFile = path.join(builtRoot, `site-data/search-${locale}.json`);
    if (!fs.existsSync(searchFile)) { failures.push(`Missing ${locale} search index`); continue; }
    for (const record of JSON.parse(fs.readFileSync(searchFile, 'utf8'))) {
      const url = new URL(record.url, siteOrigin);
      if (!localPage(url.pathname.slice(basePath.length))) failures.push(`Search ${locale}: missing ${record.url}`);
    }
  }
  if (failures.length) throw new Error(`Rendered site errors (${failures.length}):\n${failures.join('\n')}`);
  return { pages: htmlFiles.length, links: linkCount, locales: selectedLocales, sources: sources.length };
}

if (require.main === module) {
  try {
    const directory = process.argv[2];
    if (!directory) throw new Error('Provide the existing Astro output directory.');
    const locale = process.argv.find(argument => argument.startsWith('--locale='))?.split('=')[1];
    if (locale && !locales.includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
    console.log(JSON.stringify(verifyRenderedSite(directory, locale ? [locale] : locales), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { decodeHtml, adventureVideoErrors, verifyRenderedSite };
