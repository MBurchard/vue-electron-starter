import {LogLevel, useLogger} from '@/common/simpleLog';
import {changeLanguage} from '@/electron/frontendI18nBridge';
import {app, BrowserWindow, Menu, MenuItemConstructorOptions} from 'electron';
import {i18n} from 'i18next';

const isMac = process.platform === 'darwin';
const log = useLogger('electron-main-menu', LogLevel.DEBUG);

/**
 * Create menu entries.
 * A full example is available at https://www.electronjs.org/de/docs/latest/api/menu#beispiele
 * Attention: This full example does not work well with TypeScript. The submenu entries are not recognised as
 * MenuItemConstructorOptions[]. Consider to define submenus as separately typed variables.
 * For the demo purpose we just need some basic menu entries.
 */
function getTemplate(win: BrowserWindow, i18n: i18n): MenuItemConstructorOptions[] {
  const langMenu: MenuItemConstructorOptions[] = ['de', 'en'].map(code => {
    return {
      label: i18n.t(code),
      type: 'radio',
      checked: i18n.language === code,
      click: () => {
        changeLanguage(win, code);
      },
    };
  });
  if (isMac) {
    return [{
      label: app.name,
      submenu: [{
        label: i18n.t('Quit'),
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        },
      }],
    }, {
      label: i18n.t('&Language'),
      submenu: langMenu,
    }];
  }
  return [{
    label: i18n.t('&File'),
    submenu: [{
      label: i18n.t('&Quit'),
      accelerator: 'Ctrl+Shift+Q',
      click: function() {
        app.quit();
      },
    }],
  }, {
    label: i18n.t('&Language'),
    submenu: langMenu,
  }];
}

export function buildMenu(win: BrowserWindow, i18n: i18n) {
  log.debug('build Menu');
  const menu = Menu.buildFromTemplate(getTemplate(win, i18n));
  if (isMac) {
    Menu.setApplicationMenu(menu);
  } else {
    win.setMenu(menu);
  }
}
