import runStep from '../runStep.js';
import { run, print } from '../../util/index.js';
import { warning } from '../../color.js';

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
