function affectedBy(graph, changedNode) {
  // TODO: traverse reverse dependencies without looping forever.
  return [changedNode];
}

module.exports = { affectedBy };
