module.exports = {
  transform: {
    '^.+.m?js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
  testPathIgnorePatterns: ['<rootDir>/src/lib/config/__tests__/example'],
  watchPathIgnorePatterns: ['<rootDir>/sandbox'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
