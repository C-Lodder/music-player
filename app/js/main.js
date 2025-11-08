// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { join } = require('node:path')
const { promises, constants } = require('node:fs')
const Store = require('electron-store')

const store = new Store()
let mainWindow = null

const ThumbarButtonsPause = [
  {
    tooltip: 'Previous',
    icon: join(__dirname, '../img/previous.png'),
    click () { mainWindow.webContents.send('previous') }
  },
  {
    tooltip: 'Pause',
    icon: join(__dirname, '../img/pause.png'),
    click () { mainWindow.webContents.send('pause') }
  },
  {
    tooltip: 'Next',
    icon: join(__dirname, '../img/next.png'),
    click () { mainWindow.webContents.send('next') }
  }
]

const ThumbarButtons = [
  {
    tooltip: 'Previous',
    icon: join(__dirname, '../img/previous.png'),
    click () { mainWindow.webContents.send('previous') }
  },
  {
    tooltip: 'Play',
    icon: join(__dirname, '../img/play.png'),
    click () { mainWindow.webContents.send('play') }
  },
  {
    tooltip: 'Next',
    icon: join(__dirname, '../img/next.png'),
    click () { mainWindow.webContents.send('next') }
  }
]

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    }
  })

  // Menu.setApplicationMenu(null)
  mainWindow.webContents.openDevTools({ mode: 'right' });

  mainWindow.loadFile(join(__dirname, '../index.html'))

  mainWindow.setThumbarButtons(ThumbarButtons)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('fs-read', async (_, file) => {
  return await promises.readFile(file, 'utf8')
})

ipcMain.handle('fs-write', async (_, ...args) => {
  return await promises.writeFile(...args)
})

ipcMain.handle('fs-access', async (_, file) => {
  return await promises.access(file, constants.F_OK)
})

ipcMain.handle('store-get', async (_, value) => {
  return await store.get(value)
})

ipcMain.on('store-set', (_, ...args) => {
  store.set(...args)
})

ipcMain.on('fetch-playlists', (event) => {
  event.reply('fetch-playlists')
})

ipcMain.on('is-playing', (_, isPlaying) => {
  if (isPlaying) {
    mainWindow.setThumbarButtons(ThumbarButtonsPause)
  } else {
    mainWindow.setThumbarButtons(ThumbarButtons)
  }
})
