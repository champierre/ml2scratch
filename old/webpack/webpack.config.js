const path = require('path')
const webpack = require('webpack')

let js = require('./js.webpack.config')
let css = require('./css.webpack.config')

module.exports = [
  js,
  css
]
