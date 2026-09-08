const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { root, repositoryFiles } = require('./repository-files');

const mediaId = text => crypto.createHash('sha256').update(`media:${text}`).digest('hex').slice(0, 16);
const textElements = /<(title|desc|text)\b[^>]*>([^<]*)<\/\1>/g;

function loadAdventureMedia(files = repositoryFiles(), catalog = require('../assets/adventure-media.json')) {
  if (catalog.version !== 1 || !Array.isArray(catalog.covers) || !Array.isArray(catalog.films)) {
    throw new Error('Invalid adventure media catalog.');
  }
  const sources = new Set(files.map(file => path.relative(root, file).split(path.sep).join('/')));
  const ids = new Set();
  const checkFile = (source, pattern) => {
    if (typeof source !== 'string' || !pattern.test(source) || !sources.has(source)) {
      throw new Error(`Missing or unsupported adventure media source: ${source}`);
    }
  };
  const checkId = id => {
    if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || ids.has(id)) {
      throw new Error(`Invalid or duplicate adventure media identifier: ${id}`);
    }
    ids.add(id);
  };
  for (const cover of catalog.covers) {
    checkId(cover.slug);
    checkFile(cover.original, /^assets\/images\/adventures\/[^/]+\.jpe?g$/);
    checkFile(cover.source, /^assets\/images\/adventures\/[a-z0-9-]+-hero\.webp$/);
    if (cover.source !== `assets/images/adventures/${cover.slug}-hero.webp` || cover.width !== 1456 || cover.height !== 832) {
      throw new Error(`Invalid adventure cover metadata: ${cover.slug}`);
    }
  }
  for (const film of catalog.films) {
    checkId(film.id);
    checkFile(film.original, /^assets\/images\/adventures\/[^/]+\.mp4$/);
    checkFile(film.source, /^assets\/video\/adventures\/[a-z0-9-]+\.mp4$/);
    checkFile(film.poster, /^assets\/video\/adventures\/[a-z0-9-]+-poster\.webp$/);
    if (film.source !== `assets/video/adventures/${film.id}.mp4`
      || film.poster !== `assets/video/adventures/${film.id}-poster.webp`
      || film.width !== 1280 || film.height !== 720 || film.duration !== 10 || film.silent !== true) {
      throw new Error(`Invalid adventure film metadata: ${film.id}`);
    }
  }
  return catalog;
}

function decodeXml(text) {
  return text.replace(/&(?:#x([0-9a-f]+)|#(\d+)|(amp|lt|gt|quot|apos));/gi, (entity, hex, decimal, name) => {
    if (hex || decimal) return String.fromCodePoint(Number.parseInt(hex || decimal, hex ? 16 : 10));
    return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[name.toLowerCase()];
  });
}

function mediaImage(source, svg) {
  const viewBox = svg.match(/<svg\b[^>]*\bviewBox=(["'])(.*?)\1/)?.[2].trim().split(/[\s,]+/).map(Number);
  const matches = [...svg.matchAll(textElements)];
  if (!viewBox || viewBox.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0
    || matches.length !== [...svg.matchAll(/<(?:title|desc|text)\b/g)].length
    || matches.filter(match => match[1] === 'title').length !== 1
    || matches.filter(match => match[1] === 'desc').length !== 1) {
    throw new Error(`Unsupported illustration text structure: ${source}`);
  }
  const identifier = path.posix.basename(source, '.svg').toUpperCase();
  const tokens = matches.flatMap(match => {
    const text = decodeXml(match[2]);
    if (match[1] === 'text' && (/^\d+$/.test(text) || text === identifier)) return [];
    const start = match.index + match[0].indexOf('>') + 1;
    return [{ id: mediaId(text), kind: 'media', tag: match[1], text, start, end: start + match[2].length }];
  });
  return { source, svg, tokens, width: viewBox[2], height: viewBox[3] };
}

function mediaImages(files = repositoryFiles()) {
  return files.flatMap(file => {
    const source = path.relative(root, file).split(path.sep).join('/');
    if (!/^assets\/images\/(?:adventures|hands-on)\/[^/]+\.svg$/.test(source)) return [];
    return [mediaImage(source, fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'))];
  });
}

function renderMedia(image, locale, dictionary) {
  if (!['en', 'es', 'pt-br'].includes(locale)) throw new Error(`Unsupported media locale: ${locale}`);
  const translate = token => {
    if (locale === 'en') return token.text;
    const text = dictionary[token.id];
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error(`Missing ${locale} media translation: ${image.source}:${token.id}`);
    }
    return text.trim();
  };
  let svg = image.svg;
  for (const token of [...image.tokens].reverse()) {
    const escaped = translate(token).replace(/[&<>]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]);
    svg = svg.slice(0, token.start) + escaped + svg.slice(token.end);
  }
  const language = locale === 'pt-br' ? 'pt-BR' : locale;
  svg = svg.replace(/<svg\b([^>]*)>/, (element, attributes) => {
    const sized = attributes + (/\swidth=/.test(attributes) ? '' : ` width="${image.width}"`)
      + (/\sheight=/.test(attributes) ? '' : ` height="${image.height}"`);
    return `<svg${sized.replace(/\s(?:xml:)?lang=(["'])[^"']*\1/g, '')} lang="${language}" xml:lang="${language}">`;
  });
  return {
    bytes: Buffer.from(svg),
    title: translate(image.tokens.find(token => token.tag === 'title')),
    description: translate(image.tokens.find(token => token.tag === 'desc'))
  };
}

module.exports = { mediaId, mediaImage, mediaImages, renderMedia, loadAdventureMedia };
