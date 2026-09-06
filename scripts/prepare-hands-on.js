const fs = require('node:fs');
const path = require('node:path');
const { root } = require('./repository-files');

const collection = path.join(root, 'mslearn-github-copilot');
const catalog = JSON.parse(fs.readFileSync(path.join(collection, 'catalog.json'), 'utf8'));

function inside(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function parseArguments(args) {
  if (args.length !== 4 || args[0] !== '--lab' || args[2] !== '--destination') {
    throw new Error('Usage: node scripts/prepare-hands-on.js --lab <id> --destination <unused absolute path outside this repository>');
  }
  return { id: args[1], destination: args[3] };
}

function prepare({ id, destination }) {
  const lab = catalog.labs.find(item => item.id === id);
  if (!lab) throw new Error(`Unknown lab "${id}". See mslearn-github-copilot/catalog.json.`);
  if (!lab.fixture) throw new Error(`${id} is a preparation guide; it has no fixture to copy.`);
  if (!path.isAbsolute(destination)) throw new Error('Destination must be an absolute path on your work drive.');

  const source = fs.realpathSync(path.join(collection, lab.fixture));
  const target = path.resolve(destination);
  if (!inside(collection, source)) throw new Error('The fixture must remain inside the hands-on collection.');
  if (fs.existsSync(target)) throw new Error(`Refusing to overwrite existing destination: ${target}`);
  if (inside(root, target) || inside(target, root)) throw new Error('Choose a destination outside, and not above, the curriculum repository.');
  const parent = path.dirname(target);
  if (!fs.existsSync(parent)) throw new Error(`Create and inspect the destination parent first: ${parent}`);
  const realTarget = path.join(fs.realpathSync(parent), path.basename(target));
  if (inside(fs.realpathSync(root), realTarget) || inside(realTarget, fs.realpathSync(root))) {
    throw new Error('Destination resolves into or above the curriculum repository through a symbolic link.');
  }

  const excluded = new Set(['.git', 'bin', 'obj', 'node_modules', '.venv', '__pycache__', '.pytest_cache', 'reference', 'TestResults']);
  fs.cpSync(source, target, {
    recursive: true,
    errorOnExist: true,
    force: false,
    filter(filename) {
      const relative = path.relative(source, filename);
      if (relative.split(path.sep).some(part => excluded.has(part))) return false;
      if (fs.lstatSync(filename).isSymbolicLink()) throw new Error(`Fixture contains a symbolic link; review it before copying: ${filename}`);
      return true;
    }
  });
  fs.copyFileSync(path.join(collection, 'LICENSE'), path.join(target, 'HANDS-ON-LICENSE.txt'), fs.constants.COPYFILE_EXCL);
  console.log(`Prepared ${id}: ${target}`);
  console.log('No dependencies were installed and no code was executed. Open this copy as the workspace root.');
}

if (require.main === module) {
  try {
    prepare(parseArguments(process.argv.slice(2)));
  } catch (error) {
    console.error(`Hands-on preparation failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { prepare, parseArguments };
