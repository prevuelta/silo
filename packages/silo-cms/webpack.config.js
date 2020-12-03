const path = require("path");

console.log("This is the right webpack");

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
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-transform-runtime",
            ],
          },
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
