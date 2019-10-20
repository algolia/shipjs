import runStep from '../runStep';
import { run } from '../../util';

export default ({ stagingBranch, dir, dryRun }) =>
  runStep({ title: 'Checking out to the staging branch.' }, () => {
    run({ command: `git checkout -b ${stagingBranch}`, dir, dryRun });
  });
