export const GIT_COMMIT_PREFIX_PATCH = new Set([
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'chore',
  'ci',
]);

export const GIT_COMMIT_PREFIX_MINOR = new Set(['feat']);

export const GIT_COMMIT_BREAKING_CHANGE = 'BREAKING CHANGE';

export const RELEASE_BRANCH = 'releases';
