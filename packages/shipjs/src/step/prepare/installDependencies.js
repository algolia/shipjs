import runStep from '../runStep.js';
import { run, detectYarn } from '../../util/index.js';

export default ({ config, dir, dryRun }) =>
  runStep({ title: 'Installing the dependencies.' }, () => {
    const isYarn = detectYarn(dir);
    const command = config.installCommand({ isYarn });
    run({ command, dir, dryRun });
  });
