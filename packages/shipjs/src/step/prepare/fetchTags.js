import runStep from '../runStep';
import { run } from '../../util';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Fetching tags.' }, () => {
    run({ command: `git fetch --tags`, dir, dryRun });
  });
