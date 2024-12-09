import runStep from '../runStep.mjs';
import { run, print } from '../../util/index.mjs';
import { warning } from '../../color.mjs';

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
