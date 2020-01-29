/* eslint-disable */
const merge = require("webpack-merge");
// Plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// Configs
const baseConfig = require("./base.config");

const DefinePlugin = require("webpack").DefinePlugin;

const prodConfiguration = env => {
    return merge([
        {
            optimization: {
                minimizer: [new UglifyJsPlugin()]
            },
            plugins: [
                new MiniCssExtractPlugin(),
                new OptimizeCssAssetsPlugin(),
                new DefinePlugin({ "process.env.NODE_ENV": '"production"' })
            ]
        }
    ]);
};

module.exports = env => {
    return merge(baseConfig(env), prodConfiguration(env));
};
