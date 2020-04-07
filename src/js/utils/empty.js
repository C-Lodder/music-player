// Remove element child nodes

module.exports = (list) => {
  while (list.firstChild) {
    list.removeChild(list.lastChild)
  }
}
