const fs = require('node:fs');
const path = require('node:path');
const { root, markdownFiles } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');
const { themeFrontmatter } = require('./check-diagrams');

const workflow = {
  title: 'Evidence-first development workflow',
  description: 'Investigation leads to planning, implementation, review and evidence; unresolved gaps return to investigation.',
  legend: 'Rectangles are workflow stages. Solid arrows show the normal progression; the dashed arrow returns unresolved evidence gaps to investigation.',
  explanation: 'A fluent response is not completion. The loop ends only when the reviewed result meets the acceptance criteria and the recorded checks support it.'
};
const context = {
  'CONTRIBUTING.md': {
    title: 'Contribution evidence gates',
    description: 'A contribution moves from one learning outcome through official sources, evidence design, implementation, validation and review.',
    legend: 'Rectangles are contribution stages. Solid arrows show the order of reviewable work.',
    explanation: 'Define the learning outcome and its evidence before writing the exercise. Validation and review are separate from producing the artifact.'
  },
  'docs/contributing.md': {
    title: 'Prepare a reviewable curriculum contribution',
    description: 'Choose a learning outcome, verify sources, define evidence, write the lab and rubric, validate, then request review.',
    legend: 'Rectangles represent artifacts or review stages; solid arrows show the contribution sequence.',
    explanation: 'A source-grounded learning objective and an observable check should precede publication. The diagram is a process guide, not evidence that a pull request was reviewed.'
  },
  'docs/curriculum-map.md': {
    title: 'Progressive adventure curriculum',
    description: 'Foundations, basics, intermediate customization, advanced coordination and execution surfaces lead to the capstone.',
    legend: 'Grouped boxes are curriculum levels; individual boxes are adventures. Solid arrows indicate the suggested first-pass learning order.',
    explanation: 'Later adventures build on earlier concepts. The hands-on companion track is separate and retains numbered professional exercises rather than adding fantasy adventures.'
  },
  'docs/customization-primitives.md': {
    title: 'Select the smallest customization primitive',
    description: 'Decide whether context is automatic, then choose a task prompt, reusable skill, role profile, external capability or deterministic check.',
    legend: 'Diamonds are selection questions. Labeled arrows describe the need; rectangles are the customization primitives.',
    explanation: 'Choose based on responsibility and invocation, not perceived sophistication. A skill is not a permission boundary and a prompt is not automatically applied context.'
  },
  'docs/start-here.md': {
    title: 'Learner and agent role handoffs',
    description: 'The learner requests investigation, a bounded plan, implementation and independent review, receiving a different evidence artifact at each step.',
    legend: 'Participants are the learner and agent roles. Solid arrows are requests; dashed arrows are returned findings, plans, changes or review results.',
    explanation: 'The learner owns acceptance at each boundary. A role handoff carries task context, but it does not prove a test or review was executed.'
  }
};

function main() {
  let count = 0;
  for (const file of markdownFiles()) {
    const original = fs.readFileSync(file, 'utf8');
    const lines = original.split('\n');
    const relative = path.relative(root, file).split(path.sep).join('/');
    const blocks = fencedBlocks(original).filter(block => block.language === 'mermaid');
    for (const block of blocks.toReversed()) {
      let meta = context[relative] || workflow;
      if (relative === 'docs/harness-guide.md') {
        meta = block.code.includes('Isolation') || block.code.includes('Sandbox') ? {
          title: 'Isolation and permission are different controls',
          description: 'Sessions isolate conversation, worktrees isolate code, sandboxes constrain processes and approvals express operation consent.',
          legend: 'Rectangles name controls and their responsibilities. Solid arrows connect each control with what it actually governs.',
          explanation: 'A worktree is not a security sandbox. Code isolation, process policy and operation approval must each be considered when selecting an execution environment.'
        } : {
          title: 'Session targets and agent harnesses',
          description: 'Local and Copilot targets select different runtimes, while the Cloud target selects an available remote agent.',
          legend: 'The diamond is the target-selection decision. Rectangles describe runtimes, agent roles and the remote review artifact; solid arrows show selection relationships.',
          explanation: 'Local is a harness name, not all local execution. Roles, targets and runtimes answer different questions; a remote pull request is an output artifact.'
        };
      }
      let code = block.code.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^%%\{init:[^\n]*\}%%\n/, '');
      const body = code.split('\n');
      if (!body.some(line => /^\s*accTitle:/.test(line))) body.splice(1, 0, `    accTitle: ${meta.title}`);
      if (!body.some(line => /^\s*accDescr:/.test(line))) body.splice(2, 0, `    accDescr: ${meta.description}`);
      code = `${themeFrontmatter()}\n${body.join('\n')}`;
      const after = lines.slice(block.end + 1).join('\n').split(/\n#{1,6} |\n```mermaid/, 1)[0];
      const replacement = ['```mermaid', ...code.split('\n'), '```'];
      if (!/\*\*Legend\.\*\*/.test(after)) replacement.push('', `**Legend.** ${meta.legend}`);
      if (!/\*\*Explanation\.\*\*/.test(after)) replacement.push('', `**Explanation.** ${meta.explanation}`);
      lines.splice(block.start, block.end - block.start + 1, ...replacement);
      count++;
    }
    const output = lines.join('\n');
    if (output !== original) fs.writeFileSync(file, output);
  }
  console.log(`Applied the shared monochrome theme to ${count} Mermaid blocks.`);
}

main();
