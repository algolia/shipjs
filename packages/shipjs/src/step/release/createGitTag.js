import runStep from '../runStep';
import { run } from '../../util';

export default ({ version, config, dir, dryRun }) =>
  runStep({ title: 'Creating a git tag.' }, () => {
    const { getTagName } = config;
    const tagName = getTagName({ version });
    const command = `git tag ${tagName}`;
    run({ command, dir, dryRun });
    return { tagName };
  });
