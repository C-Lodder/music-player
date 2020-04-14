// Build row for each playlist item
const button = require('./button.js')
const convertTime = require('./convert-time.js')

const row = {
  build: (track) => {
    const id = document.createElement('td')
    id.append(button.render(track))

    const name = document.createElement('td')
    name.innerText = track.name

    const time = document.createElement('td')
    time.innerText = track.total_time !== undefined ? convertTime(track.total_time) : ''

    const tr = document.createElement('tr')
    tr.append(id, name, time)
    tr.setAttribute('data-id', track.track_id)

    return tr
  },
}

module.exports = row
