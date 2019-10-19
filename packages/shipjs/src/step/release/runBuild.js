import runStep from '../runStep';
import { run } from '../../util';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Building.' }, () => {
    const { buildCommand } = config;
    run({ command: buildCommand({ isYarn }), dir, dryRun });
  });
