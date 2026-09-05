const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', 'workflow.json');
const expected = [
  {
    phase: 'ask',
    actor: 'learner',
    agentRole: 'ask',
    harness: 'vscode-local',
    target: 'local',
    environment: 'repository-folder',
    consumes: [],
    produces: 'findings'
  },
  {
    phase: 'plan',
    actor: 'learner',
    agentRole: 'plan',
    harness: 'vscode-copilot',
    target: 'copilot',
    environment: 'repository-folder',
    consumes: ['findings'],
    produces: 'design'
  },
  {
    phase: 'implement',
    actor: 'github-copilot',
    agentRole: 'agent',
    harness: 'vscode-copilot',
    target: 'copilot',
    environment: 'worktree',
    consumes: ['design'],
    produces: 'verification'
  },
  {
    phase: 'cloud-implementation',
    actor: 'github-copilot',
    agentRole: 'agent',
    harness: 'github-copilot-cloud-agent',
    target: 'cloud',
    environment: 'ephemeral-github-environment',
    consumes: ['verification'],
    produces: 'pull-request'
  },
  {
    phase: 'runtime-evaluation',
    actor: 'sdk-application',
    agentRole: 'custom-agent',
    harness: 'github-copilot-sdk',
    target: 'application',
    environment: 'application-runtime',
    consumes: ['pull-request'],
    produces: 'evaluation-report'
  },
  {
    phase: 'review',
    actor: 'maintainer',
    agentRole: null,
    harness: null,
    target: null,
    environment: null,
    reviewSurface: 'github-pull-request',
    consumes: ['pull-request', 'evaluation-report'],
    produces: 'decision'
  }
];

try {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const stages = data.stages;
  const failures = [];

  if (!Array.isArray(stages) || stages.length !== expected.length) {
    failures.push('define exactly six stages');
  } else {
    stages.forEach((stage, index) => {
      const wanted = expected[index];
      for (const key of ['phase', 'actor', 'agentRole', 'harness', 'target', 'environment', 'produces']) {
        if (stage[key] !== wanted[key]) {
          failures.push(`stage ${index + 1} ${key} must be ${JSON.stringify(wanted[key])}`);
        }
        if ((stage.reviewSurface ?? null) !== (wanted.reviewSurface ?? null)) {
          failures.push(`stage ${index + 1} reviewSurface must be ${JSON.stringify(wanted.reviewSurface ?? null)}`);
        }
      }
      if (JSON.stringify(stage.consumes) !== JSON.stringify(wanted.consumes)) {
        failures.push(`${wanted.phase} consumes must be ${JSON.stringify(wanted.consumes)}`);
      }
      if (typeof stage.trustBoundary !== 'string' || !stage.trustBoundary.trim() || /TODO/i.test(stage.trustBoundary)) {
        failures.push(`${wanted.phase} needs a concrete trustBoundary`);
      }
      if (!Array.isArray(stage.evidence) || stage.evidence.length === 0 || stage.evidence.some(item => typeof item !== 'string' || !item.trim())) {
        failures.push(`${wanted.phase} needs at least one evidence item`);
      }
    });
  }

  if (failures.length) {
    console.error(`Convergence verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Convergence verification passed: roles, harnesses, targets, environments, and human authority are distinct.');
} catch (error) {
  console.error(`Convergence verification failed: ${error.message}`);
  process.exit(1);
}
