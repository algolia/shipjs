import { hasLocalBranch, hasRemoteBranch } from 'shipjs-lib';
import { print, exitProcess } from '../../../util';
import { error } from '../../../color';
import prepareStagingBranch from '../prepareStagingBranch';
jest.mock('shipjs-lib');
jest.mock('../../../util');
jest.mock('../../../color');

describe('prepareStagingBranch', () => {
  beforeEach(() => {
    error.mockImplementation(str => str);
  });

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
    hasLocalBranch.mockImplementationOnce(() => true);
    hasRemoteBranch.mockImplementationOnce(() => false);
    print.mockImplementation((...args) => output.push(args.join(' ')));
    prepareStagingBranch({
      config: {
        getStagingBranchName: () => `releases/v0.1.2`,
      },
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "The branch \\"releases/v0.1.2\\" already exists locally.",
        "Delete the local branch and try again. For example,",
        "  $ git branch -d releases/v0.1.2",
      ]
    `);
  });

  it('fails when remote branch already exists', () => {
    const output = [];
    hasLocalBranch.mockImplementationOnce(() => false);
    hasRemoteBranch.mockImplementationOnce(() => true);
    print.mockImplementation((...args) => output.push(args.join(' ')));
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
      Array [
        "The branch \\"releases/v0.1.2\\" already exists remotely.",
        "Delete the remote branch and try again. For example,",
        "  $ git push origin :releases/v0.1.2",
      ]
    `);
  });
});
