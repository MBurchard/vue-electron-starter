import {i18n} from '@/common/i18n.config';
import {configureLogging, ConsoleWrapper, LogLevel, useLogger} from '@/common/simpleLog';
import {registerFrontendHandler} from '@/electron/frontendBridge';
import {initFrontendI18nBridge} from '@/electron/frontendI18nBridge';
import {FileAppender} from '@/electron/log/FileAppender';
import {initFrontendLoggingBridge} from '@/electron/log/frontendLoggingBridge';
import {buildMenu} from '@/electron/menu';
import {app, BrowserWindow, protocol} from 'electron';
import installExtension, {VUEJS3_DEVTOOLS} from 'electron-devtools-installer';
import path from 'path';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

configureLogging({
  appender: [new ConsoleWrapper(), new FileAppender({filename: 'log.txt', path: 'd:\\temp'})],
});
const log = useLogger('electron-main', LogLevel.TRACE);

initFrontendLoggingBridge();
initFrontendI18nBridge();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

// Transparency support on Linux
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals');
  app.commandLine.appendSwitch('disable-gpu');
}

registerFrontendHandler('testChannel', async (event, name: string) => {
  log.trace('Test testChannel:', name);
  log.debug('Test testChannel:', name);
  log.info('Test testChannel:', name);
  log.warn('Test testChannel:', name);
  log.error('Test testChannel:', name);
  log.fatal('Test testChannel:', name);
  return `Hello ${name}`;
});

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html').then();
  }
  return win;
}

async function initMainWindow(): Promise<BrowserWindow> {
  let win: BrowserWindow | null = await createWindow();
  win.on('closed', () => {
    win = null;
  });
  buildMenu(win, i18n);
  i18n.on('languageChanged', (lng) => {
    log.debug('i18n languageChanged:', lng);
    if (win) {
      buildMenu(win, i18n);
    }
  });
  return win;
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (isMac) {
    app.quit();
  }
});

app.on('activate', async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await initMainWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      log.error('Vue Devtools failed to install:', e);
    }
  }
  await initMainWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
