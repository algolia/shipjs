import silentExec from '../../shell/silentExec';
import getCurrentVersion from '../getCurrentVersion';
import updateVersion from '../updateVersion';
import { resolve } from 'path';

describe('updateVersion', () => {
  it('update version correctly', () => {
    silentExec('./tests/bootstrap-examples/empty.sh version-updating');
    const filePath = resolve('sandbox/version-updating', 'package.json');
    updateVersion([filePath], '0.9.9');
    expect(getCurrentVersion('sandbox/version-updating')).toBe('0.9.9');
  });
});
