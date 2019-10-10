import runStep from '../runStep';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Running test.' }, ({ run }) => {
    const { testCommandBeforeRelease } = config;
    run({ command: testCommandBeforeRelease({ isYarn }), dir, dryRun });
  });
