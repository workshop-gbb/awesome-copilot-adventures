export const workflowStages = Object.freeze(['ask', 'plan', 'agent', 'review', 'evidence']);

export function createWorkflow(scenario = 'passing') {
  if (!['passing', 'failing'].includes(scenario)) throw new TypeError('Unknown workflow scenario.');
  return { scenario, cursor: -1, status: 'ready' };
}

export function transitionWorkflow(state, action) {
  if (!state || !['passing', 'failing'].includes(state.scenario)
    || !Number.isInteger(state.cursor) || state.cursor < -1 || state.cursor >= workflowStages.length
    || !['ready', 'running', 'paused', 'blocked', 'complete'].includes(state.status)) {
    throw new TypeError('Invalid workflow state.');
  }
  if (action === 'reset') return createWorkflow(state.scenario);
  if (!['play', 'pause', 'next'].includes(action)) throw new TypeError('Unknown workflow action.');
  if (state.status === 'complete' || state.status === 'blocked') return state;
  if (action === 'play') return { ...state, status: 'running' };
  if (action === 'pause') return state.status === 'running' ? { ...state, status: 'paused' } : state;
  const cursor = state.cursor + 1;
  const status = state.scenario === 'failing' && cursor === 3 ? 'blocked'
    : cursor === workflowStages.length - 1 ? 'complete'
      : state.status === 'running' ? 'running' : 'paused';
  return { ...state, cursor, status };
}

export const contextBudget = 8;
export const contextFiles = Object.freeze([
  { id: 'task', units: 2, required: true },
  { id: 'code', units: 3, required: true },
  { id: 'tests', units: 2, required: true },
  { id: 'logs', units: 4, required: false },
  { id: 'unrelated', units: 1, required: false }
]);

export function evaluateContext(selected) {
  if (!Array.isArray(selected) || selected.some(id => !contextFiles.some(file => file.id === id))) {
    throw new TypeError('Unknown context selection.');
  }
  const ids = new Set(selected);
  const included = contextFiles.filter(file => ids.has(file.id));
  const units = included.reduce((total, file) => total + file.units, 0);
  const missing = contextFiles.filter(file => file.required && !ids.has(file.id)).map(file => file.id);
  const distractions = included.filter(file => !file.required).length;
  const status = units > contextBudget ? 'over'
    : missing.length ? 'missing' : distractions ? 'noisy' : 'ready';
  return { units, missing, distractions, status };
}

export const patches = Object.freeze({
  incomplete: 'function normalizeName(value) {\n  if (!value.trim()) throw new RangeError("Empty name");\n  return value.trim();\n}',
  corrected: 'function normalizeName(value) {\n  if (!value.trim()) throw new RangeError("Empty name");\n  return value.trim().toLowerCase();\n}'
});

export const fixtureCases = Object.freeze([
  { input: ' Ada ', expected: 'ada' },
  { input: 'LIN', expected: 'lin' },
  { input: '   ', expected: 'RangeError' }
]);

export function verifyPatch(patch) {
  if (!Object.hasOwn(patches, patch)) throw new TypeError('Unknown fixture patch.');
  // The two bounded fixtures are ordinary functions, never evaluated user code.
  const normalize = value => {
    if (!value.trim()) throw new RangeError('Empty name');
    return patch === 'corrected' ? value.trim().toLowerCase() : value.trim();
  };
  return fixtureCases.map(({ input, expected }) => {
    let actual;
    try {
      actual = normalize(input);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      actual = error.name;
    }
    return { input, expected, actual, passed: actual === expected };
  });
}
