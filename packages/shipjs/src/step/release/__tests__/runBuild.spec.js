import runBuild from '../runBuild.js';
import { run, print } from '../../../util/index.js';

describe('runBuild', () => {
  it('works', () => {
    runBuild({
      config: {
        buildCommand: () => 'yarn build',
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "command": "yarn build",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('skips build if buildCommand is falsy', () => {
    runBuild({
      config: {
        buildCommand: null,
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(0);
    expect(print).toHaveBeenCalledTimes(2);
    expect(print.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "› Building.",
        ],
        [
          "Skipping build because it is not configured.",
        ],
      ]
    `);
  });

  it('skips build if buildCommand returns falsy', () => {
    runBuild({
      config: {
        buildCommand: () => '',
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(0);
    expect(print).toHaveBeenCalledTimes(2);
    expect(print.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "› Building.",
        ],
        [
          "Skipping build because it is not configured.",
        ],
      ]
    `);
  });
});
