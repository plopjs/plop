module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:prettier/recommended"],
  rules: {
    // https://github.com/plopjs/plop/issues/288
    "linebreak-style": ["error", "unix"],
  },
};
