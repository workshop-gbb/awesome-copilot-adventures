# Lumoria Graph lab

Repair a dependency graph traversal so an agent can explain impact before editing.

## Mission

Implement `affectedBy` in `starter/graph.js`. Given a graph whose keys depend on the listed nodes, return every node directly or transitively affected by a changed node.

Requirements:

- include the changed node;
- return unique names in alphabetical order;
- handle cycles safely;
- reject an unknown starting node.

Run `node verify.js`.
