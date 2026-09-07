const fs = require('node:fs');
const path = require('node:path');
const { root, translationSegments, pages } = require('./site-content');

const destination = process.argv[2];
if (!destination || !path.isAbsolute(destination)) {
  throw new Error('Provide an absolute directory on your selected work drive for translation packets.');
}
fs.mkdirSync(destination, { recursive: true });
const resolved = fs.realpathSync(destination);
const fromRoot = path.relative(root, resolved);
if (!fromRoot.startsWith(`..${path.sep}`) && fromRoot !== '..' && !path.isAbsolute(fromRoot)) {
  throw new Error('Translation work packets must be exported outside the repository.');
}
if (resolved === path.parse(resolved).root || fs.readdirSync(resolved).length) {
  throw new Error('Use an empty output directory; existing translation work will not be overwritten.');
}
const documents = pages();
const segments = translationSegments(documents);
let bucket = [];
let words = 0;
let packet = 1;
for (const segment of segments) {
  const cost = segment.text.split(/\s+/).length;
  if (words + cost > 2500 && bucket.length) {
    fs.writeFileSync(path.join(destination, `packet-${String(packet++).padStart(2, '0')}.json`), JSON.stringify(bucket, null, 2));
    bucket = [];
    words = 0;
  }
  bucket.push(segment);
  words += cost;
}
if (bucket.length) fs.writeFileSync(path.join(destination, `packet-${String(packet).padStart(2, '0')}.json`), JSON.stringify(bucket, null, 2));
fs.writeFileSync(path.join(destination, 'pages.json'), JSON.stringify(documents.map(({ tokens, ...metadata }) => metadata), null, 2));
console.log(`${documents.length} pages, ${segments.length} unique segments, ${segments.reduce((sum, segment) => sum + segment.text.split(/\s+/).length, 0)} words, ${packet} translation packets.`);
