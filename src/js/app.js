const { join } = require('path')
const Store = require('electron-store')
const empty = require('./utils/empty.js')
const icons = require('./utils/icons.js')
const error = require('./utils/error.js')
const row = require('./utils/row.js')
const ItunesLibrary = require('./itunes.js')
const Settings = require('./settings.js')

// Elements
const list = document.getElementById('list')
const playlists = document.getElementById('playlists')


// Asynchronously get all playlists from the library
async function fetchPlaylists() {
  const store = new Store()
  if (store.get('library') === undefined) {
    empty(playlists)
    error.show('You must select an iTunes library. This can be done in the application settings.')
    return
  }

  const library = new ItunesLibrary
  library.open(store.get('library'))
    .then(() => {
      library.getPlaylists()
        .then((obj) => {
          empty(playlists)
          Object.entries(obj).forEach(([key, value]) => {
            const playlist = document.createElement('a')
            const span = document.createElement('span')
            playlist.setAttribute('href', '#')
            playlist.classList.add('playlist-item')
            playlist.innerHTML = `${icons.playlist}`
            span.innerText = `${value.name}`
            playlist.append(span)

            playlist.addEventListener('click', ({ currentTarget }) => {
              // Remove current 'active' class
              const active = document.querySelector('active')
              if (active !== null) {
                active.classList.remove('active')
              }

              // Add 'active' class to clicked item
              currentTarget.classList.add('active')

              // Empty current playlist tracks
              empty(list)

              value.getPlaylistItems(false)
                .then((tracks) => {
                  Object.entries(tracks).forEach(([key, value]) => {
                    library.getTrackByID(value.track_id)
                      .then((track) => {
                        list.append(row.build(track))
                      })
                      .then(() => {
                        const trackName = document.getElementById('track-name')
                        if (trackName.getAttribute('data-track-id') !== undefined) {
                          const trackId = document.querySelector(`[data-id="${trackName.getAttribute('data-track-id')}"]`)
                          if (trackId) {
                            trackId.classList.add('is-playing')
                            trackId.querySelector('.play-button').innerHTML = icons.pause
                          }
                        }
                      })
                  })
                })
            })

            playlists.append(playlist)
        })
      })
    })
    .catch((err) => {
      empty(playlists)
      error.show('There was an error parsing the iTunes library')
    })
}

window.addEventListener('DOMContentLoaded', () => {
  fetchPlaylists()

  // Play next song
  document.getElementById('audio').addEventListener('ended', (event) => {
    const isPlaying = document.querySelector('.is-playing')
    if (isPlaying !== null && isPlaying.nextElementSibling !== null) {
      isPlaying.nextElementSibling.querySelector('.play-button').click()
    }
  })

  document.getElementById('settings-trigger').addEventListener('click', () => {
    document.getElementById('settings-modal').visible = true
  })
})
