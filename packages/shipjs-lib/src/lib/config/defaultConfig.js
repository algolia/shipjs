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
      mergeStrategy.backToBaseBranch === true
        ? `- [Compare the changes between the versions](${repoURL}/compare/v${currentVersion}...${stagingBranch})`
        : '',
    ];
    return lines.join('\n');
  },
  mergeStrategy: {
    backToBaseBranch: true,
    toReleaseBranch: false,
    branchMappings: [
      { baseBranch: 'master', releaseBranch: 'releases/stable' },
      { baseBranch: 'legacy', releaseBranch: 'releases/legacy' },
      { baseBranch: 'next', releaseBranch: 'releases/next' },
    ],
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
    if (mergeStrategy.backToBaseBranch === true) {
      const result = baseBranches.some(
        baseBranch => baseBranch === currentBranch
      );
      return (
        result ||
        `The current branch needs to be one of [${baseBranches.join(', ')}]`
      );
    } else if (mergeStrategy.toReleaseBranch === true) {
      const result = mergeStrategy.branchMappings.some(
        m => m.releaseBranch === currentBranch
      );
      return (
        result ||
        `The current branch needs to be one of [${mergeStrategy.branchMappings
          .map(m => m.baseBranch)
          .join(', ')}]`
      );
    } else {
      throw new Error('Unknown merge strategy');
    }
  },
  buildCommand: ({ isYarn }) => (isYarn ? 'yarn build' : 'npm run build'),
  publishCommand: ({ isYarn }) => 'npm publish',
  getTagName: ({ currentVersion }) => `v${currentVersion}`,
  testCommandBeforeRelease: ({ isYarn }) =>
    isYarn ? 'yarn test' : 'npm run test',
};
