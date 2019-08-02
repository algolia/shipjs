export default {
  remote: 'origin',
  packageJsons: ['package.json'],
  updateChangelog: true,
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  installCommand: ({ isYarn }) => (isYarn ? 'yarn install' : 'npm install'),
  versionUpdated: ({ version, exec }) => {},
  beforeCommitChanges: ({ exec }) => {},
  getStagingBranchName: ({ nextVersion }) => `releases/v${nextVersion}`,
  formatCommitMessage: ({ nextVersion }) => `chore: release v${nextVersion}`,
  formatPullRequestMessage: ({
    repoURL,
    baseBranch,
    stagingBranch,
    destinationBranch,
    mergeStrategy,
    currentVersion,
    nextVersion,
  }) => {
    const lines = [
      `chore: release v${nextVersion}`,
      '',
      '## Release Summary',
      `- Version change: \`v${currentVersion}\` → \`v${nextVersion}\``,
      `- Merge: \`${stagingBranch}\` → \`${destinationBranch}\``,
      mergeStrategy.toSameBranch.includes(baseBranch)
        ? `- [Compare the changes between the versions](${repoURL}/compare/v${currentVersion}...${stagingBranch})`
        : '',
    ];
    return lines.join('\n');
  },
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
  }) => {
    const correctCommitMessage = commitMessage
      .trim()
      .startsWith(`chore: release v${currentVersion}`);
    if (!correctCommitMessage) {
      return (
        'The commit message should have started with the following:' +
        '\n' +
        `chore: release v${currentVersion}`
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
  publishCommand: ({ isYarn, defaultCommand }) => defaultCommand,
  getTagName: ({ currentVersion }) => `v${currentVersion}`,
  testCommandBeforeRelease: ({ isYarn }) =>
    isYarn ? 'yarn test' : 'npm run test',
  appName: undefined,
  slackIncomingHook: undefined,
  slack: {
    default: {
      username: 'Ship.js',
    },
    releaseStart: ({
      appName,
      version,
      latestCommitHash,
      latestCommitUrl,
    }) => ({
      pretext: `:rocket: Starting to release *${appName}@${version}*`,
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
      ],
    }),
    releaseSuccess: ({
      appName,
      version,
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
          title: 'CHANGELOG',
          value: `${repoURL}/blob/master/CHANGELOG.md`,
        },
      ],
    }),
  },
};
