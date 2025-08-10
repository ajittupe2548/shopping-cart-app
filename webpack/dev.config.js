const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const commonConfig = require("./common.config");
const { PATHS } = require("./utils");

module.exports = merge(commonConfig, {
  devtool: "eval-cheap-source-map",
  mode: "development",
  output: {
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].css",
      ignoreOrder: false,
    }),
    new HtmlWebPackPlugin({
      filename: "index.html",
      template: "../src/index.html",
    }),
    ...(process.env.ANALYZE
      ? [
          new BundleAnalyzerPlugin({
            openAnalyzer: true,
            generateStatsFile: true,
            defaultSizes: "gzip",
            logLevel: "silent",
          }),
        ]
      : []),
  ],
  devServer: {
    static: {
      directory: PATHS.BUILD_DIR,
      publicPath: "/",
    },
    compress: true,
    port: 4000,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
});
