import { expandPackageList, updateVersion } from 'shipjs-lib';

import { mockPrint } from '../../../../tests/util/index.js';
import { prepareJsons } from '../../../helper/dependencyUpdater.js';
import { print } from '../../../util/index.js';
import updateVersionMonorepo from '../updateVersionMonorepo.js';

jest.mock('../../../helper/dependencyUpdater', () => {
  return {
    ...jest.requireActual('../../../helper/dependencyUpdater'),
    prepareJsons: jest.fn(() => []),
  };
});

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
      releaseType: 'patch',
    });
    expect(updateVersion).toHaveBeenCalledTimes(3);
    expect(updateVersion.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "dir": ".",
          "fileName": "lerna.json",
          "nextVersion": "1.2.3",
        },
      ]
    `);
    expect(updateVersion.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
          "dir": "packages/a",
          "nextVersion": "1.2.3",
        },
      ]
    `);
    expect(updateVersion.mock.calls[2]).toMatchInlineSnapshot(`
      [
        {
          "dir": "packages/b",
          "nextVersion": "1.2.3",
        },
      ]
    `);
    expect(versionUpdated).toHaveBeenCalledTimes(1);
    expect(versionUpdated.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "dir": ".",
        "exec": undefined,
        "releaseType": "patch",
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
    prepareJsons.mockImplementation(() => []);
    updateVersionMonorepo({
      config: {
        versionUpdated: () => {},
        monorepo: {
          packagesToBump: ['packages/*'],
          mainVersionFile: 'lerna.json',
        },
      },
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      [
        "› Updating the versions on the monorepo.",
        "Your configuration: ["packages/*"]",
        "Main version file: lerna.json",
        "Actual packages to bump:",
        "-> packages/a/package.json",
        "-> packages/b/package.json",
        "Updating dependencies:",
        "-> execute versionUpdated() callback.",
      ]
    `);
  });
});
