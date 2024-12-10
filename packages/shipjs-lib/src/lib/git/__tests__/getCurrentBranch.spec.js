import silentExec from '../../shell/silentExec.js';
import getCurrentBranch from '../getCurrentBranch.js';

describe('getCurrentBranch', () => {
  it('gets current branch', () => {
    silentExec('./tests/bootstrap-examples/current-branch.sh');
    expect(getCurrentBranch('sandbox/current-branch')).toBe('master');
  });
});
