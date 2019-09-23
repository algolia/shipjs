import { hasRemoteBranch, getRepoURL } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import tempWrite from 'temp-write';
import runStep from '../runStep';
import getDestinationBranchName from '../../helper/getDestinationBranchName';

export default ({
  baseBranch,
  stagingBranch,
  currentVersion,
  nextVersion,
  noBrowse,
  config,
  dir,
  dryRun,
}) =>
  runStep(
    { title: 'Creating a pull request.' },
    ({ print, warning, run, exitProcess }) => {
      const {
        mergeStrategy,
        formatPullRequestTitle,
        formatPullRequestMessage,
        pullRequestReviewer,
        remote,
      } = config;
      const destinationBranch = getDestinationBranchName({
        baseBranch,
        mergeStrategy,
      });
      if (
        baseBranch !== destinationBranch &&
        !hasRemoteBranch(remote, destinationBranch, dir)
      ) {
        print(warning('You want to release using a dedicated release branch.'));
        print(
          warning(
            `The name of the branch is \`${destinationBranch}\`, but you don't have it yet.`
          )
        );
        print(
          warning('Create that branch pointing to a latest stable commit.')
        );
        print(warning('After that, try again.'));
        print('');
        print(warning('Rolling back for now...'));
        run(`git checkout ${baseBranch}`, dir, dryRun);
        run(`git branch -D ${stagingBranch}`, dir, dryRun);
        exitProcess(0);
      }
      const repoURL = getRepoURL(remote, dir);
      const message = [
        formatPullRequestTitle({ version: nextVersion }),
        '',
        formatPullRequestMessage({
          repoURL,
          baseBranch,
          stagingBranch,
          destinationBranch,
          mergeStrategy,
          currentVersion,
          nextVersion,
        }),
      ].join('\n');
      const filePath = tempWrite.sync(message);
      run(`git remote prune ${remote}`, dir, dryRun);
      const createPullRequestCommand = [
        'hub pull-request',
        `--base ${destinationBranch}`,
        noBrowse ? undefined : '--browse',
        '--push',
        pullRequestReviewer ? `--reviewer ${pullRequestReviewer}` : undefined,
        `--file ${filePath}`,
      ]
        .filter(Boolean)
        .join(' ');
      run(createPullRequestCommand, dir, dryRun);
      const pullRequestUrl = `${repoURL}/pulls`;
      print('  |');
      message.split('\n').forEach(line => print(`  |  ${line}`));
      print('  |');
      print('');

      return { pullRequestUrl };
    }
  );
