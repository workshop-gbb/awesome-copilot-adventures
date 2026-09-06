export function greeting(name) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new TypeError('Name must be a nonblank string.');
  }
  return `Welcome, ${name}!`;
}
