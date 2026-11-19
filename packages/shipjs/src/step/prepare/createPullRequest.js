import { Octokit } from '@octokit/rest';
import open from 'open';
import { expandPackageList, getRepoInfo, getReleaseTag } from 'shipjs-lib';

import {
  getPublishCommand,
  getPackageDirName,
  getTagForDir,
  resolvePublishTags,
} from '../../helper/index.js';
import { print, run, detectYarn } from '../../util/index.js';
import runStep from '../runStep.js';

export default async ({
  baseBranch,
  stagingBranch,
  currentVersion,
  currentTag,
  nextVersion,
  releaseType,
  prerelease = null,
  packages = null,
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
    const tags = resolvePublishTags({
      config,
      version: nextVersion,
      releaseTag: getReleaseTag(nextVersion),
      prerelease,
      branch: baseBranch,
    });
    const publishCommands = getPublishCommands({
      isYarn: detectYarn(dir),
      tags,
      prerelease,
      monorepo,
      publishCommand,
      dir,
    });

    const title = formatPullRequestTitle({
      version: nextVersion,
      releaseType,
      prerelease,
      packages,
    });
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
      prerelease,
      packages,
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

// The same commands `shipjs trigger` will run (see `runPublish`): each package
// gets the tag matching the version it now has on disk.
function getPublishCommands({
  isYarn,
  tags,
  prerelease,
  monorepo,
  publishCommand,
  dir,
}) {
  if (monorepo) {
    const { packagesToPublish } = monorepo;
    const packageList = expandPackageList(packagesToPublish, dir);
    return packageList.map((packageDir) => {
      const dirName = getPackageDirName(packageDir, dir);
      const command = getPublishCommand({
        isYarn,
        publishCommand,
        tag: getTagForDir(packageDir, tags),
        prereleaseTag: tags.prereleaseTag,
        prerelease,
        dir: packageDir,
      });
      return {
        dirName,
        command,
      };
    });
  }
  return getPublishCommand({
    isYarn,
    publishCommand,
    tag: getTagForDir(dir, tags),
    prereleaseTag: tags.prereleaseTag,
    prerelease,
    dir,
  });
}
