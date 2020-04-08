// Error message container

const error = {
  show: (msg) => {
    const errorContainer = document.getElementById('error')
    errorContainer.innerText = msg
    errorContainer.classList.add('show')
  },
  hide: () => {
    const errorContainer = document.getElementById('error')
    errorContainer.classList.remove('show')
  }
}

module.exports = error
