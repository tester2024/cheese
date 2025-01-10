import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value);
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  invoke(channel: string, value: unknown): Promise<unknown> {
    return ipcRenderer.invoke(channel, value);
  },

  once(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => {
      ipcRenderer.removeListener(channel, subscription);
      callback(...args);
    };
    ipcRenderer.once(channel, subscription);
  },
  off(channel: string, callback: (...args: unknown[]) => void) {
    ipcRenderer.off(channel, callback);
  }
};

contextBridge.exposeInMainWorld('ipc', handler);
export type IpcHandler = typeof handler;