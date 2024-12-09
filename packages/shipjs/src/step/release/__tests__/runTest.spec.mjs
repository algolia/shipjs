import runTest from '../runTest.mjs';
import { run, print } from '../../../util/index.mjs';

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

  it('skips test if testCommandBeforeRelease is falsy', () => {
    runTest({
      config: {
        testCommandBeforeRelease: null,
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(0);
    expect(print).toHaveBeenCalledTimes(2);
    expect(print.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "› Running test.",
        ],
        Array [
          "Skipping test because it is not configured.",
        ],
      ]
    `);
  });

  it('skips test if testCommandBeforeRelease returns falsy', () => {
    runTest({
      config: {
        testCommandBeforeRelease: () => '',
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(0);
    expect(print).toHaveBeenCalledTimes(2);
    expect(print.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "› Running test.",
        ],
        Array [
          "Skipping test because it is not configured.",
        ],
      ]
    `);
  });
});
