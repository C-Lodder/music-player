const { readFile, constants, access } = require('fs')

module.exports = function ItunesLibrary() {
  let data
  let ready = false
  const instance = this

  // Opens an itunes library xml file and reads and reformats the data
  this.open = function open(filename) {
    access(filename, constants.F_OK | constants.R_OK, (err) => {
      if (err) {
        throw 'Invalid file path!'
      }
    })

    return new Promise((resolve, reject) => {
      readFile(filename, 'utf8', (err, contents) => {
        if (err) {
          // If there's an error reading the file, reject the promise
          reject(err)
        } else {
          try {
            data = JSON.parse(contents)
            ready = true
            resolve()
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
      Object.values(properties).forEach((value) => {
        this[value] = trackData[value]
      })
    }
  }

  this.getTracks = function getTracks() {
    const getTrackByIDSync = this.getTrackByIDSync
    return new Promise((resolve, reject) => {
      if (ready) {
        try {
          const output = []
          Object.keys(data.tracks).forEach((key) => {
            output.push(getTrackByIDSync(key))
          })
          resolve(output)
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
    return new Promise((resolve, reject) => {
      if (ready) {
        if (id !== null && id !== undefined) {
          if (data.tracks[id]) {
            try {
              const tdata = data.tracks[id]
              const t = new Track(tdata)
              resolve(t)
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
      Object.values(properties).forEach((value) => {
        this[value] = playlistData[value]
      })
    }

    this.getPlaylistItems = function getPlaylistItems(full_data) {
      return new Promise((resolve, reject) => {
        try {
          const output = []
          if (full_data === undefined) {
            full_data = true
          }
          if (thisPlaylist.playlist_items === null || thisPlaylist.playlist_items === undefined) {
            resolve([])
          }

          const playlistItems = thisPlaylist.playlist_items
          Object.values(playlistItems).forEach((value) => {
            if (full_data) {
              output.push(getTrackByIDSync(value.track_id))
            } else {
              output.push(value)
            }
          })

          resolve(output)
        } catch (e) {
          reject(e)
        }
      })
    }
  }

  this.getPlaylists = function getPlaylists() {
    const getPlaylistByIDSync = instance.getPlaylistByIDSync
    return new Promise((resolve, reject) => {
      if (ready) {
        try {
          const playlists = data.playlists
          const output = []
          Object.values(playlists).forEach((value) => {
            output.push(getPlaylistByIDSync(value.playlist_id))
          })
          resolve(output)
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
    return new Promise((resolve, reject) => {
      if (ready) {
        if (id !== null && id !== undefined) {
          try {
            Object.values(data.playlists).forEach((value) => {
              if (value.playlist_id && value.playlist_id === id) {
                resolve(new Playlist(value))
              }
            })
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
}