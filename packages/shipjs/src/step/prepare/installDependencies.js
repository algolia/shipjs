import runStep from '../runStep';
import detectYarn from '../../util/detectYarn';

export default ({ config, dir, dryRun }) =>
  runStep({ title: 'Installing the dependencies.' }, ({ run }) => {
    const isYarn = detectYarn(dir);
    const command = config.installCommand({ isYarn });
    run({ command, dir, dryRun });
  });
