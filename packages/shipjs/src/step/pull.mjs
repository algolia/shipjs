import runStep from './runStep.mjs';
import { run } from '../util/index.mjs';

export default ({ remote, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({ command: `git pull ${remote} ${currentBranch}`, dir, dryRun });
  });
