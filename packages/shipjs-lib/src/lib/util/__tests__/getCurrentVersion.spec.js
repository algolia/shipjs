import getCurrentVersion from '../getCurrentVersion';
import silentExec from '../../shell/silentExec';

describe('getCurrentVersion', () => {
  it('gets current version', () => {
    silentExec('./tests/bootstrap-examples/empty.sh nothing');
    expect(getCurrentVersion('sandbox/nothing')).toBe('0.0.1');
  });
});
