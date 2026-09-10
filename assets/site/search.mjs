export function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

/*
 * A learner searches for a lesson, not for a file path. The index holds far more repository paths
 * than documents, and a path that happens to contain the term used to outrank every lesson that
 * explains it. Documents are therefore ranked as one tier and original paths as a second, with the
 * paths capped so they stay available without burying the answer.
 */
export function searchRecords(records, query, limit = 40, originalLimit = 5) {
  const terms = normalizeSearch(query.slice(0, 160)).split(' ').filter(Boolean).slice(0, 8);
  if (!terms.length) return [];
  const matches = records.flatMap((record, index) => {
    const title = normalizeSearch(record.title);
    const text = normalizeSearch(record.text);
    if (!terms.every(term => title.includes(term) || text.includes(term))) return [];
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 10 : 1), 0);
    return [{ ...record, score, index }];
  }).sort((left, right) => right.score - left.score || left.index - right.index);
  const documents = matches.filter(record => !record.original).slice(0, limit);
  const originals = matches.filter(record => record.original).slice(0, originalLimit);
  return [...documents, ...originals];
}

export function resultExcerpt(record, query, length = 180) {
  const term = normalizeSearch(query).split(' ').find(Boolean);
  // Admonition markers are Markdown syntax, not prose the reader asked for.
  record = { ...record, text: record.text.replace(/\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)]\s*/g, '') };
  const position = term ? normalizeSearch(record.text).indexOf(term) : 0;
  const start = Math.max(0, position - 50);
  const excerpt = record.text.slice(start, start + length);
  return `${start ? '…' : ''}${excerpt}${start + length < record.text.length ? '…' : ''}`;
}
