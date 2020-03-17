const path = require('path')

module.exports = {
  entry: {
    demo: path.join(__dirname, 'demo/demo.ts')
  }
, output: {
    path: path.join(__dirname, 'demo')
  , filename: 'demo.js'
  }
, devtool: 'source-map'
, target: 'web'
, node: {
    fs: 'empty'
  }
, module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts' }
    , { test: /\.json$/, loader: 'json' }
    ]
  }
}
