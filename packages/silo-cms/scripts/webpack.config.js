const path = require("path");

const { SITE_DIR } = process.env;

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    main: `${SITE_DIR}/src/scripts/main.js`,
  },
  output: {
    path: `${SITE_DIR}/dist`,
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
