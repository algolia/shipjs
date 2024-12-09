import runStep from '../runStep.mjs';
import { run, print } from '../../util/index.mjs';
import { warning } from '../../color.mjs';

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
