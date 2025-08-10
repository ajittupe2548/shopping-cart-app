const babelEslint = require("@babel/eslint-parser");
const globals = require("globals");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = [
  {
    files: ["src/**/*.js", "src/**/*.jsx"],
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      parser: babelEslint,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        __dev__: true,
        __prod__: false,
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      prettier: prettierPlugin,
      "react-hooks": require("eslint-plugin-react-hooks"),
      jest: require("eslint-plugin-jest"),
    },
    settings: {
      react: {
        pragma: "React",
        version: "detect",
        flowVersion: "0.53",
      },
      "import/resolver": {
        webpack: {
          config: `${__dirname}/webpack/dev.config.js`,
        },
      },
    },
    rules: {
      "linebreak-style": 0,
      "no-undef": "error",
      "prefer-destructuring": "error",
      "no-var": "error",
      "eol-last": ["error", "always"],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "react/jsx-key": ["warn", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "warn",
      "react/require-render-return": "warn",
      "react/jsx-no-undef": "error",
      "react/no-unknown-property": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-string-refs": ["warn", { noTemplateLiterals: true }],
      "react/no-deprecated": "warn",
      "react/no-danger-with-children": "warn",
      "react/display-name": "warn",
      "react/no-typos": "warn",
      "react/prefer-stateless-function": "warn",
      "react/jsx-pascal-case": "warn",
      "react/destructuring-assignment": ["warn", "always"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "error",
    },
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "public/",
      "src/assets/",
    ],
  },
  // Test files configuration
  {
    files: [
      "src/**/*.test.js",
      "src/**/*.test.jsx",
      "src/__tests__/**/*.js",
      "src/__tests__/**/*.jsx",
    ],
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      parser: babelEslint,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      prettier: prettierPlugin,
      "react-hooks": require("eslint-plugin-react-hooks"),
      jest: require("eslint-plugin-jest"),
    },
    settings: {
      react: {
        pragma: "React",
        version: "detect",
      },
    },
    rules: {
      "linebreak-style": 0,
      "no-undef": "error",
      "prefer-destructuring": "error",
      "no-var": "error",
      "eol-last": ["error", "always"],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "react/jsx-key": ["warn", { checkFragmentShorthand: true }],
      "react/jsx-no-duplicate-props": "warn",
      "react/require-render-return": "warn",
      "react/jsx-no-undef": "error",
      "react/no-unknown-property": "warn",
      "react/no-unescaped-entities": "warn",
      "react/no-direct-mutation-state": "warn",
      "react/no-string-refs": ["warn", { noTemplateLiterals: true }],
      "react/no-deprecated": "warn",
      "react/no-danger-with-children": "warn",
      "react/display-name": "warn",
      "react/no-typos": "warn",
      "react/prefer-stateless-function": "warn",
      "react/jsx-pascal-case": "warn",
      "react/destructuring-assignment": ["warn", "always"],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  },
  // Setup files configuration
  {
    files: ["src/setupTests.js"],
    languageOptions: {
      ecmaVersion: 6,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "linebreak-style": 0,
      "no-undef": "error",
      "eol-last": ["error", "always"],
      "no-mixed-spaces-and-tabs": "error",
      "no-trailing-spaces": "error",
      "prettier/prettier": "error",
    },
  },
];
