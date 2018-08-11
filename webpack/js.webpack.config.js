const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

let app = './app';
let dist = '../dist';

module.exports = {
  entry: {
    scripts: app+'/javascripts/scripts.js',
  },
  output: {
    filename: 'javascripts/[name].js',
    path: __dirname + '/' + dist
  },
  devServer: {
    contentBase: './dist',
    port: 8080
  },
  plugins: [
    new UglifyJsPlugin()
  ],
  cache: true
};
