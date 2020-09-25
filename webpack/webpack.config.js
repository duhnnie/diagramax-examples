const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: __dirname,
  },
};
