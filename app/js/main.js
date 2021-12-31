// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, ipcMain, webContents } = require('electron')
const { join } = require('path')
const Store = require('electron-store')

Store.initRenderer()

let mainWindow

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
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    }
  })

  //Menu.setApplicationMenu(null)
  //mainWindow.webContents.openDevTools();

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

ipcMain.on('fetch-playlists', (event) => {
  event.reply('fetch-playlists')
})

ipcMain.on('is-playing', (event, isPlaying) => {
  if (isPlaying) {
    mainWindow.setThumbarButtons(ThumbarButtonsPause)
  } else {
    mainWindow.setThumbarButtons(ThumbarButtons)
  }
})
