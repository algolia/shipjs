module.exports = {
  transform: {
    '^.+.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/src/lib/config/__tests__/example'],
  watchPathIgnorePatterns: ['<rootDir>/sandbox'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
