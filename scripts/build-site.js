const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {
  root, locales, basePath, relative, siteSources, ownedSourcePath, publishedSitePath,
  pages, translationSegments, loadTranslations
} = require('./site-content');
const ui = require('./site-ui.json');
const { themeFrontmatter, checkDiagram } = require('./check-diagrams');
const { fencedBlocks, withoutCodeBlocks } = require('./markdown-helpers');
const { mediaImages, renderMedia, loadAdventureMedia, loadHandsOnMedia } = require('./site-media');

function html(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function mediaUrl(source) {
  return `${basePath}/site-data/media/${sha256(readSource(path.join(root, source)))}${path.extname(source).toLowerCase()}`;
}

function localizedUrl(locale, route) {
  return `${basePath}/${locale}${route}`;
}

function explorerUrl(locale, source = '') {
  return `${localizedUrl(locale, '/repository/')}${source ? `?path=${encodeURIComponent(source)}` : ''}`;
}

function linkTargets(text) {
  return [...text.matchAll(/!?\[[^\]]*]\(([^)\n]+)\)|\b(?:src|href)="([^"]+)"/g)]
    .map(match => match[1] || match[2]).sort();
}

function inlineCode(text) {
  return [...text.matchAll(/(`+)([^\n]*?)\1/g)].map(match => match[0]).sort();
}

function structureTokens(text) {
  return {
    alerts: [...text.matchAll(/\[![A-Z]+]/g)].map(match => match[0]),
    headings: [...text.matchAll(/^(#{1,6})[ \t]+/gm)].map(match => match[1]),
    checkboxes: [...text.matchAll(/^[ \t]*[-*] \[[ xX]\]/gm)].map(match => match[0].trim()),
    tableColumns: text.split('\n').filter(line => line.trim().startsWith('|'))
      .map(line => [...line.matchAll(/(?<!\\)\|/g)].length),
    numbers: [...text.matchAll(/\b\d+(?:[.:-]\d+)*\b/g)].map(match => match[0])
  };
}

function validateTranslations(segments, locale, dictionary) {
  const failures = [];
  for (const segment of segments) {
    const text = dictionary[segment.id];
    if (typeof text !== 'string' || !text.trim()) {
      failures.push(`${segment.id}: missing ${segment.kind} (${segment.sources[0]})`);
      continue;
    }
    if (segment.kind !== 'diagram') {
      for (const [label, extract] of [['link targets', linkTargets], ['inline code', inlineCode], ['protected structure', structureTokens]]) {
        if (JSON.stringify(extract(text)) !== JSON.stringify(extract(segment.text))) {
          failures.push(`${segment.id}: changed ${label} (${segment.sources[0]})`);
        }
      }
    }
  }
  if (failures.length) throw new Error(`${locale} translation errors:\n${failures.join('\n')}`);
}

function headingSlug(text) {
  return text.replace(/<[^>]*>/g, '').replace(/!?\[([^\]]+)]\([^)]+\)/g, '$1')
    .toLowerCase().replace(/[^\p{L}\p{N}_ -]/gu, '').replace(/ /g, '-').replace(/^[-_]+/, '') || 'section';
}

function retainHeadingAnchors(original, translated, used) {
  const headings = [...original.matchAll(/^(#{1,6})[ \t]+(.+)$/gm)];
  let index = 0;
  const result = translated.replace(/^(#{1,6})[ \t]+(.+)$/gm, (line, level) => {
    const heading = headings[index++];
    if (!heading || level !== heading[1]) throw new Error('Translation changed the heading structure.');
    const base = headingSlug(heading[2]);
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return `${line} {#${base}${count ? `-${count}` : ''}}`;
  });
  if (index !== headings.length) throw new Error('Translation omitted a heading.');
  return result;
}

function translation(text, id, locale, dictionary) {
  if (locale === 'en') return text;
  const translated = dictionary[id];
  if (typeof translated !== 'string' || !translated.trim()) throw new Error(`Missing ${locale} translation: ${id}`);
  return text.match(/^\s*/)[0] + translated.trim() + text.match(/\s*$/)[0];
}

function createLinkResolver(documents, sources, mediaPreviews = new Map()) {
  const bySource = new Map(documents.map(page => [page.source, page]));
  const byRoute = new Map(documents.map(page => [page.route, page]));
  const sourceSet = new Set(sources.map(relative));
  const directories = new Set();
  for (const name of sourceSet) {
    let directory = path.posix.dirname(name);
    while (directory !== '.') {
      directories.add(directory);
      directory = path.posix.dirname(directory);
    }
  }

  return function resolve(target, from, locale, image = false) {
    let destination = target.trim();
    const title = destination.match(/\s+(["']).*\1$/)?.[0] || '';
    if (title) destination = destination.slice(0, -title.length);
    if (destination.startsWith('<') && destination.endsWith('>')) destination = destination.slice(1, -1);
    if (/^(#|mailto:|tel:|data:)/i.test(destination)) return target;
    const owned = ownedSourcePath(destination);
    const published = publishedSitePath(destination);
    if (/^https?:\/\//.test(destination) && owned === null && published === null) return target;
    if (owned !== null) destination = `/${owned}`;
    if (published !== null) destination = published;
    destination = destination.replace(/^\{\{\s*site\.baseurl\s*\}\}/, '');
    const parts = destination.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    if (!parts) throw new Error(`Invalid link in ${from}: ${target}`);
    const [, filePart, query = '', fragment = ''] = parts;
    const decoded = decodeURIComponent(filePart);
    const targetLocale = decoded.split('/')[1];
    if (decoded.startsWith('/') && locales.includes(targetLocale)) {
      const route = decoded.slice(targetLocale.length + 1) || '/';
      if (byRoute.has(route) || ['/library/', '/repository/', '/404/'].includes(route)) {
        return localizedUrl(targetLocale, route) + query + fragment + title;
      }
      throw new Error(`Unknown localized route in ${from}: ${target}`);
    }
    if (byRoute.has(decoded)) return localizedUrl(locale, byRoute.get(decoded).route) + query + fragment + title;
    const source = decoded.startsWith('/')
      ? path.posix.normalize(decoded.slice(1))
      : path.posix.normalize(path.posix.join(path.posix.dirname(from), decoded));
    if (!source || source === '.') return explorerUrl(locale) + title;
    if (source === '..' || source.startsWith('../')) throw new Error(`Link escapes the repository in ${from}: ${target}`);
    const cleanSource = source.replace(/\/$/, '');
    const document = bySource.get(cleanSource) || ['index.md', 'README.md', 'readme.md']
      .map(name => bySource.get(`${cleanSource}/${name}`)).find(Boolean);
    if (document && !image) return localizedUrl(locale, document.route) + query + fragment + title;
    if (!image && cleanSource.startsWith('assets/lab-kits/') && sourceSet.has(cleanSource)) {
      return `${basePath}/${cleanSource}${title}`;
    }
    if (image && sourceSet.has(cleanSource)) {
      const preview = mediaPreviews.get(cleanSource)?.[locale];
      if (preview) return preview.url + title;
      // Media keeps a real extension for native image rendering; original bytes are also in the archive.
      return mediaUrl(cleanSource) + title;
    }
    if (sourceSet.has(cleanSource) || directories.has(cleanSource)) return explorerUrl(locale, cleanSource) + title;
    throw new Error(`Unresolved site link in ${from}: ${target}`);
  };
}

function rewriteLinks(text, from, locale, resolve) {
  return text
    .replace(/(!?\[[^\]]*]\()([^)\n]+)(\))/g, (all, before, target, after) =>
      before + resolve(target, from, locale, before.startsWith('!')) + after)
    .replace(/\b(src|href)="([^"]+)"/g, (all, attribute, target) =>
      `${attribute}="${resolve(target, from, locale, attribute === 'src')}"`);
}

function renderDocument(page, locale, dictionary, resolve) {
  const used = new Map();
  let markdown = page.tokens.map(token => {
    if (token.kind === 'code' || token.kind === 'space') return token.text;
    const translated = translation(token.text, token.id, locale, dictionary);
    if (token.kind === 'diagram') return `\`\`\`mermaid\n${themeFrontmatter()}\n${translated}\n\`\`\``;
    return rewriteLinks(retainHeadingAnchors(token.text, translated, used), page.source, locale, resolve);
  }).join('');
  if (!/^#\s+|<h1\b/m.test(withoutCodeBlocks(markdown))) {
    markdown = `# ${translation(page.title, page.titleId, locale, dictionary)} {#document-title}\n\n${markdown}`;
  }
  for (const block of fencedBlocks(markdown).filter(block => block.language === 'mermaid')) {
    const failures = checkDiagram(block, markdown);
    if (failures.length) throw new Error(`${locale}:${page.source}: ${failures.join('; ')}`);
  }
  return markdown;
}

function frontmatter(metadata) {
  return `---\n${Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n`;
}

function sourceMime(name) {
  return ({
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav', '.pdf': 'application/pdf', '.zip': 'application/zip'
  })[path.extname(name).toLowerCase()] || 'application/octet-stream';
}

function textPreview(buffer) {
  if (buffer.includes(0)) return false;
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    return true;
  } catch (error) {
    if (error instanceof TypeError) return false;
    throw error;
  }
}

function readSource(file) {
  const bytes = fs.readFileSync(file);
  // Match the repository's text=auto eol=lf rule across clones and local worktrees.
  return textPreview(bytes) ? Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')) : bytes;
}

function buildArtifacts(selectedLocales = locales) {
  const documents = pages();
  const sources = siteSources();
  const adventureMedia = loadAdventureMedia(sources);
  loadHandsOnMedia(sources);
  const publishedFilms = new Set(adventureMedia.films.map(film => film.source));
  const images = mediaImages(sources);
  const segments = translationSegments(documents, images);
  const routes = new Set();
  for (const page of documents) {
    if (routes.has(page.route)) throw new Error(`Duplicate document route: ${page.route}`);
    routes.add(page.route);
  }
  const artifacts = new Map();
  const dictionaries = new Map(selectedLocales.map(locale => {
    const dictionary = loadTranslations(locale);
    if (locale !== 'en') validateTranslations(segments, locale, dictionary);
    return [locale, dictionary];
  }));
  const mediaPreviews = new Map(images.map(image => [image.source, Object.fromEntries(selectedLocales.map(locale => {
    const { bytes, title, description } = renderMedia(image, locale, dictionaries.get(locale));
    const url = `${basePath}/site-data/media/${sha256(bytes)}.svg`;
    artifacts.set(`site-generated/public${url.slice(basePath.length)}`, bytes);
    return [locale, { url, title, description }];
  }))]));
  const resolve = createLinkResolver(documents, sources, mediaPreviews);
  const manifest = [];
  const bySource = new Map(documents.map(page => [page.source, page]));
  for (const file of sources) {
    const name = relative(file);
    const bytes = readSource(file);
    const hash = sha256(bytes);
    const object = { encoding: 'base64', content: bytes.toString('base64'), sha256: hash };
    artifacts.set(`site-generated/public/site-data/objects/${hash}.json`, JSON.stringify(object));
    const mime = sourceMime(name);
    if (name.startsWith('assets/site/fonts/') && name.endsWith('.txt')) artifacts.set(`site-generated/public/${name}`, bytes);
    if (mime.startsWith('image/') || publishedFilms.has(name)) {
      artifacts.set(`site-generated/public/site-data/media/${hash}${path.extname(name).toLowerCase()}`, bytes);
    }
    if (name.startsWith('assets/lab-kits/')) artifacts.set(`site-generated/public/${name}`, bytes);
    manifest.push({
      path: name, size: bytes.length, hash, text: textPreview(bytes), mime,
      legacy: name.startsWith('legacy/') || name.startsWith('assets/images/legacy/'),
      previews: mediaPreviews.get(name),
      read: bySource.get(name)?.route || null
    });
  }
  artifacts.set('site-generated/public/site-data/sources.json', JSON.stringify(manifest));
  const data = {
    revision: sha256(JSON.stringify(manifest)).slice(0, 16),
    sourceCount: sources.length,
    documentCount: documents.length,
    adventureCount: documents.filter(page => page.source.startsWith('adventures/') && page.source.endsWith('/README.md')).length,
    handsOnCount: documents.filter(page => page.group === 'hands-on').length,
    guideCount: documents.filter(page => page.group === 'guides').length,
    adventureFilms: adventureMedia.films.map(film => ({
      id: film.id, url: mediaUrl(film.source), poster: mediaUrl(film.poster),
      original: film.original, width: film.width, height: film.height, duration: film.duration
    })),
    locales: {}
  };
  for (const locale of selectedLocales) {
    const dictionary = dictionaries.get(locale);
    const catalog = [];
    const search = [];
    for (const page of documents) {
      const title = translation(page.title, page.titleId, locale, dictionary);
      const markdown = renderDocument(page, locale, dictionary, resolve);
      const url = localizedUrl(locale, page.route);
      const alternates = Object.fromEntries(locales.map(language => [language, localizedUrl(language, page.route)]));
      const metadata = {
        locale, title, route: page.route,
        source: page.source, group: page.group, verified: page.verified,
        home: page.route === '/', alternates
      };
      // Briefing fields are optional: only lessons that declare them carry them into the page.
      if (page.capability) metadata.capability = translation(page.capability, page.capabilityId, locale, dictionary);
      if (page.status) metadata.status = page.status;
      if (page.level) metadata.level = page.level;
      if (page.duration) metadata.duration = page.duration;
      if (page.difficulty) metadata.difficulty = page.difficulty;
      artifacts.set(`site-generated/content/${locale}/${sha256(page.source).slice(0, 16)}.md`,
        frontmatter(metadata) + markdown);
      const image = markdown.match(/!\[[^\]]*]\(([^)\n]*\/site-data\/media\/[^)\n]+)\)/)?.[1] || null;
      catalog.push({
        title, url, source: page.source, group: page.group, route: page.route, labId: page.labId, image,
        navigationOrder: page.navigationOrder, navigationSection: page.navigationSection,
        navigationHidden: page.navigationHidden
      });
      const plain = withoutCodeBlocks(markdown).replace(/\{#[^}]*}/g, '').replace(/<[^>]*>/g, '')
        .replace(/!?\[([^\]]*)]\([^)]+\)/g, '$1').replace(/[#*`|>]/g, '').replace(/\s+/g, ' ').trim();
      search.push({ title, url, group: page.group, text: plain });
    }
    const href = Object.fromEntries([
      ['home', '/'], ['start', '/start-here/'], ['prerequisites', '/prerequisites/'], ['curriculum', '/curriculum/'],
      ['learningPath', '/learning-path/'], ['downloads', '/downloads/'], ['simulations', '/simulations/'],
      ['adventures', '/adventures/'], ['handsOn', '/hands-on/'], ['repository', '/repository/'],
      ['library', '/library/'], ['harness', '/harnesses/'], ['status', '/feature-status/'],
      ['glossary', '/glossary/'], ['design', '/design-system/'], ['support', '/read/support/'],
      ['credits', '/read/notice/']
    ].map(([key, route]) => [key, localizedUrl(locale, route)]));
    data.locales[locale] = { ui: ui[locale], catalog, href };
    for (const source of manifest) {
      search.push({
        title: source.path, url: explorerUrl(locale, source.path),
        group: 'source', text: source.path, original: true
      });
    }
    artifacts.set(`site-generated/public/site-data/search-${locale}.json`, JSON.stringify(search));
  }
  artifacts.set('site-generated/site.json', JSON.stringify(data, null, 2));
  artifacts.set('site-generated/redirects.json', JSON.stringify(documents
    .filter(page => !page.route.startsWith('/read/')).map(page => page.route)));
  artifacts.set('site-generated/public/.nojekyll', '');
  return { artifacts, data, documents, manifest };
}

function generatedFiles() {
  function walk(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
      const file = path.join(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink in generated output: ${file}`);
      return entry.isDirectory() ? walk(file) : [relative(file)];
    });
  }
  return walk(path.join(root, 'site-generated'));
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const validate = args.includes('--validate');
  const locale = args.find(argument => argument.startsWith('--locale='))?.split('=')[1];
  if (locale && !locales.includes(locale)) throw new Error(`Unsupported locale: ${locale}`);
  const selected = locale ? [locale] : locales;
  const { artifacts, data } = buildArtifacts(selected);
  const stale = generatedFiles().filter(file => !artifacts.has(file));
  const changed = [];
  for (const [name, content] of artifacts) {
    const file = path.join(root, name);
    const bytes = Buffer.from(content);
    if (fs.existsSync(file) && fs.readFileSync(file).equals(bytes)) continue;
    changed.push(name);
    if (!check && !validate) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, bytes);
    }
  }
  if (check && (changed.length || stale.length)) {
    throw new Error(`Publication is stale: ${changed.length} changed/missing, ${stale.length} obsolete files. Run npm run build:site.`);
  }
  if (!check && !validate) for (const name of stale) fs.unlinkSync(path.join(root, name));
  console.log(`${check || validate ? 'Verified' : 'Generated'} ${selected.join(', ')}: ${data.documentCount} learning documents, ${data.sourceCount} source files, revision ${data.revision}.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Site generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = {
  html, localizedUrl, explorerUrl, linkTargets, inlineCode, structureTokens, validateTranslations,
  headingSlug, retainHeadingAnchors, createLinkResolver, renderDocument,
  textPreview, readSource, rewriteLinks, buildArtifacts
};
