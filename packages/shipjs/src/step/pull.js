import runStep from './runStep';
import { run } from '../util';

export default ({ dir, dryRun }) =>
  runStep({ title: 'Updating from remote.' }, () => {
    run({ command: 'git pull', dir, dryRun });
  });
