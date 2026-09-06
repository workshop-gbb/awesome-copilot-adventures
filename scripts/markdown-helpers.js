function fencedBlocks(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let opened;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (!opened) {
      const match = line.match(/^ {0,3}(`{3,}|~{3,})([^\s]*)[ \t]*$/);
      if (match) opened = { start: index, fence: match[1], language: match[2] };
      continue;
    }
    const closing = line.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
    if (closing && closing[1][0] === opened.fence[0] && closing[1].length >= opened.fence.length) {
      blocks.push({ ...opened, end: index, code: lines.slice(opened.start + 1, index).join('\n') });
      opened = undefined;
    }
  }

  if (opened) throw new Error(`Unclosed ${opened.language || 'code'} fence at line ${opened.start + 1}`);
  return blocks;
}

function withoutCodeBlocks(markdown) {
  const lines = markdown.split('\n');
  for (const block of fencedBlocks(markdown)) {
    for (let index = block.start; index <= block.end; index++) lines[index] = '';
  }
  return lines.join('\n');
}

module.exports = { fencedBlocks, withoutCodeBlocks };
