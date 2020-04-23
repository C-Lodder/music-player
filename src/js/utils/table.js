// Table methods
const button = require('./button.js')
const convertTime = require('./convert-time.js')

const table = {
  buildRow: (track) => {
    const id = document.createElement('td')
    id.append(button.play(track))

    const name = document.createElement('td')
    name.innerText = track.name

    const time = document.createElement('td')
    time.innerText = track.total_time !== undefined ? convertTime(track.total_time) : ''

    const artist = document.createElement('td')
    artist.innerText = track.artist !== undefined ? track.artist : ''

    const tr = document.createElement('tr')
    tr.classList.add('row')
    tr.append(id, name, time, artist)
    tr.setAttribute('data-id', track.track_id)

    return tr
  },
  sort: () => {
    const tbody = document.getElementById('list')
    const table = tbody.parentNode

    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent
    const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
      v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
      )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx))

    // do the work...
    table.querySelectorAll('th').forEach((th) => {
      th.addEventListener('click', () => {
        Array.from(tbody.querySelectorAll('tr'))
          .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
          .forEach((tr) => tbody.appendChild(tr))
      }, false)
    })
  },
}

module.exports = table
