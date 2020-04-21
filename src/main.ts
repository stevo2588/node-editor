import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { promises as fs } from 'fs';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
// declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 700,
    width: 1000,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
      // preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // @ts-ignore
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
  if (mainWindow === null) {
    createWindow();
  }
});


async function saveFile(filename: string, contents: string) {
  const projFilename = path.join(app.getPath('desktop'), filename);
  await fs.writeFile(projFilename, contents, 'utf8');
  return projFilename;
};

async function loadFile(filename: string) {
  const projFilename = path.join(app.getPath('desktop'), filename);
  return fs.readFile(projFilename, 'utf8');
};

ipcMain.handle("toMain", async (event, ...args) => {
  const [func, ...params] = args;

  switch (func) {
    case 'saveFile':
      return saveFile(params[0], params[1]);
    case 'loadFile':
      return loadFile(params[0]);
  
    default:
      break;
  }
});
