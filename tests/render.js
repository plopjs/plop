const { render, ...props } = require("cli-testing-library");
const { resolve } = require("path");

/**
 * @param {String} script
 * @param {Array} args
 * @param {Object} opts
 */
function renderScript(script, args = [], opts = {}) {
  const { cwd = __dirname } = opts;

  const rendered = render("npx", ["nyc", "--silent", "node", script, ...args], {
    cwd,
  });

  return rendered;
}

/**
 * @param {Array} args
 * @param {Object} opts
 */
function renderPlop(args = [], opts = {}) {
  return renderScript(
    resolve(__dirname, "../instrumented/bin/plop.js"),
    args,
    opts
  );
}

module.exports = {
  ...props,
  renderScript,
  renderPlop,
};
