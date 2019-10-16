import { run } from '../../../util';
import path from 'path';
import updateChangelog from '../updateChangelog';
jest.mock('path');
jest.mock('../../../util');

describe('updateChangelog', () => {
  it('works', () => {
    path.resolve.mockImplementation(() => '/temp/path/conventional-changelog');
    updateChangelog({
      config: {
        updateChangelog: true,
        conventionalChangelogArgs: '--foo bar',
      },
      firstRelease: false,
      releaseCount: 5,
      dir: '.',
      dryRun: false,
    });
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "/temp/path/conventional-changelog --foo bar -r 5",
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
