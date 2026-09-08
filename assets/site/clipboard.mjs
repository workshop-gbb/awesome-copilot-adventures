export async function copyText(text, clipboard) {
  if (typeof text !== 'string') throw new TypeError('Clipboard content must be text.');
  if (typeof clipboard?.writeText !== 'function') {
    throw new Error('Clipboard API is unavailable. Use HTTPS or copy the text manually.');
  }
  await clipboard.writeText(text);
}
