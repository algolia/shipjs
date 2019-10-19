import runBuild from '../runBuild';
import { run } from '../../../util';

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
      Object {
        "command": "yarn build",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
