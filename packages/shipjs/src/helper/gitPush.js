import { getRepoURLWithToken, getRepoURLWithTokenMasked } from 'shipjs-lib';
import { print, run } from '../util';

export default function gitPush({ remote, refs, dir, dryRun }) {
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
    refs.forEach(ref => {
      run({ command: `git push origin-with-token ${ref}`, dir, dryRun });
    });
  } else {
    refs.forEach(ref => {
      run({
        command: `git push ${remote} ${ref}`,
        dir,
        dryRun,
      });
    });
  }
}
