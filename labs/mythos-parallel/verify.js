const path = require('node:path');

(async () => {
  try {
    const { runInParallel } = require(path.join(__dirname, 'starter', 'parallel.js'));
    const started = [];
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    const tasks = [0, 1, 2].map((index) => async () => {
      started.push(index);
      await gate;
      if (index === 1) throw new Error('rune cracked');
      return `rune-${index}`;
    });

    const pending = runInParallel(tasks);
    await Promise.resolve();
    const failures = [];
    if (JSON.stringify(started) !== JSON.stringify([0, 1, 2])) {
      failures.push('all tasks must start before the first task settles');
    }
    release();
    const results = await pending;
    const expected = [
      { index: 0, status: 'fulfilled', value: 'rune-0' },
      { index: 1, status: 'rejected', error: 'rune cracked' },
      { index: 2, status: 'fulfilled', value: 'rune-2' }
    ];
    if (JSON.stringify(results) !== JSON.stringify(expected)) failures.push('results must be normalized in input order');

    let validationStarts = 0;
    let rejected = false;
    try {
      await runInParallel([() => { validationStarts += 1; }, 'not-a-task']);
    } catch {
      rejected = true;
    }
    if (!rejected || validationStarts !== 0) failures.push('validate every task before starting any task');

    if (failures.length) {
      console.error(`Mythos Parallel verification failed:\n- ${failures.join('\n- ')}`);
      process.exit(1);
    }
    console.log('Mythos Parallel verification passed: work starts concurrently and evidence stays ordered.');
  } catch (error) {
    console.error(`Mythos Parallel verification failed: ${error.message}`);
    process.exit(1);
  }
})();
