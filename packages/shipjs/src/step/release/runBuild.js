import { warning } from '../../color.js';
import { run, print } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ isYarn, config, version, dir, dryRun }) =>
  runStep({ title: 'Building.' }, () => {
    const { buildCommand } = config;
    const command = buildCommand && buildCommand({ version, isYarn });
    if (!command) {
      print(warning('Skipping build because it is not configured.'));
      return;
    }
    run({ command, dir, dryRun });
  });
