const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'web'
, entry: {
    'background': './src/background.ts'
  , 'extension-duokan-helper': './src/extension-duokan-helper.ts'
  }
, output: {
    path: path.resolve(__dirname, 'dist')
  , filename: '[name].js'
  }
, resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  , extensions: [".js", ".json", ".ts", ".tsx"]
  }
, module: {
    rules: [
      {
        test: /\.tsx?$/
      , exclude: /node_module/
      , use: 'ts-loader'
      }
    ]
  }
, plugins: [
    new CleanWebpackPlugin(['dist'])
  , new CopyWebpackPlugin([
      { from: './src/manifest.json' }
    , { from: './src/assets', to: 'assets' }
    , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' }
    , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' }
    ])
  ]
}