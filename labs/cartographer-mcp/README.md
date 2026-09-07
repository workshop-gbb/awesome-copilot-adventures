# MCP Cartographer lab

> [!TIP]
> [Download the learner ZIP](../../assets/lab-kits/adventures/cartographer-mcp.zip) or copy this whole lab to an unused folder. Read [setup and optional GitHub steps](../../docs/downloads.md) first.

## Before you run anything

| Item | Contract |
| --- | --- |
| Runtime | Node 24; live integrations are separate |
| Files to inspect | `starter/.mcp.json`, `starter/server.js`, `verify.js` |
| Verifier directory | Extracted kit root: `node verify.js`; from `starter/`: `node ../verify.js` |
| Starting state | Unfinished starter is rejected; preserve the diagnostic |
| Finish evidence | The protocol verifier receives the expected server identity, read_map discovery and the nexus structured result. |

**Concept in practice:** The cartographer reads a synthetic realm through a local process. The discovered read-only annotation is a hint; inspect the server code and returned data rather than trusting its name.


Configure and verify a local, read-only Model Context Protocol server.

## Isolate the exercise

Copy this lab to a disposable location and open its `starter/` directory as the VS Code workspace root. The local verifier reads `starter/.mcp.json` directly. Host discovery is a separate optional check: use the configuration location supported by your selected harness, not a guess that every host loads this file.

## Mission

Complete `starter/.mcp.json` with exactly one server:

- name: `map-reader`;
- type: `stdio`;
- command: `node`;
- args: `["server.js"]`;
- no environment variables, URL, credentials, or network dependency.

The bundled server implements a minimal functional MCP exchange:

1. `initialize`;
2. `tools/list`;
3. `tools/call` for the read-only `read_map` tool.

Run:

```bash
node ../verify.js
```

from the `starter/` directory. The verifier exercises the protocol, not only the configuration shape.

## Guided execution

1. Run the untouched verifier and record the expected initial state.
2. Ask for a source-grounded explanation of the relevant code and checks.
3. Plan: Configure exactly one local stdio map-reader server using node and server.js. Review server code, transport and data before running the verifier. Do not add credentials or remote URLs.
4. Implement only the approved slice, then rerun the same verifier.
5. Change the configured argument to a different file and confirm configuration validation fails before a tool result is accepted. Restore server.js.
6. Review the diff and record the limitation: The direct protocol check does not prove that a specific VS Code harness discovered this file. Use the supported host configuration only in this disposable workspace.

## Completion and safe reset

- [ ] The required behavior and its negative case have observed evidence.
- [ ] The result distinguishes local verification from live host/runtime behavior.
- [ ] No credentials, unrelated files or services were changed.
- [ ] Evidence is saved before resetting the copied starter.

Use a new extraction for another attempt, or restore only named files from a Git baseline created in this copy. Never apply a curriculum-root restore command from an unrelated project.

Continue with [the adventure and rubric](../../adventures/03-advanced/cartographer-mcp/README.md).
