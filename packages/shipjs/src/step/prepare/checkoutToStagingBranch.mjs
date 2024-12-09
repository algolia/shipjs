import runStep from '../runStep.mjs';
import { run } from '../../util/index.mjs';

export default ({ stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Checking out to the staging branch.' }, () => {
    run({ command: `git checkout -b ${stagingBranch}`, dir, dryRun });
  });
