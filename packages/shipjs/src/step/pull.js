import runStep from './runStep';
import { run } from '../util';

export default ({ remote, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({ command: `git pull ${remote} ${currentBranch}`, dir, dryRun });
  });
