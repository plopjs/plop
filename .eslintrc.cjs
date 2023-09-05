const ts = {
  files: ["**/*.ts"],
  extends: [
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    allowImportExportEverywhere: true,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "prefer-const": "off"
  },
};

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
    allowImportExportEverywhere: true,
  },
  extends: ["plugin:prettier/recommended"],
  rules: {
    // https://github.com/plopjs/plop/issues/288
    "linebreak-style": ["error", "unix"],
  },
  overrides: [ts],
};
