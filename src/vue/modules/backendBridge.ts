import {cloneArgs} from '@/common/utils';

/**
 * Backend means the Electron part of the application.
 * In order for the frontend (the Vue application) to send data towards the backend, there are a few helper methods.
 * To avoid that certain methods have to be called via window, a mapping is done.
 */
export async function getFromBackend(channel: string, ...args: unknown[]): Promise<unknown> {
  return window.getFromBackend(channel, ...cloneArgs(...args));
}

export function sendToBackend(channel: string, ...args: unknown[]): void {
  window.sendToBackend(channel, ...cloneArgs(...args));
}

export const registerBackendListener = window.registerBackendListener;

export const registerBackendListenerOnce = window.registerBackendListenerOnce;
