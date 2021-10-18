const execa = require("execa");

module.exports = {
  runInstrumentedPlop: (...args) =>
    execa("npx", [
      "nyc",
      "--silent",
      "node",
      "./instrumented/bin/plop.js",
      ...args,
    ]),
};
