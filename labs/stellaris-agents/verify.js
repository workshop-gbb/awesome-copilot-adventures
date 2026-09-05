const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', '.github', 'agents', 'test-scout.agent.md');

try {
  const text = fs.readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  const failures = [];
  if (!frontmatter) {
    failures.push('add YAML frontmatter');
  } else {
    if (!/^name:\s*test-scout\s*$/m.test(frontmatter[1])) failures.push('set name to test-scout');
    if (!/^description:\s*(?!TODO\s*$).+/m.test(frontmatter[1])) failures.push('write a concrete description');
    const tools = frontmatter[1].match(/^tools:\s*(.+)$/m);
    if (!tools || tools[1].trim() === '[]') failures.push('declare at least one tool');
    else {
      if (!/\bsearch\b/.test(tools[1])) failures.push('include the search tool');
      if (!/\b(execute|runCommands)\b/.test(tools[1])) failures.push('include a command tool for focused tests');
      if (/\bedit\b/.test(tools[1])) failures.push('do not grant an edit tool');
    }
    if (!/^handoffs:\s*$/m.test(frontmatter[1])) failures.push('define a handoff');
    if (!/^\s+- label:\s*.+$/m.test(frontmatter[1])) failures.push('give the handoff a label');
    if (!/^\s+agent:\s*agent\s*$/m.test(frontmatter[1])) failures.push('hand off to the built-in Agent role');
    if (!/^\s+prompt:\s*.+$/m.test(frontmatter[1])) failures.push('provide a concrete handoff prompt');
  }
  if (!/\b(inspect|read|review)\b[\s\S]*\bexisting tests?\b/i.test(text)) failures.push('inspect existing tests first');
  if (!/\b(read-only|do not edit|never edit)\b/i.test(text)) failures.push('keep the agent read-only for source edits');
  if (!/\b(only|limit|restrict|focused)\b[^\n]*\btests?\b/i.test(text)) failures.push('limit recommendations to tests');
  if (!/\b(smallest|targeted|focused)\b[^\n]*\btest\b/i.test(text)) failures.push('run the smallest relevant test');
  if (!/\b(evidence|exit code|observed result)\b/i.test(text)) failures.push('report verification evidence');
  if (!/\b(remaining|unresolved)\b[^\n]*\b(failures?|issues?)\b/i.test(text)) failures.push('report remaining failures');
  if (/TODO/i.test(text)) failures.push('remove every TODO');

  if (failures.length) {
    console.error(`Agents of Stellaris verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Agents of Stellaris verification passed: the custom agent is scoped and evidence-driven.');
} catch (error) {
  console.error(`Agents of Stellaris verification failed: ${error.message}`);
  process.exit(1);
}
