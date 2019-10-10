import {
  getCurrentBranch,
  getRepoURLWithToken,
  getRepoURLWithTokenMasked,
} from 'shipjs-lib';
import runStep from '../runStep';
import getBranchNameToMergeBack from '../../helper/getBranchNameToMergeBack';

function push({ remote, tagName, run, print, dir, dryRun }) {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const url = getRepoURLWithToken(token, remote, dir);
    const maskedUrl = getRepoURLWithTokenMasked(remote, dir);
    print(`    $ git remote add origin-with-token ${maskedUrl}`);
    run({
      command: `git remote add origin-with-token ${url}`,
      dir,
      dryRun,
      printCommand: false,
    });
    run({ command: `git push origin-with-token`, dir, dryRun });
    run({ command: `git push origin-with-token ${tagName}`, dir, dryRun });
  } else {
    run({
      command: `git push`,
      dir,
      dryRun,
    });
    run({
      command: `git push ${remote} ${tagName}`,
      dir,
      dryRun,
    });
  }
}

export default ({ tagName, config, dir, dryRun }) =>
  runStep({ title: 'Pushing to the remote.' }, ({ run, print }) => {
    const currentBranch = getCurrentBranch(dir);
    const { mergeStrategy, remote } = config;
    const destinationBranch = getBranchNameToMergeBack({
      currentBranch,
      mergeStrategy,
    });
    if (currentBranch === destinationBranch) {
      push({ remote, tagName, run, print, dir, dryRun });
    } else {
      // currentBranch: 'master'
      // destinationBranch: 'develop'
      // flow: develop -> master -> (here) develop
      run({ command: `git checkout ${destinationBranch}`, dir, dryRun });
      run({ command: `git merge ${currentBranch}`, dir, dryRun });
      push({ remote, tagName, run, print, dir, dryRun });
    }
  });
