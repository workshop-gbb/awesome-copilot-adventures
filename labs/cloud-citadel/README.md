# Cloud Citadel lab

Write a bounded task contract suitable for delegation to a remote ephemeral environment.

## Mission

Complete `starter/task-contract.json` with:

- a non-empty `goal`;
- `allowedPaths` containing only `src/` and `test/`;
- explicit `acceptanceCriteria`;
- a local verification command of `node test/run.js`;
- `networkRequired` set to `false`;
- an `evidence` list containing changed files, command, exit code, and observed result.

Do not add credentials or deployment instructions. Run `node verify.js`.
