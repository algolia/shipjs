import {
  getRepoURLWithToken,
  getRepoURLWithTokenMasked,
  hasRemote,
} from 'shipjs-lib';
import { print, run } from '../util';

export default function gitPush({
  remote,
  refs,
  forcePushBranches = [],
  dir,
  dryRun,
}) {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    if (!hasRemote('origin-with-token', dir)) {
      const url = getRepoURLWithToken(token, remote, dir);
      const maskedUrl = getRepoURLWithTokenMasked(remote, dir);
      print(`    $ git remote add origin-with-token ${maskedUrl}`);
      run({
        command: `git remote add origin-with-token ${url}`,
        dir,
        dryRun,
        printCommand: false,
      });
    }
    refs.forEach((ref) => {
      const force = forcePushBranches.includes(ref);
      run({
        command: `git push${force ? ' -f' : ''} origin-with-token ${ref}`,
        dir,
        dryRun,
      });
    });
    run({
      command: `git remote remove origin-with-token`,
      dir,
      dryRun,
      printCommand: false,
    });
  } else {
    refs.forEach((ref) => {
      const force = forcePushBranches.includes(ref);
      run({
        command: `git push${force ? ' -f' : ''} ${remote} ${ref}`,
        dir,
        dryRun,
      });
    });
  }
}
