/* eslint-disable @typescript-eslint/no-explicit-any */
interface Exposed {
  readonly getFromBackend: (channel: string, ...args: any[]) => Promise<any>;
  readonly sendToBackend: (channel: string, ...args: any[]) => void;
  readonly registerBackendListener: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
  readonly registerBackendListenerOnce: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
