# Tempora Loop lab

Repair a bounded feedback loop that stops when its output stabilizes.

## Mission

Implement `refine` in `starter/loop.js`. It must:

1. call the supplied step function at most `maxIterations` times;
2. stop early when two consecutive values are equal;
3. return `{ value, iterations, stable }`;
4. reject invalid iteration limits.

Run `node verify.js`.
