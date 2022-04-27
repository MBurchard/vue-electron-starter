import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

/**
 * Send something to the Electron backend using a specific channel and await a response.
 *
 * @param channel
 * @param args
 */
contextBridge.exposeInMainWorld('getFromBackend',
  async function(channel: string, ...args: unknown[]): Promise<unknown> {
    try {
      return ipcRenderer.invoke(channel, ...args);
    } catch (e) {
      console.error(`Error in getFromBackend on channel '${channel}':`, e);
    }
  });

/**
 * Send something to the backend using a specific channel.
 *
 * @param channel
 * @param args
 */
contextBridge.exposeInMainWorld('sendToBackend',
  function(channel: string, ...args: unknown[]): void {
    try {
      ipcRenderer.send(channel, ...args);
    } catch (e) {
      console.error(`Error in sendToBackend on channel '${channel}'::`, e);
    }
  });

/**
 * Register a listener that will be invoked every time, when the backend is sending something on a specific channel.
 *
 * @param channel
 * @param listener
 */
contextBridge.exposeInMainWorld('registerBackendListener',
  function(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void {
    try {
      ipcRenderer.on(channel, listener);
    } catch (e) {
      console.error(`Error in registered Electron backend listener on channel '${channel}'::`, e);
    }
  });

/**
 * Register a listener that will be invoked once, when the backend is sending something on a specific channel.
 *
 * @param channel
 * @param listener
 */
contextBridge.exposeInMainWorld('registerBackendListenerOnce',
  function(channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void): void {
    try {
      ipcRenderer.once(channel, listener);
    } catch (e) {
      console.error(`Error in registered Electron backend listener (once) on channel '${channel}'::`, e);
    }
  });
