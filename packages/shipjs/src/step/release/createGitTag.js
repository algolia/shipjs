import runStep from '../runStep';
import { arrayify, run } from '../../util';

export default ({ version, config, dir, dryRun }) =>
  runStep({ title: 'Creating a git tag.' }, () => {
    const { getTagName } = config;
    const tagNames = arrayify(getTagName({ version }));
    const command = tagNames.map((tag) => `git tag ${tag}`).join(' && ');
    run({ command, dir, dryRun });
    return { tagNames };
  });
