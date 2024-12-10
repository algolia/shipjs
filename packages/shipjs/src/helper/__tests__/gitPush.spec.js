import { getRepoURLWithToken, getRepoURLWithTokenMasked } from 'shipjs-lib';
import { print, run } from '../../util/index.js';
import { mockPrint } from '../../../tests/util/index.js';
import gitPush from '../gitPush.js';

describe('gitPush', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('works with token', () => {
    const output = [];
    mockPrint(print, output);
    process.env.GITHUB_TOKEN = 'abcdef';
    getRepoURLWithToken.mockImplementation(
      () => `https://abcdef@github.com/my/repo`
    );
    getRepoURLWithTokenMasked.mockImplementation(
      () => `https://xxx@github.com/my/repo`
    );
    gitPush({
      remote: 'origin',
      refs: ['master', 'v1.2.3'],
      dir: '.',
      dryRun: false,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "    $ git remote add origin-with-token https://xxx@github.com/my/repo",
      ]
    `);
    expect(run).toHaveBeenCalledTimes(4);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git remote add origin-with-token https://abcdef@github.com/my/repo",
        "dir": ".",
        "dryRun": false,
        "printCommand": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin-with-token master",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[2][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin-with-token v1.2.3",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[3][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git remote remove origin-with-token",
        "dir": ".",
        "dryRun": false,
        "printCommand": false,
      }
    `);
  });

  it('works without token', () => {
    gitPush({
      remote: 'origin',
      refs: ['master', 'v1.2.3'],
      dir: '.',
      dryRun: false,
    });
    expect(print).toHaveBeenCalledTimes(0);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin master",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin v1.2.3",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('force pushes', () => {
    gitPush({
      remote: 'origin',
      refs: ['master', 'v1.2.3'],
      forcePushBranches: ['master'],
      dir: '.',
      dryRun: false,
    });
    expect(print).toHaveBeenCalledTimes(0);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push -f origin master",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin v1.2.3",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
