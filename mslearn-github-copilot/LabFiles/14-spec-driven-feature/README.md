# Brownfield dashboard fixture

The baseline (`health` and `projects`) is implemented. The new document metadata
methods intentionally fail.

```bash
node --test --test-concurrency=1 baseline.test.mjs
node --test --test-concurrency=1 feature.test.mjs
```

Read `requirements.md`, preserve the baseline, and implement the new methods.
The trusted fixture actor is a test seam, not a production identity provider.

Instructor check in the original checkout:

```bash
HANDS_ON_REFERENCE=1 node --test --test-concurrency=1 baseline.test.mjs feature.test.mjs
```
