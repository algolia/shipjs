import { getCurrentBranch } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';
import getBranchNameToMergeBack from '../../helper/getBranchNameToMergeBack';

export default ({ tagName, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, ({ run }) => {
    const currentBranch = getCurrentBranch(dir);
    const { mergeStrategy, remote } = config;
    const destinationBranch = getBranchNameToMergeBack({
      currentBranch,
      mergeStrategy,
    });
    const pushCommand = `git push && git push ${remote} ${tagName}`;
    if (currentBranch === destinationBranch) {
      run(pushCommand, dir, dryRun);
    } else {
      // currentBranch: 'release/legacy'
      // destinationBranch: 'legacy'
      // flow: legacy -> release/legacy -> (here) legacy
      run(`git checkout ${destinationBranch}`, dir, dryRun);
      run(`git merge ${currentBranch}`, dir, dryRun);
      run(pushCommand, dir, dryRun);
    }
  });
