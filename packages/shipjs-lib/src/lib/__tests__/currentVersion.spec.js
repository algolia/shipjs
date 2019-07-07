import currentVersion from '../currentVersion';
import silentExec from '../shell/silentExec';

describe('currentVersion', () => {
  it('gets current version', () => {
    silentExec('./tests/bootstrap-examples/empty.sh nothing');
    expect(currentVersion('sandbox/nothing')).toBe('0.0.1');
  });
});
