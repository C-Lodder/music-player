module.exports = {
  plugins: [
    require('postcss-easy-import'),
    require('postcss-nested'),
    require('autoprefixer'),
    require('postcss-discard-comments'),
    require('cssnano')({
      preset: 'default',
    })
  ]
}
