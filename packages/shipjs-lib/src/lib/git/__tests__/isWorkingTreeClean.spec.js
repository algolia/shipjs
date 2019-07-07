import isWorkingTreeClean from '../isWorkingTreeClean';
import silentExec from '../../shell/silentExec';

describe('isWorkingTreeClean', () => {
  it('checks if it is clean', () => {
    silentExec('./tests/bootstrap-examples/clean-working-tree.sh');
    expect(isWorkingTreeClean('sandbox/clean-working-tree')).toBe(true);
  });

  it('checks if it is unclean', () => {
    silentExec('./tests/bootstrap-examples/unclean-working-tree.sh');
    expect(isWorkingTreeClean('sandbox/unclean-working-tree')).toBe(false);
  });
});
