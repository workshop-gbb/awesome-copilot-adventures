# Greenfield RSS fixture

Read `StakeholderDocuments/` and implement `createStore` in `subscriptions.mjs`.
Run `node --test --test-concurrency=1 contract.test.mjs`. The starter fails
intentionally; change implementation, not assertions.

Instructor checks in the curriculum checkout:

```bash
HANDS_ON_REFERENCE=1 node --test --test-concurrency=1 contract.test.mjs
HANDS_ON_REFERENCE=typescript node --test --test-concurrency=1 contract.test.mjs
```

References are excluded from learner preparation copies. The checks compare the
same contract; they do not invoke Spec Kit, a model, or a network service.
