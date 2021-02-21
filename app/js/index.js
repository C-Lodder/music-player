import empty from './utils/empty.js'
import icons from './utils/icons.js'
import error from './utils/error.js'
import search from './utils/search.js'
import table from './utils/table.js'
import button from './utils/button.js'
import iTunes from './lib/iTunes.js'
import Settings from './settings.js'

const library = new iTunes
const excludes = ['movies', 'books', 'audiobooks', 'tv_shows']
let tracks

// Elements
const list = document.getElementById('list')
const playlistsElement = document.getElementById('playlists')

// Asynchronously get all playlists from the library
async function fetchPlaylists() {
  const libPath = await window.api.store.get('library')
  if (libPath === undefined) {
    empty(playlistsElement)
    error.show('You must select an iTunes library. This can be done in the application settings.')
    return
  }

  try {
    await library.open(libPath)
  } catch(err) {
    error.show('Failed to open iTunes library')
  }

  try {
    const playlists = await library.getPlaylists()
    await empty(playlistsElement)

    Object.entries(playlists).forEach(([key, value]) => {
      const shouldExclude = excludes.some(item => value[item])
      const excludeDownloaded = value.name === 'Downloaded' && value.distinguished_kind !== 65
      if (!shouldExclude && !excludeDownloaded) {
        const playlist = document.createElement('a')
        const span = document.createElement('span')
        playlist.setAttribute('href', '#')
        playlist.setAttribute('data-playlist-id', value.playlist_id)
        playlist.classList.add('playlist-item')
        playlist.innerHTML = `${icons.playlist}`
        span.innerText = `${value.name}`
        playlist.append(span)

        playlist.addEventListener('click', async({ currentTarget }) => {
          window.api.store.set('last-playlist', currentTarget.getAttribute('data-playlist-id'))

          // Remove current 'active' class
          const active = document.querySelector('.active')
          if (active !== null) {
            active.classList.remove('active')
          }

          // Add 'active' class to clicked item
          currentTarget.classList.add('active')

          // Empty current playlist tracks
          await empty(list)

          // Get the playlist tracks
          const playlistItems = await library.getPlaylistItems(value)

          // Append each playlist track to the table
          Object.entries(playlistItems).forEach(async([key, value]) => {
            const track = await library.getTrackById(value.track_id)
            await list.append(table.buildRow(track))

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

        playlistsElement.append(playlist)
      }
    })

    // Get a list of all tracks for the search
    tracks = await library.getTracks()

    // Click on the last playlist that was viewed
    const lastPlaylist = window.api.store.get('last-playlist')
    if (lastPlaylist !== undefined) {
      document.querySelector(`[data-playlist-id="${lastPlaylist}"]`).click()
    }

    table.sort()
  } catch(err) {
    empty(playlistsElement)
    error.show('There was an error parsing the iTunes library')
  }
}


fetchPlaylists()

// Initialise the 'repeat' button
button.repeat()

// Initialise the 'queue' button
// button.queue()

// Render SVGs
document.querySelectorAll('[data-icon]').forEach((element) => {
  element.innerHTML = icons[element.getAttribute('data-icon')]
})

// Determine which song to play next
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
      const random = items[Math.floor(Math.random() * items.length)]
      random.click()
    }
  }
})

// Open settings modal
document.getElementById('settings-trigger').addEventListener('click', () => {
  document.getElementById('settings-modal').visible = true
})

// Search
document.getElementById('search-input').addEventListener('input', ({ target }) => {
  search.init(target, tracks)
})


window.api.receive('fetch-playlists', () => {
  fetchPlaylists()
})

window.api.receive('previous', () => {
  const isPlaying = document.querySelector('.is-playing')
  let playing = false
  if (isPlaying !== null && isPlaying.previousElementSibling !== null) {
    // Play the next song if one exists
    isPlaying.previousElementSibling.querySelector('.play-button').click()
    playing = true
  }

  const isPaused = document.querySelector('.is-paused')
  if (isPaused !== null && isPaused.previousElementSibling !== null) {
    // Play the next song if one exists
    isPaused.previousElementSibling.querySelector('.play-button').click()
    playing = true
  }

  window.api.send('is-playing', playing)
})

window.api.receive('play', () => {
  const isPaused = document.querySelector('.is-paused')
  let playing = false
  if (isPaused !== null) {
    // If a song has been paused, continue playing it
    isPaused.querySelector('.play-button').click()
    playing = true
  } else {
    // Else play the first song in the list
    document.querySelector('.play-button').click()
    playing = true
  }

  window.api.send('is-playing', playing)
})

window.api.receive('pause', () => {
  const isPlaying = document.querySelector('.is-playing')
  if (isPlaying !== null) {
    isPlaying.querySelector('.play-button').click()
    window.api.send('is-playing', false)
  }
})

window.api.receive('next', () => {
  const isPlaying = document.querySelector('.is-playing')
  let playing = false
  if (isPlaying !== null && isPlaying.nextElementSibling !== null) {
    // Play the next song if one exists
    isPlaying.nextElementSibling.querySelector('.play-button').click()
    playing = true
  }

  const isPaused = document.querySelector('.is-paused')
  if (isPaused !== null && isPaused.nextElementSibling !== null) {
    // Play the next song if one exists
    isPaused.nextElementSibling.querySelector('.play-button').click()
    playing = true
  }

  window.api.send('is-playing', playing)
})
