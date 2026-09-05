# Mythos Parallel lab

Coordinate independent work concurrently while preserving deterministic evidence.

## Mission

Implement `runInParallel` in `starter/parallel.js`. It receives task functions and must:

- start all tasks before awaiting their results;
- preserve input order in the returned array;
- return `{ index, status, value }` for success;
- return `{ index, status, error }` for failure instead of rejecting the batch;
- reject non-function entries before starting any task.

Run `node verify.js`.
