const path = require("path");

module.exports = {
  rootDir: path.join(__dirname, "../.."),
  displayName: "node",
  testEnvironment: "jest-environment-node",
  testMatch: ["**/tests/**.spec.js"],
};
