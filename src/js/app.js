const { join } = require('path')
const Store = require('electron-store')
const convertTime = require('./utils/convert-time.js')
const empty = require('./utils/empty.js')
const icons = require('./utils/icons.js')
const ItunesLibrary = require(`${__dirname}/itunes.js`)
const library = new ItunesLibrary
const Settings = require('./settings.js')

// Elements
const list = document.getElementById('list')
const audio = document.getElementById('audio')
const trackName = document.getElementById('track-name')
const playlists = document.getElementById('playlists')
const settingsTrigger = document.getElementById('settings-trigger')
const settingsModal = document.getElementById('settings-modal')

const error = {
  show: (msg) => {
    const errorContainer = document.getElementById('error')
    errorContainer.innerText = msg
    errorContainer.classList.add('show')
  },
  hide: () => {
    const errorContainer = document.getElementById('error')
    errorContainer.classList.remove('show')
  }
}

const initPlay = (track, target) => {
  const isPlaying = document.querySelector('.is-playing')
  if (isPlaying !== null) {
    isPlaying.classList.remove('is-playing')
  }

  target.closest('tr').classList.add('is-playing')
  audio.setAttribute('src', track.location)
  trackName.innerText = track.name
  audio.play()
}

// Build row for each playlist item
const buildRow = (track) => {
  const row = document.createElement('tr')
  const id = document.createElement('td')
  const name = document.createElement('td')
  const time = document.createElement('td')
  const play = document.createElement('a')
  play.setAttribute('href', '#')
  play.setAttribute('data-location', track.location)
  play.classList.add('play-button')
  play.innerHTML = icons.play
  play.addEventListener('click', ({ currentTarget }) => {
    initPlay(track, currentTarget)
  })
  id.append(play)

  name.innerText = track.name

  time.innerText = convertTime(track.total_time)

  row.append(id, name, time)

  return row
}

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

            playlist.addEventListener('click', () => {
              empty(list)
              value.getPlaylistItems(false)
                .then((tracks) => {
                  Object.entries(tracks).forEach(([key, value]) => {
                    library.getTrackByID(value.track_id)
                      .then((track) => {
                        list.append(buildRow(track))
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
  audio.addEventListener('ended', (event) => {
    const isPlaying = document.querySelector('.is-playing')
    if (isPlaying !== null && isPlaying.nextElementSibling !== null) {
	  isPlaying.nextElementSibling.querySelector('.play-button').click()
	}
  })

  settingsTrigger.addEventListener('click', () => {
    settingsModal.visible = true
  })
})
