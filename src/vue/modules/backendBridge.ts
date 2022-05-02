import {deepCopy} from '@/common/utils';

/**
 * Backend means the Electron part of the application.
 * In order for the frontend (the Vue application) to send data towards the backend, there are a few helper methods.
 * To avoid that certain methods have to be called via window, a mapping is done.
 */

/**
 * Get something from the electron backend and await a future response.
 *
 * @param channel text channel name, that must be available at the backend
 * @param args any additional parameters/data
 * @return Promise
 */
export async function getFromBackend(channel: string, ...args: unknown[]): Promise<unknown> {
  return window.getFromBackend(channel, ...args.map(elem => deepCopy(elem)));
}

/**
 * Send something to the electron backend without expecting a response.
 *
 * @param channel text channel name, that must be available at the backend
 * @param args any additional parameters/data
 */
export function sendToBackend(channel: string, ...args: unknown[]): void {
  window.sendToBackend(channel, ...args.map(elem => deepCopy(elem)));
}

export const registerBackendListener = window.registerBackendListener;

export const registerBackendListenerOnce = window.registerBackendListenerOnce;
