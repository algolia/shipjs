import silentExec from '../../shell/silentExec';
import getCurrentVersion from '../getCurrentVersion';
import updateVersion from '../updateVersion';
import { resolve } from 'path';

describe('updateVersion', () => {
  it('update version correctly', () => {
    silentExec('./tests/bootstrap-examples/empty.sh version-updating');
    const dir = resolve('sandbox/version-updating');
    updateVersion({ nextVersion: '0.9.9', dir });
    expect(getCurrentVersion('sandbox/version-updating')).toBe('0.9.9');
  });
});
