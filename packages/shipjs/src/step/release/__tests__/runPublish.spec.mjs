import { expandPackageList } from 'shipjs-lib';
import { run, print } from '../../../util/index.mjs';
import runPublish from '../runPublish.mjs';
import { mockPrint } from '../../../../tests/util/index.mjs';
jest.unmock('../../../helper');
// if `unmock` causes any trouble in the future,
// we might try this: https://github.com/facebook/jest/issues/2649#issuecomment-360467278
// `runPublish` depends on `getPublishCommand` from `helper`
// and we need it unmocked to successfully run the following tests.

describe('runPublish', () => {
  it('works with yarn', () => {
    runPublish({
      isYarn: true,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm config set \\"//registry.npmjs.org/:_authToken\\" \\"\\\\\${NPM_AUTH_TOKEN}\\"",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm_config_registry=https://registry.npmjs.org/ npm publish --tag latest",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('works with npm', () => {
    runPublish({
      isYarn: false,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm config set \\"//registry.npmjs.org/:_authToken\\" \\"\\\\\${NPM_AUTH_TOKEN}\\"",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm publish --tag latest",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('works with monorepo', () => {
    const output = [];
    mockPrint(print, output);
    expandPackageList.mockImplementationOnce(() => [
      '/package-a',
      '/package-b',
    ]);
    runPublish({
      isYarn: true,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
        monorepo: {},
      },
      releaseTag: 'latest',
      dir: '.',
      dryRun: false,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Publishing.",
        "Running the following at /package-a",
        "Running the following at /package-b",
      ]
    `);
    expect(run).toHaveBeenCalledTimes(3);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm config set \\"//registry.npmjs.org/:_authToken\\" \\"\\\\\${NPM_AUTH_TOKEN}\\"",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm_config_registry=https://registry.npmjs.org/ npm publish --tag latest",
        "dir": "/package-a",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[2][0]).toMatchInlineSnapshot(`
      Object {
        "command": "npm_config_registry=https://registry.npmjs.org/ npm publish --tag latest",
        "dir": "/package-b",
        "dryRun": false,
      }
    `);
  });
});
