import silentExec from '../../shell/silentExec';
import currentVersion from '../currentVersion';
import updateVersion from '../updateVersion';
import path from 'path';

describe('updateVersion', () => {
  it('update version correctly', () => {
    silentExec('./tests/bootstrap-examples/empty.sh version-updating');
    const version = currentVersion('sandbox/version-updating');
    const filePath = path.resolve('sandbox/version-updating', 'package.json');
    updateVersion([filePath], version, '0.9.9');
    expect(currentVersion('sandbox/version-updating')).toBe('0.9.9');
  });
});
