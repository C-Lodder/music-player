// Play/pause button management
const icons = require('./icons.js')

const button = {
  play: (track) => {
    const audio = document.getElementById('audio')
    const play = document.createElement('a')
    play.setAttribute('href', '#')
    play.setAttribute('data-location', track.location)
    play.classList.add('play-button')
    play.innerHTML = icons.play
    play.addEventListener('click', ({ currentTarget }) => {
      const row = currentTarget.closest('tr')

      if (row !== null && row.classList.contains('is-playing')) {
        // If the row already contains the "is-playing" class, the user has paused the track
        row.classList.remove('is-playing')
        row.classList.add('is-paused')
        currentTarget.innerHTML = icons.play
        audio.pause()
      } else if (row !== null && row.classList.contains('is-paused')) {
        // If the row already contains the "is-paused" class, the user has presumed playing
        row.classList.remove('is-paused')
        row.classList.add('is-playing')
        currentTarget.innerHTML = icons.pause
        audio.play()
      } else {
        // The user has started playing the first or a different track
        const isPaused = document.querySelector('.is-paused')
        if (isPaused !== null) {
          isPaused.classList.remove('is-paused')
        }
        const isPlaying = document.querySelector('.is-playing')
        if (isPlaying !== null) {
          isPlaying.querySelector('.play-button').innerHTML = icons.play
          isPlaying.classList.remove('is-playing')
        }

        // Set the track name
        const trackName = document.getElementById('track-name')
        trackName.setAttribute('data-track-id', track.track_id)
        trackName.innerText = track.name

        if (row !== null) {
          row.classList.add('is-playing')
        }
        currentTarget.innerHTML = icons.pause

        // Set the audio source and play
        audio.setAttribute('src', track.location)
        audio.play()
      }
    })

    return play
  },
}

module.exports = button
