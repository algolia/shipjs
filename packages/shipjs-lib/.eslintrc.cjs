module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['algolia'],
  rules: {
    'import/no-commonjs': 'off',
    'import/extensions': ['error', 'ignorePackages'],
    'import/dynamic-import-chunkname': 'off',
    'jsdoc/newline-after-description': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.js', '*.config.js'],
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
