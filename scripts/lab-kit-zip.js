const { crc32 } = require('node:zlib');

function safeEntryName(name) {
  return typeof name === 'string' && name.length > 0 && !name.startsWith('/')
    && !/[\\:\u0000-\u001f]/.test(name)
    && name.split('/').every(part => part && part !== '.' && part !== '..');
}

// STORE avoids compression-library differences in otherwise identical ZIP bytes.
function createZip(entries) {
  if (!entries.length || entries.length >= 65535) throw new Error('Kit exceeds classic ZIP entry limits.');
  const names = new Set();
  const local = [];
  const central = [];
  let offset = 0;
  for (const entry of [...entries].sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    if (!safeEntryName(entry.name)) throw new Error(`Unsafe ZIP entry: ${entry.name}`);
    const folded = entry.name.toLowerCase();
    if (names.has(folded)) throw new Error(`Duplicate ZIP entry: ${entry.name}`);
    names.add(folded);
    const name = Buffer.from(entry.name, 'utf8');
    const data = Buffer.from(entry.data);
    if (name.length > 65535 || data.length >= 0xffffffff
        || offset + 30 + name.length + data.length >= 0xffffffff) {
      throw new Error('Kit exceeds classic ZIP size limits; split the exercise.');
    }
    const checksum = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(33, 12);
    header.writeUInt32LE(checksum, 14);
    header.writeUInt32LE(data.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, data);

    const record = Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(0x0314, 4);
    header.copy(record, 6, 4, 28);
    record.writeUInt32LE(((entry.executable ? 0o100755 : 0o100644) * 65536) >>> 0, 38);
    record.writeUInt32LE(offset, 42);
    central.push(record, name);
    offset += header.length + name.length + data.length;
  }
  const centralSize = central.reduce((size, buffer) => size + buffer.length, 0);
  if (offset + centralSize >= 0xffffffff) throw new Error('Kit requires ZIP64; split the exercise.');
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, ...central, end]);
}

module.exports = { createZip, safeEntryName };
