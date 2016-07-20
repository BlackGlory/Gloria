var path = require('path')
  , CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    'background': './src/background.ls'
  }
, output: {
    path: path.join(__dirname, 'build')
  , filename: '[name].js'
  }
, devtool: 'source-map'
, plugins: [
    new CopyWebpackPlugin(
      [{ from: './src' }]
    , { ignore: ['*.ls'] })
  ]
, module: {
    loaders: [{
      test: /\.ls$/
    , loader: 'livescript'
    }]
  }
}
