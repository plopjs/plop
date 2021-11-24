module.exports = {
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  projects: [require.resolve("./tests/config/jest.config.js")],
};
