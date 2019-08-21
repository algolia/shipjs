import runStep from '../runStep';

export default ({ isYarn, config, releaseTag: tag, dir, dryRun }) =>
  runStep({ title: 'Publishing.' }, ({ run }) => {
    const { publishCommand } = config;
    const defaultCommand = isYarn
      ? `yarn publish --no-git-tag-version --non-interactive --tag ${tag}`
      : `npm publish --tag ${tag}`;
    run(publishCommand({ isYarn, tag, defaultCommand }), dir, dryRun);
  });
