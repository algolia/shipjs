import runStep from '../runStep';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Building.' }, ({ run }) => {
    const { buildCommand } = config;
    run(buildCommand({ isYarn }), dir, dryRun);
  });
