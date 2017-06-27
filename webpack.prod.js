const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'background': './src/background.ls'
  , 'options': './src/options.ls'
  }
, output: {
    path: path.join(__dirname, 'build')
  , filename: '[name].js'
  }
, devtool: 'source-map'
, target: 'web'
, node: {
    fs: 'empty'
  , net: 'empty'
  }
, plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  , new CopyWebpackPlugin(
      [
        { from: './src' }
      , { from: './node_modules/keen-ui/dist/keen-ui.css' }
      , { from: './node_modules/flexboxgrid/dist/flexboxgrid.css' }
      , { from: './node_modules/normalize.css/normalize.css' }
      , { from: './node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2' }
      ]
    , { ignore: ['*.ls', '*.vue'] })
  ]
, module: {
    loaders: [
      { test: /\.ls$/, loader: 'livescript' }
    , { test: /\.vue$/, loader: 'vue' }
    , { test: /\.json$/, loader: 'json' }
    ]
  }
, vue: {
    loaders: {
      livescript: 'livescript'
    , stylus: 'style!css!stylus'
    }
  }
}
