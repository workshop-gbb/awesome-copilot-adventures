export function createDashboard() {
  return {
    health() { return { status: 'ok' }; },
    projects() { return [{ id: 'project-1', name: 'Training dashboard' }]; },
    addDocument() { throw new Error('Exercise: implement document metadata without changing health or projects.'); },
    documents() { throw new Error('Exercise: implement owner-scoped document listing.'); }
  };
}
