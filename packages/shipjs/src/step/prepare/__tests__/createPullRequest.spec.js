import { getRepoURL, silentExec } from 'shipjs-lib';
import tempWrite from 'temp-write';
import createPullRequest from '../createPullRequest';
import { run } from '../../../util';
jest.mock('shipjs-lib');
jest.mock('temp-write');
jest.mock('../../../util');
jest.mock('../../../color');

const defaultParams = {
  baseBranch: 'master',
  config: {
    mergeStrategy: {
      toSameBranch: ['master'],
    },
    formatPullRequestMessage: () => 'chore: releases v0.1.1',
    remote: 'origin',
    pullRequestReviewer: ['foo', 'bar'],
  },
  dir: '.',
};

describe('createPullRequest', () => {
  beforeEach(() => {
    getRepoURL.mockImplementationOnce(() => 'https://github.com/my/repo');
    tempWrite.sync.mockImplementationOnce(() => '/temp/path');
  });

  it('works in dry mode', () => {
    const ret = createPullRequest({
      ...defaultParams,
      dryRun: true,
    });
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git remote prune origin",
        "dir": ".",
        "dryRun": true,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "hub pull-request --base master --browse --push --reviewer foo,bar --file /temp/path",
        "dir": ".",
        "dryRun": true,
      }
    `);
    expect(ret).toEqual({});
  });

  it('returns pr url', () => {
    silentExec.mockImplementationOnce(() => ({
      toString: () => `13 chore: releases v0.1.1\n12 docs: update README`,
    }));
    const { pullRequestUrl } = createPullRequest({
      ...defaultParams,
    });
    expect(pullRequestUrl).toEqual('https://github.com/my/repo/pull/13');
  });
});
