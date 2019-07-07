/* eslint-disable import/no-commonjs */
module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  watchPathIgnorePatterns: ['<rootDir>/sandbox'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
