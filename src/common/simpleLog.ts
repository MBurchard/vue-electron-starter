import dayjs from 'dayjs';

export enum LogLevel {
  'DEBUG' = 10000,
  'ERROR' = 1000,
  'INFO' = 5000,
  'TRACE' = 20000,
  'WARN' = 2000,
}

/**
 * An Appender interface that is able to log asynchronously.
 */
export interface Appender {
  log: (...args: unknown[]) => Promise<void>;
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
  appender: Appender[];
}

class Logger {
  private readonly category: string;
  private readonly logLevel: LogLevel;

  constructor(category: string, logLevel: LogLevel) {
    this.category = category;
    this.logLevel = logLevel;
  }

  debug(...args: unknown[]): void {
    this.log(LogLevel.DEBUG, ...args);
  }

  error(...args: unknown[]): void {
    this.log(LogLevel.ERROR, ...args);
  }

  info(...args: unknown[]): void {
    this.log(LogLevel.INFO, ...args);
  }

  log(level: LogLevel, ...args: unknown[]): void {
    if (level <= this.logLevel) {
      appender.forEach(it => it.log(formatPrefix(level, this.category), ...args));
    }
  }

  warn(...args: unknown[]): void {
    this.log(LogLevel.WARN, ...args);
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
    case LogLevel.DEBUG:
      return '\x1B[36mDEBUG\x1B[m';
    case LogLevel.ERROR:
      return '\x1B[91mERROR\x1B[m';
    case LogLevel.INFO:
      return ' \x1B[32mINFO\x1B[m';
    case LogLevel.TRACE:
      return 'TRACE';
    case LogLevel.WARN:
      return ' \x1B[33mWARN\x1B[m';
  }
}

function formatPrefix(level: LogLevel, category: string): string {
  return `${dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')} ${formatLogLevel(level)} [${category.padEnd(20, ' ')}]:`;
}

function init(category: string, logLevel: LogLevel): Logger {
  if (!logger.has(category)) {
    logger.set(category, new Logger(category, logLevel));
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
 * @param category defaults to main
 * @param logLevel defaults to LogLevel.INFO
 */
export function useLogger(category?: string, logLevel?: LogLevel): Logger {
  return init(category || 'main', logLevel || LogLevel.INFO);
}
