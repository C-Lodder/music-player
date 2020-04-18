const { join } = require('path')
const Store = require('electron-store')
const empty = require('./utils/empty.js')
const icons = require('./utils/icons.js')
const error = require('./utils/error.js')
const search = require('./utils/search.js')
const row = require('./utils/row.js')
const button = require('./utils/button.js')
const ItunesLibrary = require('./itunes.js')
const Settings = require('./settings.js')
const library = new ItunesLibrary

// Elements
const list = document.getElementById('list')
const playlists = document.getElementById('playlists')

let tracks

const excludes = ['movies', 'books', 'audiobooks', 'tv_shows']

// Asynchronously get all playlists from the library
async function fetchPlaylists() {
  const store = new Store()
  if (store.get('library') === undefined) {
    empty(playlists)
    error.show('You must select an iTunes library. This can be done in the application settings.')
    return
  }

  library.open(store.get('library'))
    .then(() => {
      return library.getPlaylists()
    })
    .then((obj) => {
      empty(playlists)
      Object.entries(obj).forEach(([key, value]) => {
        const shouldExclude = excludes.some(item => value[item]);
        if (!shouldExclude) {
          const playlist = document.createElement('a')
          const span = document.createElement('span')
          playlist.setAttribute('href', '#')
          playlist.classList.add('playlist-item')
          playlist.innerHTML = `${icons.playlist}`
          span.innerText = `${value.name}`
          playlist.append(span)

          playlist.addEventListener('click', ({ currentTarget }) => {
            // Remove current 'active' class
            const active = document.querySelector('.active')
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
        }
      })
    })
    .then(() => {
      return library.getTracks()
    })
    .then((response) => {
      tracks = response
    })
    .catch((err) => {
      empty(playlists)
      error.show('There was an error parsing the iTunes library')
    })
}

window.addEventListener('DOMContentLoaded', () => {
  fetchPlaylists()

  document.getElementById('player-actions').append(button.repeat())

  document.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = icons[element.getAttribute('data-icon')]
  })

  // Play next song
  document.getElementById('audio').addEventListener('ended', () => {
    const state = button.getRepeatState()
    const isPlaying = document.querySelector('.is-playing')

    if (isPlaying !== null) {
      if (state === 'all') {
        if (isPlaying.nextElementSibling !== null) {
          // Play the next song if one exists
          isPlaying.nextElementSibling.querySelector('.play-button').click()
        } else {
          // Else start from the beginning of the playlist
          document.querySelector('.play-button').click()
        }
      } else if (state === 'shuffle') {
        // Pick a random song to play
        const items = document.querySelectorAll('.play-button')
        const random = items[Math.floor(Math.random() * items.length)];
        random.click()
      }
    }
  })

  document.getElementById('settings-trigger').addEventListener('click', () => {
    document.getElementById('settings-modal').visible = true
  })

  document.getElementById('search-input').addEventListener('input', ({ target }) => {
    search.init(target, tracks)
  })
})
