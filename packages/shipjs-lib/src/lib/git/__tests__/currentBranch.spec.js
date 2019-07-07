import silentExec from '../../shell/silentExec';
import currentBranch from '../currentBranch';

describe('currentBranch', () => {
  it('gets current branch', () => {
    silentExec('./tests/bootstrap-examples/current-branch.sh');
    expect(currentBranch('sandbox/current-branch')).toBe('master');
  });
});
