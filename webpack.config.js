var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

var ignoreSpecs = new webpack.IgnorePlugin(/(\.spec\.ts|\.json)$/);

var dirSrc = path.resolve(__dirname, 'src', 'http');
var dirDist = path.resolve(__dirname, 'dist');

var config = {
  devtool: 'inline-source-map',
  context: dirSrc,
  target: 'node',
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  entry: './index.ts',
  output: {
    path: dirDist,
    filename: 'bundle.umd.js',
    library: 'http-interceptor',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        query: {
          declaration: false,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          moduleResolution: 'node',
          sourceMap: true,
          module: 'umd',
          target: 'es5',
          typeRoots: ['./node_modules/@types'],
          useForkChecker: true
        }
      }
    ]
  },
  plugins: [
    ignoreSpecs
  ],
  externals: [nodeExternals()]
};

module.exports = config;
