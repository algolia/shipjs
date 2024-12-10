import runStep from '../runStep.js';
import { run } from '../../util/index.js';

export default ({ stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Checking out to the staging branch.' }, () => {
    run({ command: `git checkout -b ${stagingBranch}`, dir, dryRun });
  });
