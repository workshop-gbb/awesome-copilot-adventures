const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4
};

class Logger {
  static level = LEVELS.info;

  static setLevel(level) {
    if (!Number.isInteger(level) || level < LEVELS.debug || level > LEVELS.silent) {
      throw new Error('Logger level must be an integer between 0 and 4');
    }
    Logger.level = level;
  }

  static write(level, message, details) {
    if (LEVELS[level] < Logger.level) return;
    const suffix = details === undefined
      ? ''
      : ` ${details instanceof Error ? details.stack || details.message : JSON.stringify(details)}`;
    const output = `[${level.toUpperCase()}] ${message}${suffix}`;
    if (level === 'error') console.error(output);
    else if (level === 'warn') console.warn(output);
    else console.log(output);
  }

  static debug(message, details) {
    Logger.write('debug', message, details);
  }

  static info(message, details) {
    Logger.write('info', message, details);
  }

  static warn(message, details) {
    Logger.write('warn', message, details);
  }

  static error(message, details) {
    Logger.write('error', message, details);
  }
}

module.exports = Logger;
