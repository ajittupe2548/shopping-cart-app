const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const {
  PATHS,
  SASS_CONFIG,
  CSS_CONFIG,
  CSS_MODULES_CONFIG,
  JS_CONFIG,
} = require("./utils.js");

module.exports = {
  entry: {
    index: PATHS.SOURCE_DIR + "/index.js",
  },
  output: {
    path: PATHS.BUILD_DIR,
  },
  module: {
    rules: [JS_CONFIG, CSS_CONFIG, SASS_CONFIG, CSS_MODULES_CONFIG],
  },
  plugins: [
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    // new ESLintPlugin({
    //   failOnError: true,
    //   cache: true,
    //   overrideConfigFile: "./eslint.config.js",
    //   lintDirtyModulesOnly: true,
    // }),
  ],
  context: PATHS.SOURCE_DIR,
  cache: {
    type: "filesystem",
    compression: "brotli",
  },
  resolve: {
    extensions: [".js", ".jsx", ".module.scss", ".css"],
    alias: {
      GlobalComponent: path.resolve(__dirname, "..", "src/components/"),
    },
    modules: [PATHS.NODE_MODULES],
    symlinks: false,
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  stats: {
    builtAt: true,
    warnings: false,
    timings: true,
    logging: "error",
    performance: false,
    children: false,
    chunks: false,
    modules: false,
  },
};
