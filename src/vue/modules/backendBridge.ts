/**
 * Backend means the Electron part of the application.
 * In order for the frontend (the Vue application) to send data towards the backend, there are a few helper methods.
 * To avoid that certain methods have to be called via window, a mapping is done.
 */
export const getFromBackend = window.getFromBackend;

export const sendToBackend = window.sendToBackend;

export const registerBackendListener = window.registerBackendListener;

export const registerBackendListenerOnce = window.registerBackendListenerOnce;
