// Convert a time

module.exports = (secs) => {
  const pad = (num, size) => (`000${num}`).slice(size * -1)
  const time = parseFloat(secs / 1000).toFixed(3)
  let hours = pad(Math.floor(time / 60 / 60), 2)
  const minutes = Math.floor(time / 60) % 60
  const seconds = Math.floor(time - minutes * 60)
  hours = hours > 0 ? `${hours}:` : ''
  return `${hours}${pad(minutes, 1)}:${pad(seconds, 2)}`
}
