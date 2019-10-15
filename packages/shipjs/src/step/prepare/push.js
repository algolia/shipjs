import { getRepoURLWithToken, getRepoURLWithTokenMasked } from 'shipjs-lib';
import runStep from '../runStep';
import { run, print } from '../../util';

export default ({ config, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, () => {
    const { remote } = config;

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const url = getRepoURLWithToken(token, remote, dir);
      const maskedUrl = getRepoURLWithTokenMasked(remote, dir);
      print(`  $ git remote add origin-with-token ${maskedUrl}`);
      run({
        command: `git remote add origin-with-token ${url}`,
        dir,
        dryRun,
        printCommand: false,
      });
      run({
        command: `git push origin-with-token ${currentBranch}`,
        dir,
        dryRun,
      });
    } else {
      run({ command: `git push ${remote} ${currentBranch}`, dir, dryRun });
    }
  });
