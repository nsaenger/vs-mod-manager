import { app, BrowserWindow, ipcMain, screen } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { ModRelease } from '../src/app/shared/interfaces/modinfo';
import { downloadMod, getGameVersion, loadModsNamesFromDisk, removeMod } from './mod-api-connector';
import fetch from 'electron-fetch';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: size.width / 2 - 1024 / 2 ,
    y: size.height / 2 - 1200 / 2 ,
    width: 1024,
    height: 1200,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,  // false if you want to run e2e test with Spectron
    },
  });

  win.webContents.openDevTools();

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  ipcMain.on('loadModsFromDisk', (event) => {
    loadModsNamesFromDisk()
      .then(modNames => event.sender.send('loadedMods', modNames))
      .catch(error => event.sender.send('loadedModsError', error));
  });

  ipcMain.on('getGameVersion', (event, location: string) => {
    getGameVersion(location)
      .then(version => event.sender.send('gameVersion', version))
      .catch(error => event.sender.send('gameVersionError', error));
  });

  ipcMain.on('fetch', (event, uri: string) => {
    fetch(uri)
      .then(async response => event.sender.send(`fetched-${uri}`, await response.json()))
      .catch(error => event.sender.send(`fetchedError-${uri}`, error));
  });

  ipcMain.on('downloadMod', (event, modRelease: ModRelease) => {
    downloadMod(modRelease)
      .then(response => event.sender.send(`modDownloaded`, response))
      .catch(error => event.sender.send(`modDownloaded`, error));
  });

  ipcMain.on('removeMod', (event, modName: string) => {
    removeMod(modName)
      .then(response => event.sender.send(`modRemoved`, response))
      .catch(error => event.sender.send(`modRemoved`, error));
  });

  ipcMain.on('close', () => {
    app.exit();
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => setTimeout(createWindow, 400));

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
