module.exports = {
  arrowParens: "avoid",
  bracketSpacing: true,
  endOfLine: "crlf",
  htmlWhitespaceSensitivity: "css",
  printWidth: 80,
  proseWrap: "preserve",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 200,
      },
    },
  ],
};
