import { run, detectYarn } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ config, dir, dryRun }) =>
  runStep({ title: 'Installing the dependencies.' }, () => {
    const isYarn = detectYarn(dir);
    const command = config.installCommand({ isYarn });
    run({ command, dir, dryRun });
  });
