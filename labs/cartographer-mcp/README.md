# MCP Cartographer lab

Configure and verify a local, read-only Model Context Protocol server.

## Isolate the exercise

Copy this lab to a disposable location and open its `starter/` directory as the VS Code workspace root. Start a new session so the host discovers `starter/.mcp.json` from the correct root.

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
