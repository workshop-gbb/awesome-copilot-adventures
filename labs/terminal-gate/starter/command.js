function parseCommand(input) {
  // TODO: parse the two safe commands and reject everything else.
  return { action: 'inspect', target: input };
}

module.exports = { parseCommand };
