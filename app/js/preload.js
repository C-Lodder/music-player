// Preload for main window
const { contextBridge, ipcRenderer } = require('electron')
const { promises, constants } = require('fs')
const Store = require('electron-store')

const store = new Store()

contextBridge.exposeInMainWorld(
  'api',
  {
    send: (channel, data) => {
      // Whitelist channels
      const validSendChannels = ['is-playing', 'fetch-playlists']
      if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive: (channel, func) => {
      let validReceiveChannels = ['play', 'pause', 'previous', 'next']
      if (validReceiveChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    store: {
      set: (property, value) => store.set(property, value),
      get: (value) => store.get(value),
    },
    fs: {
      readFile: async (file) => await promises.readFile(file, 'utf8'),
      writeFile: async (file, data) => await promises.writeFile(file, data),
      access: async (file) => await promises.access(file, constants.F_OK),
    }
  }
)
