const fs = require('node:fs');
const path = require('node:path');
const { translationSegments, pages } = require('./site-content');

const destination = process.argv[2];
if (!destination || !path.isAbsolute(destination) || !destination.startsWith('/Volumes/T9/')) {
  throw new Error('Provide an absolute T9 directory for translation work packets.');
}
fs.mkdirSync(destination, { recursive: true });
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
