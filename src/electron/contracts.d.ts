interface Exposed {
  readonly getFromBackend: (channel: string, ...args: unknown[]) => Promise<unknown>;
  readonly sendToBackend: (channel: string, ...args: unknown[]) => void;
  readonly registerBackendListener: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
  readonly registerBackendListenerOnce: (channel: string, listener: (event: IpcRendererEvent, ...args: unknown[]) => void) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Window extends Exposed {}
