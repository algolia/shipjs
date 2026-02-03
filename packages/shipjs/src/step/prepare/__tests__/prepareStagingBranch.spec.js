import { hasLocalBranch, hasRemoteBranch } from 'shipjs-lib';
import { print, exitProcess } from '../../../util/index.js';
import prepareStagingBranch from '../prepareStagingBranch.js';
import { mockPrint } from '../../../../tests/util/index.js';

describe('prepareStagingBranch', () => {
  it('returns staging branch', () => {
    hasLocalBranch.mockImplementationOnce(() => false);
    hasRemoteBranch.mockImplementationOnce(() => false);
    const { stagingBranch } = prepareStagingBranch({
      config: {
        getStagingBranchName: () => `releases/v0.1.2`,
      },
      dir: '.',
    });
    expect(stagingBranch).toEqual(`releases/v0.1.2`);
    expect(exitProcess).toHaveBeenCalledTimes(0);
  });

  it('fails when local branch already exists', () => {
    const output = [];
    mockPrint(print, output);
    hasLocalBranch.mockImplementationOnce(() => true);
    hasRemoteBranch.mockImplementationOnce(() => false);
    prepareStagingBranch({
      config: {
        getStagingBranchName: () => `releases/v0.1.2`,
      },
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output).toMatchInlineSnapshot(`
      [
        "› Preparing a staging branch",
        "The branch "releases/v0.1.2" already exists locally.",
        "Delete the local branch and try again. For example,",
        "  $ git branch -d releases/v0.1.2",
      ]
    `);
  });

  it('fails when remote branch already exists', () => {
    const output = [];
    mockPrint(print, output);
    hasLocalBranch.mockImplementationOnce(() => false);
    hasRemoteBranch.mockImplementationOnce(() => true);
    prepareStagingBranch({
      config: {
        remote: 'origin',
        getStagingBranchName: () => `releases/v0.1.2`,
      },
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output).toMatchInlineSnapshot(`
      [
        "› Preparing a staging branch",
        "The branch "releases/v0.1.2" already exists remotely.",
        "Delete the remote branch and try again. For example,",
        "  $ git push origin :releases/v0.1.2",
      ]
    `);
  });
});
