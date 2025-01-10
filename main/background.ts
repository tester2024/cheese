import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import serve from 'electron-serve';
import minecraft from 'minecraft-protocol';
import { minecraftProxyServer } from './proxyserver';
import { ProxyStart } from './vars';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    width: 1000,
    center: true,
    darkTheme: true,
    title: 'Cheese Minecraft Packet Monitor',
    height: 600,
    maxWidth: 2000,
    maxHeight: 600,
    maximizable: false,
    show: false,
    hasShadow: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hiddenInset',
    icon: path.join('resources', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      disableHtmlFullscreenWindowResize: true,
      nodeIntegration: false,
      devTools: !isProd,
      defaultEncoding: 'utf-8',
      disableBlinkFeatures: 'AuxClick,BackForward,SavePageAsMHTML,SitePerProcess,TouchEditing,TermsOfService',
      webSecurity: true,
      javascript: true,
      webviewTag: false,
      backgroundThrottling: false,
      safeDialogs: true
    },
    backgroundColor: '#fff'
  });


  mainWindow.removeMenu();

  if (isProd) {
    await mainWindow.loadURL('app://./home');
    mainWindow.show();
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
    mainWindow.show();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

app.on('before-quit', async () => {
  if (!minecraftProxyServer) return;
  await minecraftProxyServer.end();
});

ipcMain.on('errors', async (_, arg) => {
  console.log('Client Error: ' + arg);
});

ipcMain.on('handshake', async (event, _) => {
  event.reply('handshake', {
    defaultVersion: "1.19.4", // minecraft.defaultVersion todo
    supportedVersions: minecraft.supportedVersions
  });
});

ipcMain.on('start-proxy', async (event, proxyStart: ProxyStart) => {
  event.reply('start-proxy', { success: await minecraftProxyServer.start(proxyStart) });
});

ipcMain.on('stop-proxy', async (event) => {
  if (!minecraftProxyServer) return;
  await minecraftProxyServer.end();
  event.reply('stop-proxy', {});
});