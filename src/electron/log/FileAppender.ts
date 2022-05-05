/* eslint-disable @typescript-eslint/no-explicit-any */
import {Appender} from '@/common/simpleLog';
import fs from 'fs';
import path from 'path';

export interface FileAppenderOptions {
  filename: string;
  path: string;
}

export class FileAppender implements Appender {
  private readonly options: FileAppenderOptions;
  private stream: undefined | fs.WriteStream;

  constructor(options: FileAppenderOptions) {
    this.options = options;
  }

  private getAbsolutFilePath() {
    return path.join(this.options.path, this.options.filename);
  }

  private prepareStream(): fs.WriteStream {
    if (this.stream === undefined) {
      this.stream = fs.createWriteStream(this.getAbsolutFilePath(), {flags: 'a+'});
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
