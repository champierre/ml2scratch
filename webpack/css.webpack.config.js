const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

let app = './app';
let dist = '../dist';

module.exports = {
  entry: {
    styles: app+'/stylesheets/styles.scss'
  },
  output: {
    filename: 'stylesheets/[name].css',
    path: __dirname + '/' + dist
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?minimize', 'sass-loader']
        })
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    require('autoprefixer'),
    new ExtractTextPlugin('stylesheets/[name].css')
  ]
}
