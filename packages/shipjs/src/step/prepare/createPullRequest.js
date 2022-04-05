import { expandPackageList, getRepoInfo, getReleaseTag } from 'shipjs-lib';
import open from 'open';
import { Octokit } from '@octokit/rest';
import runStep from '../runStep';
import { getPublishCommand, getPackageDirName } from '../../helper';
import { print, run, detectYarn } from '../../util';

export default async ({
  baseBranch,
  stagingBranch,
  currentVersion,
  currentTag,
  nextVersion,
  releaseType,
  noBrowse,
  config,
  dir,
  dryRun,
}) =>
  await runStep({ title: 'Creating a pull request.' }, async () => {
    const {
      formatPullRequestTitle,
      formatPullRequestMessage,
      publishCommand,
      draftPullRequest,
      pullRequestReviewers,
      pullRequestTeamReviewers,
      remote,
      monorepo,
    } = config;
    const { url: repoURL, owner, name: repo } = getRepoInfo(remote, dir);

    const diffURL = `${repoURL}/compare/${currentTag}...${stagingBranch}`;
    const publishCommands = getPublishCommands({
      isYarn: detectYarn(dir),
      tag: getReleaseTag(nextVersion),
      monorepo,
      publishCommand,
      dir,
    });

    const title = formatPullRequestTitle({ version: nextVersion, releaseType });
    const message = formatPullRequestMessage({
      repo,
      repoURL,
      baseBranch,
      stagingBranch,
      destinationBranch: baseBranch,
      releaseType,
      diffURL,
      currentVersion,
      nextVersion,
      publishCommands,
      title,
    });
    run({ command: `git remote prune ${remote}`, dir, dryRun });

    if (dryRun) {
      print('Creating a pull request with the following:');
      print(`  - Title: ${title}`);
      print(`  - Message: ${message}`);
      return {};
    }

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
      base: baseBranch,
      draft: draftPullRequest,
    });

    if (
      (pullRequestReviewers || []).length > 0 ||
      (pullRequestTeamReviewers || []).length > 0
    ) {
      await octokit.pulls.requestReviewers({
        owner,
        repo,
        pull_number: number, // eslint-disable-line camelcase
        reviewers: pullRequestReviewers,
        team_reviewers: pullRequestTeamReviewers, // eslint-disable-line camelcase
      });
    }

    if (!noBrowse) {
      await open(url);
    }

    return { pullRequestUrl: url };
  });

function getPublishCommands({ isYarn, tag, monorepo, publishCommand, dir }) {
  if (monorepo) {
    const { packagesToPublish } = monorepo;
    const packageList = expandPackageList(packagesToPublish, dir);
    return packageList.map((packageDir) => {
      const dirName = getPackageDirName(packageDir, dir);
      const command = getPublishCommand({
        isYarn,
        publishCommand,
        tag,
        dir: packageDir,
      });
      return {
        dirName,
        command,
      };
    });
  } else {
    return getPublishCommand({ isYarn, publishCommand, tag, dir });
  }
}
