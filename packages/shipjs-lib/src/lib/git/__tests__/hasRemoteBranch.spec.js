import hasRemoteBranch from '../hasRemoteBranch.js';

describe('hasRemoteBranch', () => {
  it('checks when it exists', () => {
    expect(hasRemoteBranch('origin', 'master', '.')).toBe(true);
  }, 10000);

  it('checks when it does not exist', () => {
    expect(hasRemoteBranch('origin', 'unknown-branch-name', '.')).toBe(false);
  });
});
