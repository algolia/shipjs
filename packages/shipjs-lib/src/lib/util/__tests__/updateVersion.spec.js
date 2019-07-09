import silentExec from '../../shell/silentExec';
import getCurrentVersion from '../getCurrentVersion';
import updateVersion from '../updateVersion';
import path from 'path';

describe('updateVersion', () => {
  it('update version correctly', () => {
    silentExec('./tests/bootstrap-examples/empty.sh version-updating');
    const version = getCurrentVersion('sandbox/version-updating');
    const filePath = path.resolve('sandbox/version-updating', 'package.json');
    updateVersion([filePath], version, '0.9.9');
    expect(getCurrentVersion('sandbox/version-updating')).toBe('0.9.9');
  });
});
