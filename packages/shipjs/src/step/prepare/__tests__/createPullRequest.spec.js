import { getRepoURL, getRepoInfo, silentExec } from 'shipjs-lib';
import tempWrite from 'temp-write';
import Octokit from '@octokit/rest';
import createPullRequest from '../createPullRequest';
import { run } from '../../../util';
import { getDestinationBranchName } from '../../../helper';
jest.mock('temp-write');
jest.mock('@octokit/rest');

const getDefaultParams = ({
  currentVersion = '1.2.2',
  nextVersion = '1.2.3',
  releaseType = 'patch',
  formatPullRequestTitle = () => 'chore: releases v0.1.1',
  formatPullRequestMessage = () => 'chore: releases v0.1.1',
  noBrowse = true,
  dryRun = false,
} = {}) => ({
  baseBranch: 'master',
  currentVersion,
  nextVersion,
  releaseType,
  config: {
    mergeStrategy: {
      toSameBranch: ['master'],
    },
    formatPullRequestTitle,
    formatPullRequestMessage,
    remote: 'origin',
    pullRequestReviewer: ['foo', 'bar'],
  },
  noBrowse,
  dir: '.',
  dryRun,
});

describe('createPullRequest', () => {
  beforeEach(() => {
    getRepoURL.mockImplementationOnce(() => 'https://github.com/my/repo');
    getRepoInfo.mockImplementationOnce(() => ({
      owner: 'my',
      name: 'repo',
      repo: 'my/repo',
      branch: 'master',
      url: 'https://github.com/my/repo',
    }));
    tempWrite.sync.mockImplementationOnce(() => '/temp/path');
    getDestinationBranchName.mockImplementation(() => 'master');
  });

  it('works in dry mode', async () => {
    const ret = await createPullRequest(getDefaultParams({ dryRun: true }));
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git remote prune origin",
        "dir": ".",
        "dryRun": true,
      }
    `);
    expect(Octokit).toHaveBeenCalledTimes(0);
    expect(ret).toEqual({});
  });

  it('returns pr url', async () => {
    const create = jest.fn().mockImplementationOnce(() => ({
      data: { number: 13, html_url: 'https://github.com/my/repo/pull/13' }, // eslint-disable-line camelcase
    }));
    Octokit.mockImplementationOnce(function() {
      this.pulls = { create, createReviewRequest: jest.fn() };
    });
    const { pullRequestUrl } = await createPullRequest(getDefaultParams());
    expect(pullRequestUrl).toEqual('https://github.com/my/repo/pull/13');
  });

  it('pass releaseType to hooks', () => {
    const mockFormatPullRequestTitle = jest
      .fn()
      .mockImplementation(({ version, type }) => `# v${version} (${type})`);
    const mockFormatPullRequestMessage = jest
      .fn()
      .mockImplementation(
        ({ formatPullRequestTitle, nextVersion, releaseType }) => {
          return [
            formatPullRequestTitle({
              version: nextVersion,
              releaseType,
            }),
          ].join('\n');
        }
      );
    createPullRequest(
      getDefaultParams({
        dryRun: true,
        formatPullRequestTitle: mockFormatPullRequestTitle,
        formatPullRequestMessage: mockFormatPullRequestMessage,
      })
    );
    expect(mockFormatPullRequestTitle).toHaveBeenCalledWith({
      version: '1.2.3',
      releaseType: 'patch',
    });
    expect(mockFormatPullRequestMessage).toHaveBeenCalled();
    expect(mockFormatPullRequestMessage.mock.calls[0][0]).toMatchObject({
      currentVersion: '1.2.2',
      nextVersion: '1.2.3',
      releaseType: 'patch',
    });
  });
});
