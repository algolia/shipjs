import { getListToUpdate, printListToUpdate } from '../dependencyUpdater.mjs';
import { print } from '../../util/index.mjs';
import { mockPrint } from '../../../tests/util/index.mjs';

describe('getListToUpdate', () => {
  const list = [
    {
      packagePath: 'packages/package-core',
      json: {
        name: 'core',
      },
    },
    {
      packagePath: 'packages/package-js',
      json: {
        name: 'js',
        dependencies: {
          core: '^0.3.1',
        },
      },
    },
    {
      packagePath: 'packages/package-plugin-abc',
      json: {
        name: 'plugin-abc',
        dependencies: {
          core: '0.3.1',
        },
        peerDependencies: {
          js: '~0.3.1',
        },
        devDependencies: {
          js: '^0.3.1',
        },
      },
    },
  ];

  it('gets correct list', () => {
    const actual = getListToUpdate('0.3.2', list);
    expect(actual).toEqual([
      {
        name: 'js',
        packagePath: 'packages/package-js',
        updates: {
          dependencies: [
            {
              currentVersion: '^0.3.1',
              dependency: 'core',
              nextVersion: '^0.3.2',
            },
          ],
        },
      },
      {
        name: 'plugin-abc',
        packagePath: 'packages/package-plugin-abc',
        updates: {
          dependencies: [
            {
              currentVersion: '0.3.1',
              dependency: 'core',
              nextVersion: '0.3.2',
            },
          ],
          devDependencies: [
            {
              currentVersion: '^0.3.1',
              dependency: 'js',
              nextVersion: '^0.3.2',
            },
          ],
          peerDependencies: [
            {
              currentVersion: '~0.3.1',
              dependency: 'js',
              nextVersion: '~0.3.2',
            },
          ],
        },
      },
    ]);
  });

  it('prints the correct update list', () => {
    const output = [];
    mockPrint(print, output);
    printListToUpdate(getListToUpdate('0.3.2', list));
    expect(output).toMatchInlineSnapshot(`
      Array [
        "  package: js (packages/package-js}/package.json)",
        "    dependencies:",
        "      core: ^0.3.1 -> ^0.3.2",
        "  package: plugin-abc (packages/package-plugin-abc}/package.json)",
        "    dependencies:",
        "      core: 0.3.1 -> 0.3.2",
        "    devDependencies:",
        "      js: ^0.3.1 -> ^0.3.2",
        "    peerDependencies:",
        "      js: ~0.3.1 -> ~0.3.2",
      ]
    `);
  });
});
