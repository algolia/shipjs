import runStep from '../runStep';
import { run, print } from '../../util';
import { warning } from '../../color';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Running test.' }, () => {
    const { testCommandBeforeRelease } = config;
    const command =
      testCommandBeforeRelease && testCommandBeforeRelease({ isYarn });
    if (!command) {
      print(warning('Skipping test because it is not configured.'));
      return;
    }
    run({ command, dir, dryRun });
  });
