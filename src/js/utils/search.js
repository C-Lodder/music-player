// Search
const empty = require('./empty.js')
const button = require('./button.js')

const search = {
  init: (target, tracks) => {
    const dropdown = document.getElementById('track-dropdown')
    empty(dropdown)
    if (target.value.length) {
      dropdown.classList.add('show')
      Object.entries(tracks).forEach(([key, value]) => {
        if (value.name.toLowerCase().includes(target.value.toLowerCase())) {
          dropdown.append(search.createItem(value))
        }
      })

      if (!dropdown.firstChild) {
        dropdown.classList.remove('show')
      }
    } else {
      dropdown.classList.remove('show')
      empty(dropdown)
    }
  },
  createItem: (value) => {
    const text = document.createElement('span')
    text.innerText = value.name

    const item = document.createElement('div')
    item.href = '#'
    item.classList.add('dropdown-item')
    item.append(button.play(value))
    item.append(text)

    return item
  },
}

module.exports = search
