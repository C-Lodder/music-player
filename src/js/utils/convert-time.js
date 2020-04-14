// Convert a time from seconds

module.exports = (secs) => {
  const pad = (num, size) => (`000${num}`).slice(size * -1)
  const time = parseFloat(secs / 1000).toFixed(3)
  let hours = pad(Math.floor(time / 60 / 60), 1)
  let minutes = Math.floor(time / 60) % 60
  const seconds = Math.floor(time - minutes * 60)
  hours = parseInt(hours, 10) > 0 ? `${hours}:` : ''
  minutes = parseInt(hours, 10) > 0 ? pad(minutes, 2) : pad(minutes, 1)
  return `${hours}${minutes}:${pad(seconds, 2)}`
}
