import { arrayify, run } from '../../util/index.js';
import runStep from '../runStep.js';

export default ({ version, config, dir, dryRun }) =>
  runStep({ title: 'Creating a git tag.' }, () => {
    const { getTagName } = config;
    const tagNames = arrayify(getTagName({ version }));
    const command = tagNames
      .map((tag) => `git tag -a ${tag} -m ${tag}`)
      .join(' && ');
    run({ command, dir, dryRun });
    return { tagNames };
  });
