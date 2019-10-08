import runStep from '../runStep';
import path from 'path';

export default ({ version, config, dir, dryRun }) =>
  runStep({ title: 'Updating the changelog.' }, ({ run }) => {
    if (config.updateChangelog !== true) {
      return;
    }
    const { getTagName } = config;
    const tagName = getTagName({ version });

    const args = ['-p angular', '-r 2'].join(' ');
    const execPath = path.resolve(
      require.main.filename,
      '../../node_modules/.bin/conventional-changelog'
    );
    const changelog = run(`${execPath} ${args}`, dir, dryRun);
    const releaseString = `${tagName}

${dryRun ? '#changelog has been omitted because of dryRun#' : changelog}`;

    const releaseCommand = `cat <<EOD | hub release create -F - ${tagName}
${releaseString}
EOD`;

    run(releaseCommand, dir, dryRun);
  });
