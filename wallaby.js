module.exports = function (wallaby) {
  return {
    files: ["bin/**/*.js", "src/**/*.js", "!tests/**/*.ava.js"],
    tests: ["tests/**/*.ava.js"],
    env: {
      type: "node",
      runner: "node",
    },
    testFramework: "ava",
    debug: true,
  };
};
