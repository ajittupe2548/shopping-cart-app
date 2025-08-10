module.exports = api => {
  if (api && api.cache) {
    api.cache(true);
  }

  const isDev = process.env["NODE_ENV"] === "development";
  const isTest = process.env["NODE_ENV"] === "test";
  const isProd = process.env["NODE_ENV"] === "production";

  return {
    presets: [
      [
        "@babel/preset-env",
        isDev || isTest
          ? {
              targets: {
                node: "current",
              },
            }
          : {
              targets: {
                browsers: [">0.2%", "not dead", "not op_mini all"],
              },
              useBuiltIns: "usage",
              corejs: 3,
              modules: false,
            },
      ],
      [
        "@babel/preset-react",
        {
          runtime: "automatic",
          development: isDev,
        },
      ],
    ],
    plugins: [
      "@babel/plugin-syntax-dynamic-import",
      [
        "@babel/plugin-transform-runtime",
        {
          helpers: true,
          regenerator: false,
        },
      ],
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-transform-nullish-coalescing-operator",
      "@babel/plugin-transform-optional-chaining",
      ...(isProd ? ["babel-plugin-transform-react-remove-prop-types"] : []),
    ],
  };
};
