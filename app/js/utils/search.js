// Search
import empty from './empty.js'
import button from './button.js'
import icons from './icons.js'

const dropdown = document.getElementById('track-dropdown')
let input
let icon

const emptySearch = () => {
  input.value = ''
  icon.innerHTML = icons.search
  dropdown.classList.remove('show')
}

const search = {
  init: (target, tracks) => {
    input = target
    icon = input.nextElementSibling
    empty(dropdown)
    if (input.value.length) {
      search.enableEmpty()
      dropdown.classList.add('show')
      Object.entries(tracks).forEach(([key, value]) => {
        if (value.name.toLowerCase().includes(input.value.toLowerCase())) {
          dropdown.append(search.createItem(value))
        }
      })

      if (!dropdown.firstChild) {
        dropdown.classList.remove('show')
      }
    } else {
      dropdown.classList.remove('show')
      icon.innerHTML = icons.cross
      empty(dropdown)
    }
  },
  enableEmpty: () => {
    icon.innerHTML = icons.cross
    icon.addEventListener('click', emptySearch, { once: true })
  },
  createItem: (value) => {
    const text = document.createElement('span')
    text.innerText = value.name

    const item = document.createElement('div')
    item.href = '#'
    item.classList.add('dropdown-item', 'row')
    item.append(button.play(value))
    item.append(text)

    return item
  },
}

export default search
