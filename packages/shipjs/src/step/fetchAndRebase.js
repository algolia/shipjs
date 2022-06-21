import runStep from './runStep';
import { run } from '../util';

export default ({ remote, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Rebasing.' }, () => {
    run({
      command: `git fetch && git rebase ${remote}/${currentBranch} ${currentBranch}`,
      dir,
      dryRun,
    });
  });
