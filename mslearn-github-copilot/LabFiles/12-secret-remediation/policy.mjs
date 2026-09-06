export const stages = ['triage', 'revoke', 'replace', 'review-exposure', 'prevent', 'close'];

export function validateResponse(response) {
  if (response?.simulation !== true) throw new Error('This verifier accepts simulation plans only.');
  if (!Array.isArray(response.steps) || response.steps.length !== stages.length) {
    throw new Error('Provide all six incident-response stages.');
  }
  response.steps.forEach((step, index) => {
    if (step?.id !== stages[index]) throw new Error(`Stage ${index + 1} must be ${stages[index]}.`);
    if (typeof step.evidence !== 'string' || step.evidence.trim().length < 12) {
      throw new Error(`Describe evidence required for ${step.id}.`);
    }
  });
  return true;
}
