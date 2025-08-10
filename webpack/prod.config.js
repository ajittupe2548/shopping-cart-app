const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const commonConfig = require("./common.config");
const { removeEslintLoaderRule } = require("./utils.js");

module.exports = merge(removeEslintLoaderRule(commonConfig), {
  devtool: false,
  mode: "production",
  output: {
    filename: "js/[name].[contenthash:9].js",
    chunkFilename: "js/[name].[contenthash:9].js",
  },
  optimization: {
    moduleIds: "deterministic",
    sideEffects: false,
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          compress: {
            hoist_funs: true,
            drop_console: true,
            passes: 2,
          },
          format: {
            comments: false,
          },
          keep_classnames: true,
          keep_fnames: true,
          ecma: 2015,
          safari10: false,
        },
      }),
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minChunks: 1,
      automaticNameDelimiter: "-split-",
      name: (module, chunks, cacheGroupKey) => {
        const allChunksNames = chunks
          .map(chunk => chunk.name || "unknown")
          .join("~")
          .substring(0, 50);
        return `${cacheGroupKey}-${allChunksNames}`;
      },
      maxInitialRequests: 30,
      cacheGroups: {
        default: false,
        defaultVendors: false,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10,
        },
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: "react",
          chunks: "all",
          priority: -9,
        },
      },
    },
    removeAvailableModules: true,
    removeEmptyChunks: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:9].css",
      chunkFilename: "css/[name].[contenthash:9].css",
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
});
