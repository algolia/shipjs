export default {
  remote: 'origin',
  baseBranches: ['master'],
  packageJsons: ['package.json'],
  conventionalChangelogArgs: {
    preset: 'angular',
    infile: 'CHANGELOG.md',
    sameFile: true,
  },
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
    baseBranches,
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
  publishCommand: ({ isYarn }) => 'npm publish',
  getTagName: ({ currentVersion }) => `v${currentVersion}`,
  testCommandBeforeRelease: ({ isYarn }) =>
    isYarn ? 'yarn test' : 'npm run test',
};
