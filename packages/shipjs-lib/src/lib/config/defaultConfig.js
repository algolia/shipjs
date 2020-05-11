import shipJsVersion from '../../version';

export default {
  remote: 'origin',
  // monorepo: {
  //   mainVersionFile: 'package.json',
  //   packagesToBump: ['packages/*', 'examples/*'],
  //   packagesToPublish: ['packages/*'],
  // },
  shouldPrepare: undefined, // async ({ commits, nextVersion, releaseType, releaseTag, commitNumbersPerType }) => {},
  updateChangelog: true,
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  installCommand: ({ isYarn }) =>
    isYarn ? 'yarn install --silent' : 'npm install',
  versionUpdated: undefined, // ({ version, releaseType, dir, exec }) => {},
  getNextVersion: undefined, // ({ revisionRange, commitTitles, commitBodies, currentVersion, dir }) => {},
  beforeCommitChanges: undefined, // ({ nextVersion, releaseType, exec, dir }) => {},
  getStagingBranchName: ({ nextVersion, releaseType }) =>
    `releases/v${nextVersion}`,
  formatCommitMessage: ({ version, releaseType, mergeStrategy, baseBranch }) =>
    mergeStrategy.toSameBranch.includes(baseBranch)
      ? `chore: release v${version}`
      : `chore: prepare v${version}`,
  formatPullRequestTitle: ({ version, releaseType }) =>
    `chore: release v${version}`,
  formatPullRequestMessage: ({
    formatPullRequestTitle,
    repoURL,
    baseBranch,
    stagingBranch,
    destinationBranch,
    mergeStrategy,
    currentVersion,
    currentTag,
    nextVersion,
    releaseType,
    publishCommandInStr,
  }) => {
    const pullRequestTitle = formatPullRequestTitle({
      version: nextVersion,
      releaseType,
    });
    const lines = [
      '## Release Summary',
      `- Version change: \`v${currentVersion}\` → \`v${nextVersion}\``,
      `- Merge: \`${stagingBranch}\` → \`${destinationBranch}\``,
      ...(mergeStrategy.toSameBranch.includes(baseBranch)
        ? [
            `- [Compare the changes between the versions](${repoURL}/compare/${currentTag}...${stagingBranch})`,
            `> :warning: When merging this pull request, you need to **_"Squash and merge"_** and make sure the title starts with \`${pullRequestTitle}\`.`,
            `> After that, a commit \`${pullRequestTitle}\` will be added and \`shipjs trigger\` will be able to trigger the release based on the commit.`,
            `> Fore more information, please refer to the mergeStrategy section of the [guide](https://community.algolia.com/shipjs/guide/useful-config.html#mergestrategy).`,
            `> ![Squash and merge](https://raw.githubusercontent.com/algolia/shipjs/v${shipJsVersion}/assets/squash-and-merge.png)`,
          ]
        : [
            `> :warning:️ When merging this pull request, you need to **_"Merge pull request(Create a merge commit)"_** and also, you **must modify** the title to start with \`${pullRequestTitle}\`.`,
            `> After that, a commit \`${pullRequestTitle}\` will be added and \`shipjs trigger\` will be able to trigger the release based on the commit.`,
            `> Fore more information, please refer to the mergeStrategy section of the [guide](https://community.algolia.com/shipjs/guide/useful-config.html#mergestrategy).`,
            `> ![Merge pull request](https://raw.githubusercontent.com/algolia/shipjs/v${shipJsVersion}/assets/merge-pull-request.png)`,
          ]),
      '',
      '---',
      'This is going to be published by the following command:',
      '```',
      publishCommandInStr,
      '```',
      '---',
      '_This pull request is automatically generated by [Ship.js](https://github.com/algolia/shipjs)_',
    ];
    return lines.join('\n');
  },
  pullRequestReviewers: undefined,
  pullRequestTeamReviewers: undefined,
  mergeStrategy: {
    toSameBranch: ['master'],
    // toReleaseBranch: {
    //   master: 'releases/stable',
    //   legacy: 'releases/legacy',
    //   next: 'releases/next',
    // },
  },
  shouldRelease: ({
    commitMessage,
    currentVersion,
    currentBranch,
    mergeStrategy,
    formatPullRequestTitle,
  }) => {
    const correctCommitMessage = formatPullRequestTitle({
      version: currentVersion,
    });
    if (!commitMessage.trim().startsWith(correctCommitMessage)) {
      return (
        'The commit message should have started with the following:' +
        '\n' +
        `${correctCommitMessage}`
      );
    }
    if (
      mergeStrategy.toSameBranch.includes(currentBranch) ||
      Object.values(mergeStrategy.toReleaseBranch).includes(currentBranch)
    ) {
      return true;
    }

    return `The current branch needs to be one of [${[
      ...mergeStrategy.toSameBranch,
      ...Object.values(mergeStrategy.toReleaseBranch),
    ].join(', ')}]`;
  },
  buildCommand: ({ isYarn }) => (isYarn ? 'yarn build' : 'npm run build'),
  beforePublish: undefined, // ({ exec, dir }) => {}
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => defaultCommand,
  afterPublish: undefined, // ({ exec, dir, version, releaseTag }) => {}
  getTagName: ({ version }) => `v${version}`,
  testCommandBeforeRelease: undefined, // ({ isYarn }) => isYarn ? 'yarn test' : 'npm run test',
  appName: undefined,
  forcePushBranches: [],
  slack: {
    default: {
      username: 'Ship.js',
      // eslint-disable-next-line camelcase
      icon_emoji: ':passenger_ship:',
    },
    prepared: ({ appName, version, pullRequestUrl }) => ({
      pretext: `:writing_hand: The release for *${appName}@${version}* is prepared!`,
      fields: [
        {
          title: 'Branch',
          value: 'master',
          short: true,
        },
        {
          title: 'Version',
          value: version,
          short: true,
        },
        {
          title: 'Pull Request',
          value: pullRequestUrl,
          short: false,
        },
      ],
    }),
    releaseSuccess: ({
      appName,
      version,
      tagName,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
    }) => ({
      pretext: `:tada: Successfully released *${appName}@${version}*`,
      fields: [
        {
          title: 'Branch',
          value: 'master',
          short: true,
        },
        {
          title: 'Commit',
          value: `*<${latestCommitUrl}|${latestCommitHash}>*`,
          short: true,
        },
        {
          title: 'Version',
          value: version,
          short: true,
        },
        {
          title: 'Release',
          value: `${repoURL}/releases/tag/${tagName}`,
        },
      ],
    }),
  },
  releases: {
    assetsToUpload: [],
    extractChangelog: undefined, // ({ version, dir }) => `some specific changelog to that version`,
  },
};
