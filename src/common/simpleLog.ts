import dayjs from 'dayjs';

class Logger {
  private readonly category;

  constructor(category: string) {
    this.category = category;
  }

  debug(...args: unknown[]): void {
    console.debug(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'), `\x1B[36mDEBUG\x1B[m [${this.category.padEnd(20, ' ')}]:`, ...args);
  }

  error(...args: unknown[]): void {
    console.error(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
      `\x1B[91mERROR\x1B[m [${this.category.padEnd(20, ' ')}]:`, ...args);
  }

  info(...args: unknown[]): void {
    console.info(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'), ` \x1B[32mINFO\x1B[m [${this.category.padEnd(20, ' ')}]:`, ...args);
  }

  warn(...args: unknown[]): void {
    console.warn(dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'), ` \x1B[33mWARN\x1B[m [${this.category.padEnd(20, ' ')}]:`, ...args);
  }
}

const logger = new Map<string, Logger>();

function init(category: string): Logger {
  if (!logger.has(category)) {
    logger.set(category, new Logger(category));
  }
  const log = logger.get(category);
  if (log) {
    return log;
  }
  throw new Error(`Initialisation of Logger ${category} failed`);
}

export function useLogger(category?: string): Logger {
  if (category) {
    return init(category);
  }
  return init('default');
}
