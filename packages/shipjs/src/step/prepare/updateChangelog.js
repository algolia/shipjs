import tempWrite from 'temp-write';
import runStep from '../runStep';
import path from 'path';
import { run } from '../../util';

export default ({
  config,
  firstRelease,
  releaseCount,
  commitRange,
  dir,
  dryRun,
}) =>
  runStep(
    {
      title: 'Updating the changelog.',
      skipIf: () => config.updateChangelog !== true,
    },
    () => {
      const { conventionalChangelogArgs } = config;
      const [from, to] = commitRange.split('..');
      const tempConfigPath = tempWrite.sync(
        `module.exports = { gitRawCommitsOpts: { from: '${from}', to: '${to}' } }`
      );
      const args = [
        conventionalChangelogArgs,
        releaseCount ? `-r ${releaseCount}` : undefined,
        firstRelease ? '-r 0' : undefined,
        `-n ${tempConfigPath}`,
      ]
        .filter(Boolean)
        .join(' ');
      const execPath = path.resolve(
        require.main.filename,
        '../../../../node_modules/.bin/conventional-changelog'
      );
      run({ command: `${execPath} ${args}`, dir, dryRun });
    }
  );
