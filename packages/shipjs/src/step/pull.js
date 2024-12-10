import runStep from './runStep.js';
import { run } from '../util/index.js';

export default ({ remote, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({ command: `git pull ${remote} ${currentBranch}`, dir, dryRun });
  });
