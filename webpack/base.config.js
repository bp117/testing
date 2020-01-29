const webpack = require('webpack');
const merge = require("webpack-merge");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CopyPlugin = require('copy-webpack-plugin');

const path = require("path");
const APP_DIR = path.resolve(__dirname, '..', 'src', 'index.jsx');
const OUTPUT_FOLDER = path.resolve(__dirname, "..", "public");

module.exports = env => {
  const { PLATFORM } = env;
  return merge([
      {
        devtool: PLATFORM!=="production"?'source-map':false,
        entry: ['@babel/polyfill', APP_DIR],
        output: {
          path: OUTPUT_FOLDER,
          filename: path.join("js", "index.js"),
          publicPath: "/"
        },
        module: {
          rules: [
            {
              test: /\.jsx?$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader'
              }
            },
            {
              test: /\.s?css$/,
              include: /src/,
              use: [
                PLATFORM === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                'sass-loader'
              ]
            },
            {
              test: /\.(png|jpe?g|gif)$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    outputPath: 'images',
                  },
                },
              ],
            },
            {
                test: /\.(woff2?|eot|ttf|svg)$/,
                use: [
                  {
                    loader: 'file-loader?name="[name]-[hash].[ext]"',
                    options: {
                      outputPath: 'fonts',
                    },
                  },
                ]
            }
          ]
        },
        plugins: [
          new CopyPlugin([
            { from: './favicon.png' },
            { from: "./index.html"}
          ]),
          new MiniCssExtractPlugin({
            filename: path.join("css", "[name].css")
          })
        ],
        resolve: {
            extensions: [".js", ".jsx"]
        }
    }
  ])
};