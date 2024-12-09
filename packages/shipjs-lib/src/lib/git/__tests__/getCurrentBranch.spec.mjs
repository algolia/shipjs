import silentExec from '../../shell/silentExec.mjs';
import getCurrentBranch from '../getCurrentBranch.mjs';

describe('getCurrentBranch', () => {
  it('gets current branch', () => {
    silentExec('./tests/bootstrap-examples/current-branch.sh');
    expect(getCurrentBranch('sandbox/current-branch')).toBe('master');
  });
});
