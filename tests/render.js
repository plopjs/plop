const { render, ...props } = require("cli-testing-library");
const { resolve } = require("path");

module.exports = {
  ...props,
  /**
   * @param {Array} args
   * @param {Object} opts
   */
  renderPlop(args = [], opts = {}) {
    const { cwd = __dirname } = opts;

    const rendered = render(
      "npx",
      [
        "nyc",
        "--silent",
        "node",
        resolve(__dirname, "../instrumented/bin/plop.js"),
        ...args,
      ],
      {
        cwd,
      }
    );

    return rendered;
  },
};
