import runStep from '../runStep';

export default ({ isYarn, config, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, ({ run }) => {
    const { publishCommand } = config;
    const defaultCommand = isYarn
      ? 'yarn publish --no-git-tag-version --non-interactive'
      : 'npm publish';
    run(publishCommand({ isYarn, defaultCommand }), dir, dryRun);
  });
