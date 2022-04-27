import {Appender} from '@/common/simpleLog';
import {sendToBackend} from '@/vue/modules/backendBridge';

export class BackendLoggingAppender implements Appender {
  async log(...args: unknown[]): Promise<void> {
    sendToBackend('logging', ...args);
  }
}
