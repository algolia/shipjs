import chalk from 'chalk';
import runStep from '../runStep';
import { print } from '../../util';

export default ({ baseBranch, stagingBranch, pullRequestUrl, dryRun }) =>
  runStep({ title: 'All Finished.' }, () => {
    if (dryRun) return;

    print(`
You are currently on ${chalk.green.bold(stagingBranch)} branch.
You can make changes to the release materials including CHANGELOG.md, and continue to prepare the next release.

${pullRequestUrl}

Otherwise, you can safely check out another branch and get back to your development iteration.
To check out the previous branch, run the following:

$ git checkout ${baseBranch}`);
  });
