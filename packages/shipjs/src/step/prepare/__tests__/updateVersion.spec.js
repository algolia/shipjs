import { updateVersion as updateVersionPackageJson } from 'shipjs-lib';
import updateVersion from '../updateVersion';
import { print } from '../../../util';
import { mockPrint } from '../../../../tests/util';

describe('updateVersion', () => {
  it('works', () => {
    const versionUpdated = jest.fn();
    updateVersion({
      config: {
        versionUpdated,
      },
      nextVersion: '1.2.3',
      dir: '.',
      dryRun: false,
    });
    expect(updateVersionPackageJson).toHaveBeenCalledTimes(1);
    expect(updateVersionPackageJson).toHaveBeenCalledWith({
      dir: '.',
      nextVersion: '1.2.3',
    });
    expect(versionUpdated.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "dir": ".",
        "exec": undefined,
        "version": "1.2.3",
      }
    `);
  });

  it('works in dry mode', () => {
    const output = [];
    mockPrint(print, output);
    updateVersion({
      config: {},
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Updating the version.",
        "-> package.json",
        "-> execute versionUpdated() callback.",
      ]
    `);
  });
});
