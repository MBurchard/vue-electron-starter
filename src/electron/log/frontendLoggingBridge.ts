import {logDirect} from '@/common/simpleLog';
import {registerFrontendListener} from '@/electron/frontendBridge';

let initialised = false;

/**
 * Registers a frontend listener on channel 'logging'.
 */
export function initFrontendLoggingBridge() {
  if (!initialised) {
    registerFrontendListener('logging', (event, ...args) => {
      logDirect(...args);
    });
    initialised = true;
  } else {
    console.error('FrontendLoggingBridge has already been initialised');
  }
}
