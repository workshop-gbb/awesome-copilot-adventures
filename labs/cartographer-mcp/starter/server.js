const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const mapPath = path.join(__dirname, 'map.json');

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function success(id, result) {
  send({ jsonrpc: '2.0', id, result });
}

function failure(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

function readMap(realm) {
  const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
  const entry = map.realms.find(item => item.id === realm);
  if (!entry) throw new Error(`Unknown realm: ${realm}`);
  return entry;
}

function handle(message) {
  if (message?.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    failure(message?.id ?? null, -32600, 'Invalid JSON-RPC request');
    return;
  }

  if (message.method === 'notifications/initialized') return;

  switch (message.method) {
    case 'initialize':
      success(message.id, {
        protocolVersion: message.params?.protocolVersion || '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'map-reader', version: '1.0.0' }
      });
      break;
    case 'ping':
      success(message.id, {});
      break;
    case 'tools/list':
      success(message.id, {
        tools: [
          {
            name: 'read_map',
            description: 'Read one public realm from the local adventure map.',
            inputSchema: {
              type: 'object',
              properties: {
                realm: {
                  type: 'string',
                  description: 'Realm identifier from the bundled map.'
                }
              },
              required: ['realm'],
              additionalProperties: false
            },
            annotations: {
              title: 'Read adventure map',
              readOnlyHint: true,
              destructiveHint: false,
              idempotentHint: true,
              openWorldHint: false
            }
          }
        ]
      });
      break;
    case 'tools/call':
      if (message.params?.name !== 'read_map') {
        failure(message.id, -32602, 'Unknown tool');
        break;
      }
      try {
        const entry = readMap(message.params.arguments?.realm);
        success(message.id, {
          content: [
            {
              type: 'text',
              text: JSON.stringify(entry)
            }
          ],
          structuredContent: entry
        });
      } catch (error) {
        success(message.id, {
          isError: true,
          content: [{ type: 'text', text: error.message }]
        });
      }
      break;
    default:
      failure(message.id, -32601, `Method not found: ${message.method}`);
  }
}

const input = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity
});

input.on('line', line => {
  if (!line.trim()) return;
  try {
    handle(JSON.parse(line));
  } catch {
    failure(null, -32700, 'Parse error');
  }
});
