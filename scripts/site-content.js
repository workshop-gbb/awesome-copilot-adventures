const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { root, repositoryFiles } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');
const { mediaImages } = require('./site-media');
const settings = require('../site.config.json');
const handsOnOrder = new Map(require('../mslearn-github-copilot/catalog.json').labs.map((lab, index) => [lab.id, index]));

const locales = settings.locales;
const generatedRoots = ['site-generated/', 'site-pages/', 'site-data/', '.astro/'];
const sourceUrl = `https://github.com/${settings.repository}`;
const basePath = settings.base;
const previousRepository = 'https://github.com/paulasilvatech/awesome-copilot-adventures';
const previousSite = 'https://paulasilvatech.github.io';

function ownedSourcePath(target) {
  for (const repository of [sourceUrl, previousRepository]) {
    for (const kind of ['blob', 'tree']) {
      const prefix = `${repository}/${kind}/main/`;
      if (target.startsWith(prefix)) return target.slice(prefix.length);
    }
  }
  return null;
}

function publishedSitePath(target) {
  for (const origin of [settings.site, previousSite]) {
    const prefix = `${origin}${basePath}`;
    if (target.startsWith(`${prefix}/`)) return target.slice(prefix.length);
  }
  return null;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function siteSources() {
  if (!fs.existsSync(path.join(root, '.git'))) {
    throw new Error('Site publication requires a Git checkout so ignored private/local files are not archived.');
  }
  return repositoryFiles().filter(file => {
    const name = relative(file);
    return name !== '_data/site.json' && !generatedRoots.some(prefix => name.startsWith(prefix));
  });
}

function splitFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return match ? { metadata: match[1], body: text.slice(match[0].length) } : { metadata: '', body: text };
}

function scalar(metadata, key) {
  const value = metadata.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim();
  if (!value) return '';
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'") && value.endsWith("'")) return value.slice(1, -1).replaceAll("''", "'");
  return value;
}

function plainTitle(text) {
  return text.replace(/<[^>]+>/g, '').replace(/[*`]/g, '').replace(/^#+\s*/, '').trim();
}

function digest(text) {
  return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16);
}

function translatable(file) {
  const name = relative(file);
  if (!name.toLowerCase().endsWith('.md')) return false;
  if (name.startsWith('legacy/') || name.startsWith('.github/') || name === 'AGENTS.md') return false;
  // The supplied component kit is source reference material, not curriculum prose.
  if (name.startsWith('docs/design-system/')) return false;
  if (/\/(?:starter\/)?\.github\//.test(name)) return false;
  if (/\/reference\/.*\.(?:agent|prompt)\.md$/.test(name)) return false;
  if (name === 'docs/404.md') return false;
  if (name.startsWith('mslearn-github-copilot/.github/')) return false;
  return true;
}

function groupFor(name) {
  if (name.startsWith('adventures/')) return 'adventures';
  if (name.startsWith('mslearn-github-copilot/Instructions/Labs/LAB_')) return 'hands-on';
  if (name.startsWith('mslearn-github-copilot/Instructions/')) return 'guides';
  if (name.startsWith('labs/') || name.includes('/LabFiles/')) return 'fixtures';
  if (name.startsWith('solutions/')) return 'solutions';
  if (name.startsWith('assets/')) return 'media';
  return 'guides';
}

function pageRoute(name, metadata) {
  const existing = scalar(metadata, 'permalink');
  if (existing) return existing === '/' ? '/' : `/${existing.replace(/^\/|\/$/g, '')}/`;
  const slug = name.replace(/\.md$/i, '').split('/').map(part => encodeURIComponent(part.toLowerCase())).join('/');
  return `/read/${slug}/`;
}

function tokensFor(body) {
  const tokens = [];
  const lines = body.split('\n');
  let cursor = 0;
  function prose(text) {
    for (const block of text.split(/(\n[ \t]*\n)/)) {
      if (!block) continue;
      tokens.push(/^\s*$/.test(block)
        ? { kind: 'space', text: block }
        : { kind: 'prose', text: block, id: digest(block) });
    }
  }
  for (const block of fencedBlocks(body)) {
    prose(lines.slice(cursor, block.start).join('\n') + (cursor < block.start ? '\n' : ''));
    const literal = lines.slice(block.start, block.end + 1).join('\n');
    if (block.language === 'mermaid') {
      const code = splitFrontmatter(block.code);
      tokens.push({
        kind: 'diagram',
        text: code.body,
        id: digest(`diagram:${code.body}`),
        preface: code.metadata ? `---\n${code.metadata}\n---\n` : ''
      });
    } else {
      // Commands, sample prompts, source code and protocol examples remain executable originals.
      tokens.push({ kind: 'code', text: literal });
    }
    if (block.end < lines.length - 1) tokens.push({ kind: 'space', text: '\n' });
    cursor = block.end + 1;
  }
  prose(lines.slice(cursor).join('\n'));
  return tokens;
}

function pages() {
  return siteSources().filter(translatable).map(file => {
    const name = relative(file);
    const original = fs.readFileSync(file, 'utf8');
    const { metadata, body } = splitFrontmatter(original);
    const title = plainTitle(scalar(metadata, 'title') || body.match(/^#\s+(.+)$/m)?.[1]
      || body.match(/<h1\b[^>]*>(.*?)<\/h1>/)?.[1] || path.basename(name, '.md'));
    const route = pageRoute(name, metadata);
    return {
      source: name,
      title,
      titleId: digest(title),
      route,
      group: groupFor(name),
      labId: scalar(metadata, 'lab_id'),
      navigationOrder: handsOnOrder.get(scalar(metadata, 'lab_id')) ?? (Number(scalar(metadata, 'nav_order')) || 1000),
      navigationSection: name.startsWith('adventures/') ? name.split('/')[1] : '',
      navigationHidden: scalar(metadata, 'nav_exclude') === 'true',
      verified: scalar(metadata, 'last_verified'),
      tokens: tokensFor(body),
      sourceHash: digest(original)
    };
  });
}

function translationSegments(documents = pages(), images = mediaImages()) {
  const segments = new Map();
  for (const page of documents) {
    const entries = [{ id: page.titleId, kind: 'title', text: page.title }, ...page.tokens.filter(token => token.id)];
    for (const entry of entries) {
      if (!segments.has(entry.id)) segments.set(entry.id, { id: entry.id, kind: entry.kind, text: entry.text, sources: [] });
      segments.get(entry.id).sources.push(page.source);
    }
  }
  for (const image of images) {
    for (const { id, kind, text } of image.tokens) {
      if (!segments.has(id)) segments.set(id, { id, kind, text, sources: [] });
      segments.get(id).sources.push(image.source);
    }
  }
  return [...segments.values()];
}

function loadTranslations(locale) {
  if (locale === 'en') return {};
  const folder = path.join(root, 'site-locales', locale);
  const dictionary = {};
  if (!fs.existsSync(folder)) return dictionary;
  for (const file of fs.readdirSync(folder).filter(name => name.endsWith('.json')).sort()) {
    const entries = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
    for (const [key, value] of Object.entries(entries)) {
      if (typeof value !== 'string' || !value.trim()) throw new Error(`Empty translation: ${locale}/${file}:${key}`);
      if (key in dictionary && dictionary[key] !== value) throw new Error(`Conflicting translation: ${locale}:${key}`);
      dictionary[key] = value;
    }
  }
  return dictionary;
}

module.exports = {
  root, locales, generatedRoots, sourceUrl, basePath, ownedSourcePath, publishedSitePath,
  relative, siteSources, splitFrontmatter, digest, tokensFor,
  pages, translationSegments, loadTranslations
};
