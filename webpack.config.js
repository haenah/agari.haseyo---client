const path = require('path');

/** @type {import('webpack').Configuration} */
const config = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

/** @type {import('webpack-dev-server').Configuration} */
const devServerConfig = {
  contentBase: path.join(__dirname, 'dist'),
  port: 3000,
  historyApiFallback: true,
};

config.devServer = devServerConfig;

module.exports = config;
