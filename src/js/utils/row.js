// Build row for each playlist item
const button = require('./button.js')
const convertTime = require('./convert-time.js')

const row = {
  build: (track) => {
    const id = document.createElement('td')
    id.append(button.play(track))

    const name = document.createElement('td')
    name.innerText = track.name

    const time = document.createElement('td')
    time.innerText = convertTime(track.total_time)

    const tr = document.createElement('tr')
    tr.append(id, name, time)
    tr.setAttribute('data-id', track.track_id)

    return tr
  },
}

module.exports = row
