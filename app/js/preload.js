// Preload for main window
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => {
      const validSendChannels = ['is-playing', 'fetch-playlists', 'store-set']
      if (validSendChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    invoke: (channel, ...data) => {
      const validInvokeChannels = ['fs-read', 'fs-write', 'fs-access', 'store-get']
      if (validInvokeChannels.includes(channel)) {
        return ipcRenderer.invoke(channel, ...data)
      }
    },
    receive: (channel, func) => {
      const validReceiveChannels = ['play', 'pause', 'previous', 'next']
      if (validReceiveChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
  }
)
