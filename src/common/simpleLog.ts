import dayjs from 'dayjs';

export type LogLevel = 'DEBUG' | 'ERROR' | 'INFO' | 'TRACE' | 'WARN';

/**
 * An Appender interface that is able to log asynchronously.
 */
export interface Appender {
  log: (...args: unknown[]) => Promise<void>
}

/**
 * A wrapper for the console log, because this is not asynchron by default.
 */
export class ConsoleWrapper implements Appender {
  async log(...args: unknown[]): Promise<void> {
    console.log(...args);
  }
}

const appender: Appender[] = [new ConsoleWrapper()];

/**
 * Logging configuration.
 */
export interface LoggerConfig {
  appender: Appender[]
}

class Logger {
  private readonly category;

  constructor(category: string) {
    this.category = category;
  }

  debug(...args: unknown[]): void {
    this.log('DEBUG', ...args);
  }

  error(...args: unknown[]): void {
    this.log('ERROR', ...args);
  }

  info(...args: unknown[]): void {
    this.log('INFO', ...args);
  }

  log(level: LogLevel, ...args: unknown[]): void {
    appender.forEach(it => it.log(formatPrefix(level, this.category), ...args));
  }

  warn(...args: unknown[]): void {
    this.log('WARN', ...args);
  }
}

const logger = new Map<string, Logger>();

/**
 * Should be called first to configure the logging.
 *
 * @param options
 */
export function configureLogging(options: LoggerConfig) {
  if (options.appender && options.appender.length > 0) {
    appender.splice(0, appender.length);
    appender.push(...options.appender);
  }
}

function formatLogLevel(level: LogLevel): string {
  switch (level) {
    case 'DEBUG': return '\x1B[36mDEBUG\x1B[m';
    case 'ERROR': return '\x1B[91mERROR\x1B[m';
    case 'INFO': return ' \x1B[32mINFO\x1B[m';
    case 'TRACE': return 'TRACE';
    case 'WARN': return ' \x1B[33mWARN\x1B[m';
  }
}

function formatPrefix(level: LogLevel, category: string): string {
  return `${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')} ${formatLogLevel(level)} [${category.padEnd(20, ' ')}]:`;
}

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

/**
 * Directly logs to all registered Appender without using a Logger class with additional formatting.
 * This is mainly used for the frontend to backend logging bridge.
 *
 * @param args
 */
export function logDirect(...args: unknown[]): void {
  appender.forEach(it => it.log(...args));
}

/**
 * Prepares a Logger if not already there and returns it.
 *
 * @param category
 */
export function useLogger(category?: string): Logger {
  if (category) {
    return init(category);
  }
  return init('default');
}
