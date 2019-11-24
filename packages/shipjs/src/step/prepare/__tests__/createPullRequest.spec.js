import { getRepoURL, silentExec } from 'shipjs-lib';
import tempWrite from 'temp-write';
import createPullRequest from '../createPullRequest';
import { run } from '../../../util';
import { getDestinationBranchName } from '../../../helper';
jest.mock('temp-write');

const getDefaultParams = ({
  currentVersion = '1.2.2',
  nextVersion = '1.2.3',
  releaseType = 'patch',
  formatPullRequestTitle = () => 'chore: releases v0.1.1',
  formatPullRequestMessage = () => 'chore: releases v0.1.1',
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
  dir: '.',
  dryRun,
});

describe('createPullRequest', () => {
  beforeEach(() => {
    getRepoURL.mockImplementationOnce(() => 'https://github.com/my/repo');
    tempWrite.sync.mockImplementationOnce(() => '/temp/path');
    getDestinationBranchName.mockImplementation(() => 'master');
  });

  it('works in dry mode', () => {
    const ret = createPullRequest(getDefaultParams({ dryRun: true }));
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
    const { pullRequestUrl } = createPullRequest(getDefaultParams());
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
              type: releaseType,
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
      type: 'patch',
    });
    expect(mockFormatPullRequestMessage).toHaveBeenCalled();
    expect(mockFormatPullRequestMessage.mock.calls[0][0]).toMatchObject({
      currentVersion: '1.2.2',
      nextVersion: '1.2.3',
      releaseType: 'patch',
    });
  });
});
