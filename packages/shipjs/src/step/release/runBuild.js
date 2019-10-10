import runStep from '../runStep';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Building.' }, ({ run }) => {
    const { buildCommand } = config;
    run({ command: buildCommand({ isYarn }), dir, dryRun });
  });
