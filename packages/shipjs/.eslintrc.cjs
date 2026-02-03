module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
  },
  extends: ['algolia', 'algolia/jest'],
  rules: {
    'import/no-commonjs': 'off',
    'import/extensions': ['error', 'ignorePackages'],
    'import/dynamic-import-chunkname': 'off',
    'jsdoc/newline-after-description': 'off',
  },
  overrides: [
    {
      files: ['jest.setup.js'],
      rules: {
        'jest/require-top-level-describe': 'off',
      },
    },
  ],
};
