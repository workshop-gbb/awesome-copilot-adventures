# Read-only SDK support fixture

Run `node --test --test-concurrency=1 app.test.mjs` without packages or credentials.
These tests exercise the application and handler with a fake SDK client; they do
not evaluate a model.

Optional live execution uses the pinned dependency in `package.json`:

```bash
npm install
node live.mjs "What is the status of ORD-1?"
```

Inspect the tool allowlist and denial policy first. The runtime data directory is
`.copilot-runtime` under this copy. Authentication may differ from the editor.
Do not grant extra permissions automatically when a live operation is denied.
