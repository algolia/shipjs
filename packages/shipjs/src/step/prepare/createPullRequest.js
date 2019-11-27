import { hasRemoteBranch, getRepoInfo } from 'shipjs-lib';
import open from 'open';
import Octokit from '@octokit/rest';
import runStep from '../runStep';
import { getDestinationBranchName } from '../../helper';
import { print, run, exitProcess } from '../../util';
import { warning } from '../../color';

export default async ({
  baseBranch,
  stagingBranch,
  currentVersion,
  nextVersion,
  releaseType,
  noBrowse,
  config,
  dir,
  dryRun,
}) =>
  await runStep({ title: 'Creating a pull request.' }, async () => {
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
    const { url: repoURL, owner, name: repo } = getRepoInfo(remote, dir);
    const title = formatPullRequestTitle({ version: nextVersion, releaseType });
    const message = formatPullRequestMessage({
      formatPullRequestTitle,
      repoURL,
      baseBranch,
      stagingBranch,
      destinationBranch,
      mergeStrategy,
      currentVersion,
      nextVersion,
      releaseType,
    });
    run({ command: `git remote prune ${remote}`, dir, dryRun });

    if (dryRun) {
      print('Creates a pull request with the following:');
      print(`  - Title: ${title}`);
      print(`  - Message: ${message}`);
      return {};
    }

    const reviewers = Array.isArray(pullRequestReviewer)
      ? pullRequestReviewer
      : (pullRequestReviewer || '').split(',');
    const octokit = new Octokit({
      auth: `token ${process.env.GITHUB_TOKEN}`,
    });
    const {
      data: { number, html_url: url },
    } = await octokit.pulls.create({
      owner,
      repo,
      title,
      body: message,
      head: stagingBranch,
      base: destinationBranch,
    });

    if (reviewers.length > 0) {
      await octokit.pulls.createReviewRequest({
        owner,
        repo,
        pull_number: number, // eslint-disable-line camelcase
        reviewers,
      });
    }

    if (!noBrowse) {
      await open(url);
    }

    return { pullRequestUrl: url };
  });
