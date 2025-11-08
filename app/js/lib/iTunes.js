// iTunes library

class iTunes {
  constructor() {
    this.data = null
  }

  // Opens an itunes library xml file and reads and reformats the data
  async open(filename) {
    let contents

    try {
      await window.api.invoke('fs-access', filename)
    } catch(error) {
      throw 'Invalid file path!'
    }

    try {
      contents = await window.api.invoke('fs-read', filename)
      this.data = JSON.parse(contents)
    } catch(error) {
      throw err
    }
  }

  getRawData() {
    return this.data
  }

  getTrack(trackData) {
    // List of all the properties that an iTunes library track will have
    const track = {}
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
        track[value] = trackData[value]
      })
    }

    return track
  }

  async getTracks() {
    const output = []
    const tracks = await this.data.tracks

    try {
      Object.keys(tracks).forEach((key) => {
        this.getTrackById(key).then(track => output.push(track))
      })
    } catch (error) {
      throw new Error(error)
    }

    return output
  }

  async getTrackById(id) {
    if (id !== null) {
      if (this.data.tracks[id]) {
        const tdata = await this.data.tracks[id]
        return this.getTrack(tdata)
      } else {
        throw new Error('No track found for the specified id!')
      }
    } else {
      throw new Error('Track ID is null!')
    }
  }

  async getPlaylistItems(playlist, full = false) {
    const output = []

    if (null == playlist.playlist_items) {
      return []
    }

    try {
      Object.values(playlist.playlist_items).forEach((value) => {
        if (full) {
          output.push(this.getTrackById(value.track_id))
        } else {
          output.push(value)
        }
      })
    } catch (error) {
      throw new Error(error)
    }

    return output
  }

  async getPlaylists() {
    const output = []
    const playlists = await this.data.playlists

    try {
      Object.values(playlists).forEach((value) => {
        this.getPlaylistById(value.playlist_id)
          .then((playlist) => {
            output.push(playlist)
          })
      })
    } catch (error) {
      throw new Error(error)
    }

    return output
  }

  async getPlaylistById(id) {
    if (id !== null && id !== undefined) {
      const playlists = await this.data.playlists
      try {
		    return playlists.find(key => key.playlist_id == id)
      } catch(error) {
        throw new Error('No playlist found for the specified id!')
      }
    } else {
      throw new Error('Playlist ID is null!')
    }
  }
}

export default iTunes
