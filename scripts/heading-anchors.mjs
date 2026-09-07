export function stableHeadingAnchors() {
  return {
    name: 'stable-locale-heading-anchors',
    element: {
      filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      visit(node, context) {
        const last = node.children?.at(-1);
        if (last?.type !== 'text') return;
        const marker = last.value.match(/ \{#([\p{L}\p{N}_\u2013\u2014-]+)\}$/u);
        if (!marker) return;
        // Markdown typography can fold repeated hyphens inside the generated marker.
        const id = marker[1].replaceAll('\u2014', '---').replaceAll('\u2013', '--');
        context.setProperty(node, 'id', id);
        context.replaceNode(last, { type: 'text', value: last.value.slice(0, -marker[0].length) });
      }
    }
  };
}
