const path = require("path");

module.exports = {
  // mode: 'production',
  mode: "development",
  entry: {
    app: "./client/scripts/app.js",
  },
  output: {
    path: path.resolve(__dirname, "client/public"),
    filename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
