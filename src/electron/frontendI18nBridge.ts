import {i18n} from '@/common/i18n.config';
import {registerFrontendListener, sendToFrontend} from '@/electron/frontendBridge';
import {BrowserWindow} from 'electron';

let initialised = false;

/**
 * Registers a frontend listener on channel 'languageChanged'.
 */
export function initFrontendI18nBridge() {
  if (!initialised) {
    registerFrontendListener('languageChanged', (event, lng: string) => {
      i18n.changeLanguage(lng).then();
    });
    initialised = true;
  } else {
    console.error('FrontendLoggingBridge has already been initialised');
  }
}

/**
 * Use this function to change the language in the backend.
 * Avoid circular triggering when communication between front- and backend.
 *
 * @param win
 * @param lng
 */
export function changeLanguage(win: BrowserWindow, lng: string): void {
  // this is as off Electron version >=18 sadly the only way to change the locale and sadly the only way to change menu
  // accelerators to be shown in the correct language. This also means you may change the language at runtime but need to
  // restart the whole application to correct that bad behaviour...
  // app.commandLine.appendSwitch('lang', 'en');

  i18n.changeLanguage(lng).then();
  sendToFrontend(win, 'languageChanged', lng);
}
