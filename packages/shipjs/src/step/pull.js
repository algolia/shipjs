import { run } from '../util/index.js';

import runStep from './runStep.js';

export default ({ remote, currentBranch, dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({ command: `git pull ${remote} ${currentBranch}`, dir, dryRun });
  });
