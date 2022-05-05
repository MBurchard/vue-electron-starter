/* eslint-disable @typescript-eslint/no-explicit-any */
import {Appender} from '@/common/simpleLog';
import {sendToBackend} from '@/vue/modules/backendBridge';

export class BackendLoggingAppender implements Appender {
  async log(...args: any[]): Promise<void> {
    sendToBackend('logging', ...args);
  }
}
