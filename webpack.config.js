var path = require('path')
  , CopyWebpackPlugin = require('copy-webpack-plugin')

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
, plugins: [
    new CopyWebpackPlugin(
      [
        { from: './src' }
      , { from: './node_modules/keen-ui/dist/keen-ui.css' }
      , { from: './node_modules/flexboxgrid/dist/flexboxgrid.css' }
      , { from: './node_modules/normalize.css/normalize.css' }
      ]
    , { ignore: ['*.ls', '*.vue'] })
  ]
, module: {
    loaders: [
      { test: /\.ls$/, loader: 'livescript' }
    , { test: /\.vue$/, loader: 'vue' }
    ]
  }
, vue: {
    loaders: {
      livescript: 'livescript'
    , stylus: 'style!css!stylus'
    }
  }
}
