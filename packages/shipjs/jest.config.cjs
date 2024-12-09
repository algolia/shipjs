module.exports = {
  transform: {
    '^.+.m?js$': 'babel-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.?(m)js?(x)', '**/?(*.)(spec|test).?(m)js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node', 'mjs'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: ['./jest.setup.cjs'],
};
