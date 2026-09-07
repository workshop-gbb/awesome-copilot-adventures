const { performance } = require('perf_hooks');

const EPSILON = 1e-9;

function nearlyEqual(left, right) {
  return Math.abs(left - right) <= EPSILON * Math.max(1, Math.abs(left), Math.abs(right));
}

function validateSequence(sequence) {
  if (!Array.isArray(sequence)) {
    return { valid: false, error: 'Sequence must be an array' };
  }
  if (sequence.length < 2) {
    return { valid: false, error: 'Sequence must contain at least two values' };
  }
  if (!sequence.every(value => typeof value === 'number' && Number.isFinite(value))) {
    return { valid: false, error: 'Sequence values must be finite numbers' };
  }
  return { valid: true, error: null };
}

function differences(sequence) {
  return sequence.slice(1).map((value, index) => value - sequence[index]);
}

function isConstant(sequence) {
  return sequence.length > 0 && sequence.every(value => nearlyEqual(value, sequence[0]));
}

function detectArithmetic(sequence) {
  const delta = differences(sequence);
  if (!isConstant(delta)) return null;
  return {
    pattern: 'arithmetic',
    nextValue: sequence.at(-1) + delta[0],
    formula: `a(n) = ${sequence[0]} + (n - 1) × ${delta[0]}`
  };
}

function detectGeometric(sequence) {
  if (sequence.slice(0, -1).some(value => nearlyEqual(value, 0))) return null;
  const ratios = sequence.slice(1).map((value, index) => value / sequence[index]);
  if (!isConstant(ratios)) return null;
  return {
    pattern: 'geometric',
    nextValue: sequence.at(-1) * ratios[0],
    formula: `a(n) = ${sequence[0]} × ${ratios[0]}^(n - 1)`
  };
}

function detectFibonacci(sequence) {
  if (sequence.length < 5) return null;
  for (let index = 2; index < sequence.length; index++) {
    if (!nearlyEqual(sequence[index], sequence[index - 1] + sequence[index - 2])) return null;
  }
  return {
    pattern: 'fibonacci',
    nextValue: sequence.at(-1) + sequence.at(-2),
    formula: 'a(n) = a(n - 1) + a(n - 2)'
  };
}

function detectPolynomial(sequence, degree, pattern) {
  if (sequence.length < degree + 2) return null;
  const levels = [sequence];
  for (let level = 1; level <= degree; level++) {
    levels.push(differences(levels[level - 1]));
  }
  if (!isConstant(levels[degree])) return null;

  const nextValues = levels.map(level => level.at(-1));
  for (let level = degree; level > 0; level--) {
    nextValues[level - 1] += nextValues[level];
  }

  return {
    pattern,
    nextValue: nextValues[0],
    formula: `${degree}${degree === 2 ? 'nd' : 'rd'}-degree finite differences`
  };
}

function detectPattern(sequence) {
  const startedAt = performance.now();
  const validation = validateSequence(sequence);
  if (!validation.valid) {
    return { success: false, error: validation.error, processingTime: performance.now() - startedAt };
  }

  const match =
    detectArithmetic(sequence) ||
    detectGeometric(sequence) ||
    detectFibonacci(sequence) ||
    detectPolynomial(sequence, 2, 'quadratic') ||
    detectPolynomial(sequence, 3, 'cubic');

  if (!match) {
    return {
      success: false,
      error: 'No supported pattern was detected',
      processingTime: performance.now() - startedAt
    };
  }

  return {
    success: true,
    confidence: 1,
    ...match,
    processingTime: performance.now() - startedAt
  };
}

function predictMultiple(sequence, count = 5) {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return { success: false, error: 'Count must be an integer between 1 and 100' };
  }

  const extendedSequence = [...sequence];
  const predictions = [];
  let firstResult;

  for (let index = 0; index < count; index++) {
    const result = detectPattern(extendedSequence);
    if (!result.success) return result;
    firstResult ||= result;
    predictions.push(result.nextValue);
    extendedSequence.push(result.nextValue);
  }

  return {
    ...firstResult,
    nextValue: predictions[0],
    predictions,
    extendedSequence
  };
}

function generateSequence(type, params, length = 10) {
  if (!Number.isInteger(length) || length < 2 || length > 1000) {
    throw new Error('Length must be an integer between 2 and 1000');
  }
  if (!params || typeof params !== 'object') {
    throw new Error('Sequence parameters are required');
  }

  switch (type) {
    case 'arithmetic':
      return Array.from({ length }, (_, index) => params.start + index * params.difference);
    case 'geometric':
      return Array.from({ length }, (_, index) => params.start * params.ratio ** index);
    case 'fibonacci': {
      const result = [params.f1, params.f2];
      while (result.length < length) result.push(result.at(-1) + result.at(-2));
      return result.slice(0, length);
    }
    default:
      throw new Error(`Unsupported sequence type: ${type}`);
  }
}

module.exports = {
  detectPattern,
  generateSequence,
  predictMultiple,
  validateSequence
};
