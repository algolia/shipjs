import runStep from '../runStep.mjs';
import { run } from '../../util/index.mjs';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Fetching tags.' }, () => {
    run({ command: `git fetch --tags`, dir, dryRun });
  });
