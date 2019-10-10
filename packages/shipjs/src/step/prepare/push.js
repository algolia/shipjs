import { getRepoURLWithToken } from 'shipjs-lib';
import runStep from '../runStep';

export default ({ config, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Pushing to remote.' }, ({ run }) => {
    const { remote } = config;

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const url = getRepoURLWithToken(token, remote, dir);
      run({ command: `git remote add origin-with-token ${url}`, dir, dryRun });
      run({
        command: `git push origin-with-token ${currentBranch}`,
        dir,
        dryRun,
      });
    } else {
      run({ command: `git push ${remote} ${currentBranch}`, dir, dryRun });
    }
  });
