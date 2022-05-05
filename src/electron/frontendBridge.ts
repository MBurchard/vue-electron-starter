/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * By frontend, we mean the Vue application that runs in the browser window.
 * To allow the backend (the Electron part of the application) to send data towards the frontend,
 * a few helper methods are defined here.
 */
import {BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent} from 'electron';

/**
 * Register a handler that will be invoked, when the frontend is sending something on a specific channel.
 * The handler is able to return a result to the frontend.
 *
 * @param channel
 * @param handler
 */
export function registerFrontendHandler(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<any>
): void {
  ipcMain.handle(channel, handler);
}

/**
 * Register a listener that will be invoked, when the frontend is sending something on a specific channel.
 * The listener is unable to return a result to the frontend, use registerFrontEndHandler instead.
 *
 * @param channel
 * @param listener
 */
export function registerFrontendListener(
  channel: string,
  listener: (event: IpcMainEvent, ...args: any[]) => void
): void {
  ipcMain.on(channel, listener);
}

/**
 * Register a listener that will be invoked once, when the frontend is sending something on a specific channel.
 * The listener is unable to return a result to the frontend, use registerFrontEndHandler instead.
 *
 * @param channel
 * @param listener
 */
export function registerFrontendListenerOnce(
  channel: string,
  listener: (event: IpcMainEvent, ...args: any[]) => void
): void {
  ipcMain.once(channel, listener);
}

/**
 * Send something to the frontend using a specific channel.
 *
 * @param win
 * @param channel
 * @param args
 */
export function sendToFrontend(win: BrowserWindow, channel: string, ...args: any[]): void {
  if (win && !win.isDestroyed()) {
    win.webContents.send(channel, ...args);
  }
}
