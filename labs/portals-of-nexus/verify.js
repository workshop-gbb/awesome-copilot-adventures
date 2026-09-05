const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', 'portal-map.json');
const expected = [
  {
    role: 'ask',
    harness: 'vscode-local',
    target: 'local',
    environment: 'repository-folder'
  },
  {
    role: 'plan',
    harness: 'vscode-copilot',
    target: 'copilot',
    environment: 'repository-folder'
  },
  {
    role: 'agent',
    harness: 'vscode-copilot',
    target: 'copilot',
    environment: 'worktree'
  }
];

try {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const routes = data.routes;
  if (!Array.isArray(routes) || routes.length !== expected.length) {
    throw new Error('routes must contain exactly three entries');
  }

  const failures = routes.flatMap((route, index) => {
    if (typeof route.task !== 'string' || !route.task.trim()) {
      return [`Route ${index + 1} needs a non-empty task.`];
    }
    return Object.entries(expected[index])
      .filter(([key, value]) => route[key] !== value)
      .map(([key, value]) => `Route ${index + 1} ${key}: expected "${value}", received "${route[key]}".`);
  });

  if (failures.length) {
    console.error(`Portals of Nexus verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Portals of Nexus verification passed: role, harness, target, and environment are distinct.');
} catch (error) {
  console.error(`Portals of Nexus verification failed: ${error.message}`);
  process.exit(1);
}
