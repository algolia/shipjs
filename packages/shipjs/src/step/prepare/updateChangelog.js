import runStep from '../runStep';
import path from 'path';
import { run } from '../../util';

export default ({ config, firstRelease, releaseCount, dir, dryRun }) =>
  runStep(
    {
      title: 'Updating the changelog.',
      skipIf: () => config.updateChangelog !== true,
    },
    () => {
      const { conventionalChangelogArgs } = config;
      const args = [
        conventionalChangelogArgs,
        releaseCount ? `-r ${releaseCount}` : undefined,
        firstRelease ? '-r 0' : undefined,
      ]
        .filter(Boolean)
        .join(' ');
      const execPath = path.resolve(
        require.main.filename,
        '../../node_modules/.bin/conventional-changelog'
      );
      run({ command: `${execPath} ${args}`, dir, dryRun });
    }
  );
