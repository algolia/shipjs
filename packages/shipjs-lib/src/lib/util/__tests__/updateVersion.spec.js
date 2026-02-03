import { resolve } from 'path';

import silentExec from '../../shell/silentExec.js';
import getCurrentVersion from '../getCurrentVersion.js';
import updateVersion from '../updateVersion.js';

describe('updateVersion', () => {
  it('update version correctly', () => {
    silentExec('./tests/bootstrap-examples/empty.sh version-updating');
    const dir = resolve('sandbox/version-updating');
    updateVersion({ nextVersion: '0.9.9', dir });
    expect(getCurrentVersion('sandbox/version-updating')).toBe('0.9.9');
  });
});
