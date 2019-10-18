import { getRepoURLWithToken, getRepoURLWithTokenMasked } from 'shipjs-lib';
import push from '../push';
import { run, print } from '../../../util';
import { mockPrint } from '../../../../tests/util';
jest.mock('../../../util');

const defaultParams = {
  config: {
    remote: 'origin',
  },
  currentBranch: 'master',
  dir: '.',
  dryRun: false,
};

describe('push', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = {};
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it('works with token', () => {
    const output = [];
    process.env.GITHUB_TOKEN = 'abcdef';
    getRepoURLWithToken.mockImplementation(
      () => `https://abcdef@github.com/my/repo`
    );
    getRepoURLWithTokenMasked.mockImplementation(
      () => `https://xxxgithub.com/my/repo`
    );
    print.mockImplementation((...args) => output.push(args.join(' ')));
    push(defaultParams);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Pushing to remote.",
        "  $ git remote add origin-with-token https://xxxgithub.com/my/repo",
      ]
    `);
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git remote add origin-with-token https://abcdef@github.com/my/repo",
        "dir": ".",
        "dryRun": false,
        "printCommand": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin-with-token master",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });

  it('works without token', () => {
    process.env.GITHUB_TOKEN = undefined;
    getRepoURLWithToken.mockImplementation(
      () => `https://abcdef@github.com/my/repo`
    );
    getRepoURLWithTokenMasked.mockImplementation(
      () => `https://xxxgithub.com/my/repo`
    );
    const output = [];
    mockPrint(print, output);
    push(defaultParams);
    expect(print).toHaveBeenCalledTimes(1);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Pushing to remote.",
      ]
    `);
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git push origin master",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
