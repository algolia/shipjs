import { getCurrentBranch } from 'shipjs-lib';
import {
  gitPush as gitPushInternal,
  getBranchNameToMergeBack,
} from '../../../helper';
import gitPush from '../gitPush';
import { run } from '../../../util';

describe('gitPush', () => {
  it('works in toSameBranch strategy', () => {
    getCurrentBranch.mockImplementationOnce(() => 'master');
    getBranchNameToMergeBack.mockImplementationOnce(() => 'master');
    gitPush({
      tagName: 'v1.2.3',
      config: {
        remote: 'origin',
      },
      dir: '.',
      dryRun: false,
    });
    expect(gitPushInternal).toHaveBeenCalledTimes(1);
    expect(gitPushInternal).toHaveBeenCalledWith({
      remote: 'origin',
      refs: ['master', 'v1.2.3'],
      dir: '.',
      dryRun: false,
    });
  });

  it('works in toReleaseBranch strategy', () => {
    getCurrentBranch.mockImplementationOnce(() => 'develop');
    getBranchNameToMergeBack.mockImplementationOnce(() => 'master');
    gitPush({
      tagName: 'v1.2.3',
      config: {
        remote: 'origin',
      },
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(2);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git checkout master",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(run.mock.calls[1][0]).toMatchInlineSnapshot(`
      Object {
        "command": "git merge develop",
        "dir": ".",
        "dryRun": false,
      }
    `);
    expect(gitPushInternal).toHaveBeenCalledTimes(1);
    expect(gitPushInternal).toHaveBeenCalledWith({
      remote: 'origin',
      refs: ['develop', 'v1.2.3'],
      dir: '.',
      dryRun: false,
    });
  });
});
