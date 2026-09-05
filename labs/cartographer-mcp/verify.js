const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const readline = require('node:readline');

const starter = path.join(__dirname, 'starter');
const configPath = path.join(starter, '.mcp.json');

function validateConfig() {
  const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const servers = data.servers;
  const server = servers?.['map-reader'];
  const failures = [];

  if (!server || Object.keys(servers).length !== 1) failures.push('define exactly one server named map-reader');
  if (server?.type !== 'stdio') failures.push('set type to stdio');
  if (server?.command !== 'node') failures.push('set command to node');
  if (JSON.stringify(server?.args) !== JSON.stringify(['server.js'])) failures.push('set args to ["server.js"]');
  if (server && ('env' in server || 'url' in server)) failures.push('remove env and url fields');
  if (/(token|secret|password|api[_-]?key)/i.test(JSON.stringify(data))) failures.push('remove credential-like fields');

  return failures;
}

function exerciseServer() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['server.js'], {
      cwd: starter,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    const responses = [];
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error('MCP server did not complete within two seconds'));
    }, 2000);

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', chunk => {
      stderr += chunk;
    });
    const output = readline.createInterface({ input: child.stdout, crlfDelay: Infinity });
    output.on('line', line => {
      if (line.trim()) responses.push(JSON.parse(line));
    });
    child.on('error', reject);
    child.on('close', code => {
      clearTimeout(timeout);
      if (code !== 0) {
        reject(new Error(`MCP server exited with ${code}: ${stderr.trim()}`));
        return;
      }
      resolve(responses);
    });

    const messages = [
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'lab-verifier', version: '1.0.0' }
        }
      },
      { jsonrpc: '2.0', method: 'notifications/initialized' },
      { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} },
      {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: { name: 'read_map', arguments: { realm: 'nexus' } }
      }
    ];
    child.stdin.end(messages.map(message => JSON.stringify(message)).join('\n'));
  });
}

(async () => {
  try {
    const failures = validateConfig();
    if (failures.length) {
      console.error(`Cartographer MCP verification failed:\n- ${failures.join('\n- ')}`);
      process.exit(1);
    }

    const responses = await exerciseServer();
    const initialized = responses.find(response => response.id === 1);
    const listed = responses.find(response => response.id === 2);
    const called = responses.find(response => response.id === 3);

    if (initialized?.result?.serverInfo?.name !== 'map-reader') throw new Error('initialize response is invalid');
    if (listed?.result?.tools?.[0]?.name !== 'read_map') throw new Error('tools/list did not expose read_map');
    if (listed.result.tools[0].annotations?.readOnlyHint !== true) throw new Error('read_map is not declared read-only');
    if (called?.result?.structuredContent?.id !== 'nexus') throw new Error('tools/call did not return the requested realm');

    console.log('Cartographer MCP verification passed: initialize, tools/list, and tools/call are functional.');
  } catch (error) {
    console.error(`Cartographer MCP verification failed: ${error.message}`);
    process.exit(1);
  }
})();
