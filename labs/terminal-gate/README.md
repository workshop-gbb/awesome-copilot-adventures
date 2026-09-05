# Terminal Gate lab

Build a tiny argument parser for a safe, deterministic terminal surface.

## Mission

Implement `parseCommand` in `starter/command.js`. Accept only:

```text
inspect <relative-path>
verify <relative-path>
```

Return `{ action, target }`. Reject missing or extra arguments, absolute paths, parent traversal, shell metacharacters, and unsupported actions.

Run `node verify.js`.
