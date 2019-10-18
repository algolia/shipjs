import { expandPackageList, updateVersion } from 'shipjs-lib';
import { print } from '../../../util';
import updateVersionMonorepo from '../updateVersionMonorepo';
import { mockPrint } from '../../../../tests/util';

describe('updateVersionMonorepo', () => {
  it('works', () => {
    expandPackageList.mockImplementationOnce(() => [
      'packages/a',
      'packages/b',
    ]);
    const versionUpdated = jest.fn();
    updateVersionMonorepo({
      config: {
        versionUpdated,
        monorepo: { packagesToBump: ['packages/*'] },
      },
      dir: '.',
      nextVersion: '1.2.3',
    });
    expect(updateVersion).toHaveBeenCalledTimes(2);
    expect(updateVersion.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "1.2.3",
        "packages/a",
      ]
    `);
    expect(updateVersion.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        "1.2.3",
        "packages/b",
      ]
    `);
    expect(versionUpdated).toHaveBeenCalledTimes(1);
    expect(versionUpdated.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "dir": ".",
        "exec": undefined,
        "version": "1.2.3",
      }
    `);
  });

  it('works in dry mode', () => {
    expandPackageList.mockImplementationOnce(() => [
      'packages/a',
      'packages/b',
    ]);
    const output = [];
    mockPrint(print, output);
    updateVersionMonorepo({
      config: {
        monorepo: { packagesToBump: ['packages/*'] },
      },
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Updating the versions on the monorepo.",
        "Your configuration: [\\"packages/*\\"]",
        "Actual packages to bump:",
        "-> packages/a/package.json",
        "-> packages/b/package.json",
        "-> execute versionUpdated() callback.",
      ]
    `);
  });
});
