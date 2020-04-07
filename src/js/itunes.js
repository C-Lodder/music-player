const fs = require('fs')
const plist = require('plist')

module.exports = function ItunesLibrary() {
  let data
  let ready = false
  const instance = this

  // Opens an itunes library xml file and reads and reformats the data
  this.open = function open(filename) {
    if (!validateFilename(filename)) {
      throw 'Invalid file path!'
    }
    return new Promise((fulfill, reject) => {
      fs.readFile(filename, (err, dat) => {
        if (err) {
          // If there's an error reading the file, reject the promise
          reject(err)
        } else {
          try {
            let xmlData = dat.toString()
            xmlData = xmlData.replace(/[\n\t\r]/g, '')
            data = plist.parse(xmlData)
            reformat_keys(data)
            ready = true
            fulfill()
          } catch (err) {
            // If any errors thrown, reject the promise
            reject(err)
          }
        }
      })
    })
  }

  this.getRawData = function getRawData() {
    return data
  }

  module.exports.Track = function Track(trackData) {
    // List of all the properties that an iTunes library track will have
    const properties = [
      'track_id',
      'size',
      'total_time',
      'date_modified',
      'date_added',
      'bit_rate',
      'sample_rate',
      'persistent_id',
      'track_type',
      'file_folder_count',
      'library_folder_count',
      'name',
      'artist',
      'album',
      'genre',
      'kind',
      'location',
    ]
    if (trackData != null && typeof trackData === 'object') {
      // Go through all the valid properties and assign them to our new Track object
      // This makes sure that a returned Track object always has the same properties and doesn't have any extras
      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          const prop = properties[key]
          // Set the current property's value to the new Trap object
          this[prop] = trackData[prop]
        }
      }
    }
  }

  this.getTracks = function getTracks() {
    const getTrackByIDSync = this.getTrackByIDSync
    return new Promise((fulfill, reject) => {
      if (ready) {
        try {
          const output = []
          const keys = Object.keys(data.tracks)
          for (const key in keys) {
            if (keys.hasOwnProperty(key)) {
              const currentKey = keys[key]
              output.push(getTrackByIDSync(currentKey))
            }
          }
          fulfill(output)
        } catch (e) {
          reject(e)
        }
      } else {
        reject(new Error('No data ready (call open() first)!'))
      }
    })
  }

  this.getTrackByIDSync = function getTrackByIDSync(id) {
    const Track = module.exports.Track
    if (ready) {
      if (id !== null) {
        if (data.tracks[id]) {
          const tdata = data.tracks[id]
          return new Track(tdata)
        } else {
          throw new Error('No track found for the specified id!')
        }
      } else {
        throw new Error('Track ID is null!')
      }
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getTrackByID = function getTrackByID(id) {
    const Track = module.exports.Track
    return new Promise((fulfill, reject) => {
      if (ready) {
        if (id !== null && id !== undefined) {
          if (data.tracks[id]) {
            try {
              const tdata = data.tracks[id]
              const t = new Track(tdata)
              fulfill(t)
            } catch (e) {
              reject(e)
            }
          } else {
            reject(new Error('No track found for the specified id!'))
          }
        } else {
          reject(new Error('Track ID is null!'))
        }
      } else {
        reject(new Error('No data ready (call open() first)!'))
      }
    })
  }

  module.exports.Playlist = function Playlist(playlistData) {
    const getTrackByIDSync = instance.getTrackByIDSync
    const thisPlaylist = this
    const properties = [
      'master',
      'playlist_id',
      'playlist_persistent_id',
      'all_items',
      'visible',
      'name',
      'playlist_items',
      'distinguished_kind',
      'music',
      'smart_info',
      'smart_criteria',
      'movies',
      'tv_shows',
      'podcasts',
      'itunesu',
      'audiobooks',
      'books'
    ]
    if (playlistData != null && typeof playlistData === 'object') {
      // Go through all the valid properties and assign them to our new Track object
      // This makes sure that a returned Track object always has the same properties and doesn't have any extras
      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          const prop = properties[key]
          // Set the current property's value to the new Trap object
          this[prop] = playlistData[prop]

        }
      }
    }

    this.getPlaylistItems = function getPlaylistItems(full_data) {
      return new Promise((fulfill, reject) => {
        try {
          const output = []
          if (full_data === undefined) {
            full_data = true
          }
          if (thisPlaylist.playlist_items === null || thisPlaylist.playlist_items === undefined) {
            fulfill([])
          }

          const playlistItems = thisPlaylist.playlist_items
          for (const key in playlistItems) {
            if (playlistItems.hasOwnProperty(key)) {
              if (full_data) {
                output.push(getTrackByIDSync(playlistItems[key].track_id))
              } else {
                output.push(playlistItems[key])
              }
            }
          }
          fulfill(output)
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  this.getPlaylists = function getPlaylists() {
    const getPlaylistByIDSync = instance.getPlaylistByIDSync
    return new Promise((fulfill, reject) => {
      if (ready) {
        try {
          const playlists = data.playlists
          const output = []
          for (const key in playlists) {
            if (playlists.hasOwnProperty(key)) {
              const current_id = playlists[key].playlist_id
              output.push(getPlaylistByIDSync(current_id))
            }
          }
          fulfill(output)
        } catch (e) {
          reject(e)
        }
      } else {
        reject(new Error('No data ready (call open() first)!'))
      }
    })
  }

  this.getPlaylistByID = function getPlaylistByID(id) {
    const Playlist = module.exports.Playlist
    return new Promise((fulfill, reject) => {
      if (ready) {
        if (id !== null && id !== undefined) {
          try {
            const playlists = data.playlists
            for (const key in playlists) {
              if (playlists.hasOwnProperty(key)) {
                const playlist = playlists[key]
                if (playlist.playlist_id && playlist.playlist_id === id) {
                  fulfill(new Playlist(playlist))
                }
              }
            }
          } catch (e) {
            reject(e)
          }
          reject(new Error('No playlist found for the specified id!'))
        } else {
          reject(new Error('Playlist ID is null!'))
        }
      } else {
        reject(new Error('No data ready (call open() first)!'))
      }
    })
  }

  this.getPlaylistByIDSync = function getPlaylistByIDSync(id) {
    const Playlist = module.exports.Playlist
    if (ready) {
      if (id !== null && id !== undefined) {
        const playlists = data.playlists
        for (const key in playlists) {
          if (playlists.hasOwnProperty(key)) {
            const playlist = playlists[key]
            if (playlist.playlist_id && playlist.playlist_id === id) {
              return new Playlist(playlist)
            }
          }
        }
        throw new Error('No playlist found for the specified id!')
      } else {
        throw new Error('Playlist ID is null!')
      }
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getMajorVersion = function getMajorVersion() {
    if (ready) {
      return data.major_version
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getMinorVersion = function getMinorVersion() {
    if (ready) {
      return data.minor_version
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getApplicationVersion = function getApplicationVersion() {
    if (ready) {
      return data.application_version
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getDate = function getDate() {
    if (ready) {
      return data.date
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getFeatures = function getFeatures() {
    if (ready) {
      return data.features
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getShowContentRatings = function getShowContentRatings() {
    if (ready) {
      return data.show_content_ratings
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getLibraryPersistentID = function getLibraryPersistentID() {
    if (ready) {
      return data.library_persistent_id
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  this.getMusicFolder = function getMusicFolder() {
    if (ready) {
      return data.music_folder
    } else {
      throw new Error('No data ready (call open() first)!')
    }
  }

  // Function to make sure we're given a valid file
  function validateFilename(fname) {
    // Will fail if filename is null or not a string, file doesn't exist, or file is a directory
    return (fname !== null && typeof fname === 'string' && fs.existsSync(fname) && !fs.lstatSync(fname).isDirectory())
  }

  // Function to reformat all the keys from the plist file to not be strings with spaces and stuff in them
  function reformat_keys(data) {
    Object.keys(data).forEach(key => {
      const value = data[key]
      if (typeof value === 'object') {
        reformat_keys(value)
      }
      delete data[key]
      const newkey = key.toLowerCase().replace(/\s/g, '_')
      data[newkey] = value
    })
  }
}