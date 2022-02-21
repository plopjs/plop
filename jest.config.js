export default {
    testMatch: ["**/jest-tests/**/*.js"],
    watchPlugins: [
        "jest-watch-typeahead/filename",
        "jest-watch-typeahead/testname",
    ],
    transform: {},
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
    ],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
