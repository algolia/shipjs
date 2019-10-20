import { getCurrentBranch } from 'shipjs-lib';
import runStep from '../runStep';
import { gitPush, getBranchNameToMergeBack } from '../../helper';
import { run } from '../../util';

export default ({ tagName, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, () => {
    const currentBranch = getCurrentBranch(dir);
    const { mergeStrategy, remote } = config;
    const destinationBranch = getBranchNameToMergeBack({
      currentBranch,
      mergeStrategy,
    });
    if (currentBranch === destinationBranch) {
      gitPush({ remote, refs: [currentBranch, tagName], dir, dryRun });
    } else {
      // currentBranch: 'master'
      // destinationBranch: 'develop'
      // flow: develop -> master -> (here) develop
      run({ command: `git checkout ${destinationBranch}`, dir, dryRun });
      run({ command: `git merge ${currentBranch}`, dir, dryRun });
      gitPush({ remote, refs: [currentBranch, tagName], dir, dryRun });
    }
  });
