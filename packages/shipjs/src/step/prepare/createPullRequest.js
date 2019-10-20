import { hasRemoteBranch, getRepoURL, silentExec } from 'shipjs-lib';
import tempWrite from 'temp-write';
import runStep from '../runStep';
import { getDestinationBranchName } from '../../helper';
import { print, run, exitProcess } from '../../util';
import { warning } from '../../color';

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
  runStep({ title: 'Creating a pull request.' }, () => {
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
      print(warning('Create that branch pointing to a latest stable commit.'));
      print(warning('After that, try again.'));
      print('');
      print(warning('Rolling back for now...'));
      run({ command: `git checkout ${baseBranch}`, dir, dryRun });
      run({ command: `git branch -D ${stagingBranch}`, dir, dryRun });
      exitProcess(0);
    }
    const repoURL = getRepoURL(remote, dir);
    const message = formatPullRequestMessage({
      formatPullRequestTitle,
      repoURL,
      baseBranch,
      stagingBranch,
      destinationBranch,
      mergeStrategy,
      currentVersion,
      nextVersion,
    });
    const filePath = tempWrite.sync(message);
    run({ command: `git remote prune ${remote}`, dir, dryRun });
    const reviewer = Array.isArray(pullRequestReviewer)
      ? pullRequestReviewer.join(',')
      : pullRequestReviewer;
    const createPullRequestCommand = [
      'hub pull-request',
      `--base ${destinationBranch}`,
      noBrowse ? undefined : '--browse',
      '--push',
      pullRequestReviewer ? `--reviewer ${reviewer}` : undefined,
      `--file ${filePath}`,
    ]
      .filter(Boolean)
      .join(' ');
    run({ command: createPullRequestCommand, dir, dryRun });
    print('  |');
    message.split('\n').forEach(line => print(`  |  ${line}`));
    print('  |');
    print('');

    if (dryRun) {
      return {};
    }
    const pullRequestTitle = message.split('\n')[0].trim();
    const pr = silentExec(`hub pr list --format="%I %t%n"`, { dir })
      .toString()
      .trim()
      .split('\n')
      .find(
        title =>
          pullRequestTitle ===
          title
            .trim()
            .split(' ')
            .slice(1)
            .join(' ')
      );
    const prNumber = pr.split(' ')[0];
    const pullRequestUrl = `${repoURL}/pull/${prNumber}`;
    return { pullRequestUrl };
  });
