import runStep from '../runStep.js';
import { run } from '../../util/index.js';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Fetching tags.' }, () => {
    run({ command: `git fetch --tags`, dir, dryRun });
  });
