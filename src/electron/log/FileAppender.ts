/* eslint-disable @typescript-eslint/no-explicit-any */
import {Appender} from '@/common/simpleLog';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';

export interface FileAppenderOptions {
  basename: string;
  extension?: string;
  path: string;
  pattern?: string;
}

export class FileAppender implements Appender {
  private readonly options: FileAppenderOptions;
  private stream: undefined | fs.WriteStream;
  private currentFileName: undefined | string;

  constructor(options: FileAppenderOptions) {
    this.options = options;
  }

  private getAbsolutFilePath() {
    let fileName = this.options.basename;
    if (this.options.pattern) {
      try {
        fileName += '.' + dayjs().format(this.options.pattern);
      } catch (e) {
        console.error(`Error in date pattern '${this.options.pattern}' for FileAppender`, e);
      }
    }
    fileName += '.' + (this.options.extension || 'log');
    return path.join(this.options.path, fileName);
  }

  private prepareStream(): fs.WriteStream {
    if (this.stream === undefined) {
      this.currentFileName = this.getAbsolutFilePath();
      this.stream = fs.createWriteStream(this.currentFileName, {flags: 'a+'});
    } else {
      const currentFileName = this.getAbsolutFilePath();
      if (this.currentFileName !== currentFileName) {
        this.stream.end();
        this.currentFileName = currentFileName;
        this.stream = fs.createWriteStream(this.currentFileName, {flags: 'a+'});
      }
    }
    return this.stream;
  }

  private toText(...args: any[]) {
    const buffer: string[] = [];
    args.forEach(arg => {
      if (arg instanceof Object) {
        buffer.push(JSON.stringify(arg));
      } else {
        buffer.push('' + arg);
      }
    });
    return buffer.join(' ');
  }

  async log(...args: any[]): Promise<void> {
    const stream = this.prepareStream();
    try {
      stream.cork();
      stream.write(this.toText(...args) + '\n', (err) => {
        if (err) {
          console.error('Error writing to file', err);
        }
      });
      process.nextTick(() => stream.uncork());
    } catch (e) {
      console.error('Error handling file stream', e);
    }
  }
}
