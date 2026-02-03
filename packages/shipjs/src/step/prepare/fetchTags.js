import { run } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Fetching tags.' }, () => {
    run({ command: `git fetch --tags`, dir, dryRun });
  });
