const assert = require('assert/strict');
const patterns = require('./lib/patterns');
const HistoricalAnalyzer = require('./lib/history');
const Logger = require('./lib/logger');

Logger.setLevel(4);

const tests = [];

function test(name, operation) {
  tests.push({ name, operation });
}

test('detects arithmetic progressions', () => {
  const result = patterns.detectPattern([3, 6, 9, 12]);
  assert.equal(result.pattern, 'arithmetic');
  assert.equal(result.nextValue, 15);
});

test('detects negative arithmetic progressions', () => {
  assert.equal(patterns.detectPattern([10, 7, 4, 1]).nextValue, -2);
});

test('detects geometric progressions', () => {
  const result = patterns.detectPattern([2, 4, 8, 16]);
  assert.equal(result.pattern, 'geometric');
  assert.equal(result.nextValue, 32);
});

test('detects Fibonacci-style sequences', () => {
  const result = patterns.detectPattern([1, 1, 2, 3, 5, 8]);
  assert.equal(result.pattern, 'fibonacci');
  assert.equal(result.nextValue, 13);
});

test('detects quadratic sequences', () => {
  const result = patterns.detectPattern([1, 4, 9, 16, 25]);
  assert.equal(result.pattern, 'quadratic');
  assert.equal(result.nextValue, 36);
});

test('rejects unsupported random sequences', () => {
  assert.equal(patterns.detectPattern([1, 5, 2, 8, 3]).success, false);
});

test('rejects non-array input', () => {
  assert.equal(patterns.validateSequence('invalid').valid, false);
});

test('rejects non-finite numbers', () => {
  assert.equal(patterns.validateSequence([1, 2, Infinity]).valid, false);
});

test('predicts multiple arithmetic values', () => {
  const result = patterns.predictMultiple([2, 4, 6, 8], 5);
  assert.deepEqual(result.predictions, [10, 12, 14, 16, 18]);
});

test('predicts multiple geometric values', () => {
  const result = patterns.predictMultiple([1, 2, 4, 8], 3);
  assert.deepEqual(result.predictions, [16, 32, 64]);
});

test('generates arithmetic sequences', () => {
  assert.deepEqual(
    patterns.generateSequence('arithmetic', { start: 5, difference: 3 }, 5),
    [5, 8, 11, 14, 17]
  );
});

test('generates geometric sequences', () => {
  assert.deepEqual(
    patterns.generateSequence('geometric', { start: 2, ratio: 3 }, 5),
    [2, 6, 18, 54, 162]
  );
});

test('generates Fibonacci sequences', () => {
  assert.deepEqual(
    patterns.generateSequence('fibonacci', { f1: 1, f2: 1 }, 8),
    [1, 1, 2, 3, 5, 8, 13, 21]
  );
});

test('records and returns history without exposing internal arrays', () => {
  const analyzer = new HistoricalAnalyzer();
  analyzer.record([1, 2, 3], { success: true, pattern: 'arithmetic', nextValue: 4 });
  const history = analyzer.getHistory();
  history[0].sequence.push(99);
  assert.deepEqual(analyzer.getHistory()[0].sequence, [1, 2, 3]);
});

test('calculates observed statistics', () => {
  const analyzer = new HistoricalAnalyzer();
  analyzer.record([1, 2, 3], {
    success: true,
    pattern: 'arithmetic',
    nextValue: 4,
    processingTime: 2
  });
  const statistics = analyzer.getStatistics();
  assert.equal(statistics.totalAnalyzed, 1);
  assert.equal(statistics.successRate, 100);
  assert.equal(statistics.mostCommonPattern, 'arithmetic');
});

test('finds prefix-related historical sequences', () => {
  const analyzer = new HistoricalAnalyzer();
  analyzer.record([1, 2, 3, 4], { success: true, pattern: 'arithmetic', nextValue: 5 });
  assert.equal(analyzer.findSimilar([1, 2, 3]).length, 1);
});

test('clears history', () => {
  const analyzer = new HistoricalAnalyzer();
  analyzer.record([1, 2], { success: true, pattern: 'arithmetic', nextValue: 3 });
  analyzer.clear();
  assert.equal(analyzer.getHistory().length, 0);
});

test('handles a 10,000-element arithmetic sequence', () => {
  const sequence = Array.from({ length: 10_000 }, (_, index) => index * 3);
  const result = patterns.detectPattern(sequence);
  assert.equal(result.success, true);
  assert.equal(result.nextValue, 30_000);
});

let passed = 0;
for (const { name, operation } of tests) {
  try {
    operation();
    passed++;
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

console.log(`${passed}/${tests.length} tests passed`);
process.exit(passed === tests.length ? 0 : 1);
