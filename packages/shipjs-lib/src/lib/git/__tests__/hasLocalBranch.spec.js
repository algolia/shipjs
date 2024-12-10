import hasLocalBranch from '../hasLocalBranch.js';
import silentExec from '../../shell/silentExec.js';

describe('hasLocalBranch', () => {
  beforeAll(() => {
    silentExec('./tests/bootstrap-examples/only-master-branch.sh');
  });

  it('checks when it exists', () => {
    expect(hasLocalBranch('master', 'sandbox/only-master-branch')).toBe(true);
  });

  it('checks when it does not exist', () => {
    expect(
      hasLocalBranch('unknown-branch-name', 'sandbox/only-master-branch')
    ).toBe(false);
  });
});
