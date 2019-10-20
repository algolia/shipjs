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
        monorepo: {
          packagesToBump: ['packages/*'],
          mainVersionFile: 'lerna.json',
        },
      },
      dir: '.',
      nextVersion: '1.2.3',
    });
    expect(updateVersion).toHaveBeenCalledTimes(3);
    expect(updateVersion.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        Object {
          "dir": ".",
          "fileName": "lerna.json",
          "nextVersion": "1.2.3",
        },
      ]
    `);
    expect(updateVersion.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        Object {
          "dir": "packages/a",
          "nextVersion": "1.2.3",
        },
      ]
    `);
    expect(updateVersion.mock.calls[2]).toMatchInlineSnapshot(`
      Array [
        Object {
          "dir": "packages/b",
          "nextVersion": "1.2.3",
        },
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
        monorepo: {
          packagesToBump: ['packages/*'],
          mainVersionFile: 'lerna.json',
        },
      },
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Updating the versions on the monorepo.",
        "Your configuration: [\\"packages/*\\"]",
        "Main version file: lerna.json",
        "Actual packages to bump:",
        "-> packages/a/package.json",
        "-> packages/b/package.json",
        "-> execute versionUpdated() callback.",
      ]
    `);
  });
});
