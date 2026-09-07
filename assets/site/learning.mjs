import { normalizeSearch } from './search.mjs';

export function readingState(raw, allowedSources) {
  if (raw === null) return { version: 1, read: [] };
  const data = JSON.parse(raw);
  if (!data || data.version !== 1 || !Array.isArray(data.read) || data.read.some(source => typeof source !== 'string')) {
    throw new TypeError('Invalid reading state.');
  }
  const allowed = new Set(allowedSources);
  return { version: 1, read: [...new Set(data.read)].filter(source => allowed.has(source)) };
}

export function toggleReading(state, source, allowedSources) {
  if (!allowedSources.includes(source)) throw new TypeError('The document is not in the learning library.');
  const read = new Set(state.read);
  if (read.has(source)) read.delete(source);
  else read.add(source);
  return { version: 1, read: [...read] };
}

export function filterLibrary(documents, { query = '', group = 'all', read = [] } = {}) {
  const words = normalizeSearch(query.slice(0, 160)).split(' ').filter(Boolean);
  const marked = new Set(read);
  return documents.filter(document => {
    if (group === 'read' ? !marked.has(document.source) : group !== 'all' && group !== document.group) return false;
    const text = normalizeSearch(`${document.title} ${document.source}`);
    return words.every(word => text.includes(word));
  });
}
