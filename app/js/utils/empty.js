// Remove element child nodes

const empty = (list) => {
  while (list.firstChild) {
    list.removeChild(list.lastChild)
  }
}

export default empty
