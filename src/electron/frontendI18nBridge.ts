import {i18n} from '@/common/i18n.config';
import {registerFrontendListener, sendToFrontend} from '@/electron/frontendBridge';
import {BrowserWindow} from 'electron';

let initialised = false;

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

export function changeLanguage(win: BrowserWindow, lng: string): void {
  i18n.changeLanguage(lng).then();
  sendToFrontend(win, 'languageChanged', lng);
}
