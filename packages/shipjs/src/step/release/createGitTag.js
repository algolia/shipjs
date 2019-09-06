import runStep from '../runStep';

export default ({ version, config, dir, dryRun }) =>
  runStep({ title: 'Creating a git tag.' }, ({ run }) => {
    const { getTagName } = config;
    const tagName = getTagName({ version });
    const command = `git tag ${tagName}`;
    run(command, dir, dryRun);
    return { tagName };
  });
