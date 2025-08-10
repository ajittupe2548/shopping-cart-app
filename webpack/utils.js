const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const legacyBabelConfig = require("../babel.config");

const joinPath = pathname => path.join(__dirname, "..", pathname);

const PATHS = {
  SOURCE_DIR: joinPath("src"),
  BUILD_DIR: joinPath("build"),
  ROOT_DIR: joinPath(""),
  NODE_MODULES: joinPath("node_modules"),
};

const BABEL_INCLUDE_PATHS = [PATHS.SOURCE_DIR];

const BABEL_EXCLUDE_NODE_MODULES = /node_modules/;

const SASS_CONFIG = {
  test: /\.(sass|scss)$/,
  exclude: /\.module\.scss$/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
};

const CSS_CONFIG = {
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
};

const CSS_MODULES_CONFIG = {
  test: /\.module\.scss$/,
  include: /\.module\.scss$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: {
          mode: "local",
          localIdentName: "[hash:base64:6]",
        },
        importLoaders: 2,
      },
    },
    "postcss-loader",
    "sass-loader",
  ],
};

const JS_CONFIG = {
  test: /\.jsx?/,
  include: BABEL_INCLUDE_PATHS,
  exclude: BABEL_EXCLUDE_NODE_MODULES,
  use: [
    {
      loader: "babel-loader",
      options: Object.assign(legacyBabelConfig(), {
        cacheDirectory: true,
        cacheCompression: false,
      }),
    },
  ],
};

const removeEslintLoaderRule = config => {
  config.plugins = config.plugins.filter(
    x => x.constructor && x.constructor.name !== "ESLintWebpackPlugin"
  );
  return config;
};

module.exports = {
  PATHS,
  SASS_CONFIG,
  CSS_CONFIG,
  CSS_MODULES_CONFIG,
  JS_CONFIG,
  removeEslintLoaderRule,
};
