export function createDashboard() {
  const records = [];
  const projects = [{ id: 'project-1', name: 'Training dashboard' }];
  function validateActor(actor) {
    if (typeof actor?.id !== 'string' || !actor.id.trim()) throw new TypeError('A trusted fixture actor is required.');
  }
  function validateProject(projectId) {
    if (!projects.some(project => project.id === projectId)) throw new RangeError('Unknown project.');
  }
  return {
    health() { return { status: 'ok' }; },
    projects() { return projects.map(project => ({ ...project })); },
    addDocument(input, actor) {
      validateActor(actor);
      validateProject(input?.projectId);
      if (typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 120) {
        throw new TypeError('Title must contain 1 to 120 characters.');
      }
      if ('ownerId' in input) throw new TypeError('Owner is assigned from the trusted actor, not the request.');
      const record = { id: `doc-${records.length + 1}`, projectId: input.projectId, title: input.title.trim(), ownerId: actor.id };
      records.push(record);
      return { ...record };
    },
    documents(projectId, actor) {
      validateActor(actor);
      validateProject(projectId);
      return records.filter(record => record.projectId === projectId && record.ownerId === actor.id).map(record => ({ ...record }));
    }
  };
}
