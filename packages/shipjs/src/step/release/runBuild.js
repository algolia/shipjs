import runStep from '../runStep';
import { run, print } from '../../util';
import { warning } from '../../color';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Building.' }, () => {
    const { buildCommand } = config;
    const command = buildCommand && buildCommand({ isYarn });
    if (!command) {
      print(warning('Skipping build because it is not configured.'));
      return;
    }
    run({ command, dir, dryRun });
  });
