import { getCurrentBranch, getRepoURLWithToken } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';
import getBranchNameToMergeBack from '../../helper/getBranchNameToMergeBack';

function getPushCommands({ remote, tagName, dir }) {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const url = getRepoURLWithToken(token, remote, dir);
    return [
      `git remote add origin-with-token ${url}`,
      `git push origin-with-token`,
      `git push origin-with-token ${tagName}`,
    ];
  } else {
    return [`git push && git push ${remote} ${tagName}`];
  }
}

export default ({ tagName, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, ({ run }) => {
    const currentBranch = getCurrentBranch(dir);
    const { mergeStrategy, remote } = config;
    const destinationBranch = getBranchNameToMergeBack({
      currentBranch,
      mergeStrategy,
    });
    const pushCommands = getPushCommands({ remote, tagName, dir });
    if (currentBranch === destinationBranch) {
      pushCommands.forEach(command => run(command, dir, dryRun));
    } else {
      // currentBranch: 'master'
      // destinationBranch: 'develop'
      // flow: develop -> master -> (here) develop
      run(`git checkout ${destinationBranch}`, dir, dryRun);
      run(`git merge ${currentBranch}`, dir, dryRun);
      pushCommands.forEach(command => run(command, dir, dryRun));
    }
  });
