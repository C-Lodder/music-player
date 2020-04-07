const { join } = require('path')
const convertTime = require('./utils/convert-time.js')
const empty = require('./utils/empty.js')
const icons = require('./utils/icons.js')
const ItunesLibrary = require(`${__dirname}/itunes.js`)
const library = new ItunesLibrary

// Elements
const list = document.getElementById('list')
const audio = document.getElementById('audio')
const trackName = document.getElementById('track-name')
const playlists = document.getElementById('playlists')

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
  library.open(join(__dirname, '../../library.xml'))
    .then(() => {
      library.getPlaylists()
        .then((obj) => {
          empty(playlists)
          Object.entries(obj).forEach(([key, value]) => {
            const playlist = document.createElement('a')
            playlist.setAttribute('href', '#')
		    playlist.innerHTML = `${icons.playlist} ${value.name}`

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
      console.error('There was an error fetching the iTunes library')
      console.error(err)
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
})
