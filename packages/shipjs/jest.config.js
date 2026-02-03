export default {
  transform: {
    '^.+.js$': 'babel-jest',
  },
  // Transform ESM-only node_modules packages
  transformIgnorePatterns: [
    '/node_modules/(?!(temp-write|strip-ansi|ansi-regex)/)',
  ],
  testEnvironment: 'node',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
