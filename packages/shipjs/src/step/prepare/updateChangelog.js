import runStep from '../runStep';
import path from 'path';

export default ({ config, firstRelease, releaseCount, dir, dryRun }) =>
  runStep({ title: 'Updating the changelog.' }, ({ run }) => {
    if (config.updateChangelog !== true) {
      return;
    }
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
    run(`${execPath} ${args}`, dir, dryRun);
  });
