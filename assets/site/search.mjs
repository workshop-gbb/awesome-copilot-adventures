export function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    .replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function searchRecords(records, query, limit = 40) {
  const terms = normalizeSearch(query.slice(0, 160)).split(' ').filter(Boolean).slice(0, 8);
  if (!terms.length) return [];
  return records.flatMap((record, index) => {
    const title = normalizeSearch(record.title);
    const text = normalizeSearch(record.text);
    if (!terms.every(term => title.includes(term) || text.includes(term))) return [];
    const score = terms.reduce((total, term) => total + (title.includes(term) ? 10 : 1), 0)
      + (record.original ? 0 : 4);
    return [{ ...record, score, index }];
  }).sort((left, right) => right.score - left.score || left.index - right.index).slice(0, limit);
}

export function resultExcerpt(record, query, length = 180) {
  const term = normalizeSearch(query).split(' ').find(Boolean);
  const position = term ? normalizeSearch(record.text).indexOf(term) : 0;
  const start = Math.max(0, position - 50);
  const excerpt = record.text.slice(start, start + length);
  return `${start ? '…' : ''}${excerpt}${start + length < record.text.length ? '…' : ''}`;
}
