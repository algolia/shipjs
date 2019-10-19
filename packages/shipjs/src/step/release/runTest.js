import runStep from '../runStep';
import { run } from '../../util';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Running test.' }, () => {
    const { testCommandBeforeRelease } = config;
    run({ command: testCommandBeforeRelease({ isYarn }), dir, dryRun });
  });
