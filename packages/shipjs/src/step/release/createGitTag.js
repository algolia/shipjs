import { getCurrentVersion } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import runStep from '../runStep';

export default ({ config, dir, dryRun }) =>
  runStep({ title: 'Creating a git tag.' }, ({ run }) => {
    const { getTagName } = config;
    const currentVersion = getCurrentVersion(dir);
    const tagName = getTagName({ currentVersion });
    const command = `git tag ${tagName}`;
    run(command, dir, dryRun);
    return { tagName };
  });
