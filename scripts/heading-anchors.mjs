export function stableHeadingAnchors() {
  return {
    name: 'stable-locale-heading-anchors',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, context) {
        const last = node.children?.at(-1);
        if (last?.type !== 'text') return;
        const marker = last.value.match(/ \{#([\p{L}\p{N}_-]+)\}$/u);
        if (!marker) return;
        context.setProperty(node, 'id', marker[1]);
        context.replaceNode(last, { type: 'text', value: last.value.slice(0, -marker[0].length) });
      }
    }
  };
}
