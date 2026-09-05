let input = '';

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
});
process.stdin.on('end', () => {
  try {
    if (input.trim()) JSON.parse(input);
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: 'Copilot Adventures: verify official sources, distinguish stable and preview capabilities, and report executed evidence.'
      }
    }));
  } catch (error) {
    console.error(`Invalid hook input: ${error.message}`);
    process.exit(1);
  }
});
