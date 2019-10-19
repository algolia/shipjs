import runTest from '../runTest';
import { run } from '../../../util';

describe('runTest', () => {
  it('works', () => {
    runTest({
      config: {
        testCommandBeforeRelease: () => 'yarn test',
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "yarn test",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
