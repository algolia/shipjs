import silentExec from '../../shell/silentExec';
import getCurrentBranch from '../getCurrentBranch';

describe('getCurrentBranch', () => {
  it('gets current branch', () => {
    silentExec('./tests/bootstrap-examples/current-branch.sh');
    expect(getCurrentBranch('sandbox/current-branch')).toBe('master');
  });
});
