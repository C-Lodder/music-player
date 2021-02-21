// Buttons
import icons from './icons.js'
import error from './error.js'

const tryPlay = (audio, name) => {
  const play = audio.play()
  play
    .then(() => {
      error.hide()
    })
    .catch((err) => {
      error.show(`Track song "${name}" could not be used because the original file cound not be found`)
    })
}

const repeatState = {
  all: true,
  single: false,
  shuffle: false,
}

const button = {
  play: (track) => {
    const audio = document.getElementById('audio')
    const button = document.createElement('a')
    button.setAttribute('href', '#')
    button.setAttribute('data-location', track.location)
    button.classList.add('play-button')
    button.innerHTML = icons.play
    button.addEventListener('click', ({ currentTarget }) => {
      const row = currentTarget.closest('.row')

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
        tryPlay(audio, track.name)
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
        tryPlay(audio, track.name)
      }
    })

    return button
  },
  repeat: () => {
    const button = document.getElementById('repeat')
    const audio = document.getElementById('audio')
    button.addEventListener('click', ({ currentTarget }) => {
      // Alternate between the button action
      if (repeatState.all) {
        repeatState.all = false
        repeatState.single = true
        currentTarget.innerHTML = icons.repeatSingle
        audio.setAttribute('loop', true)
      } else if (repeatState.single) { 
        repeatState.single = false
        repeatState.shuffle = true
        currentTarget.innerHTML = icons.shuffle
        audio.removeAttribute('loop')
      } else { 
        repeatState.shuffle = false
        repeatState.all = true
        currentTarget.innerHTML = icons.repeat
        audio.removeAttribute('loop')
      }
    })

    return button
  },
  queue: () => {
    const button = document.getElementById('queue')
    button.setAttribute('type', 'button')
    button.innerHTML = icons.repeat
    button.addEventListener('click', ({ currentTarget }) => {
      //currentTarget.nextElementSibling.classList.toggle('show')
    })

    return button
  },
  getRepeatState: () => {
    // Return the object key that's "true"
    return Object.keys(repeatState).filter(key => repeatState[key])[0]
  },
}

export default button
