import { run } from '../../../util';
import path from 'path';
import updateChangelog from '../updateChangelog';
jest.mock('path');
jest.mock('temp-write', () => ({
  sync: () => '/temp/file/path',
}));

describe('updateChangelog', () => {
  it('works', () => {
    path.resolve.mockImplementation(() => '/temp/path/conventional-changelog');
    updateChangelog({
      config: {
        updateChangelog: true,
        conventionalChangelogArgs: '--foo bar',
      },
      revisionRange: 'abcdefg..HEAD',
      firstRelease: false,
      releaseCount: 5,
      dir: '.',
      dryRun: false,
    });
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "/temp/path/conventional-changelog --foo bar -r 5 -n /temp/file/path",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('skips', () => {
    updateChangelog({
      config: {
        updateChangelog: false,
      },
    });
    expect(run).toHaveBeenCalledTimes(0);
  });
});
