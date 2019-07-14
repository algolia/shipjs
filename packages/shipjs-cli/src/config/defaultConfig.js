export default {
  remote: 'origin',
  baseBranches: ['master'],
  packageJsons: ['package.json'],
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  installCommand: ({ isYarn }) => (isYarn ? 'yarn install' : 'npm install'),
  versionUpdated: ({ version, exec }) => {},
  changelogUpdated: ({ exec }) => {},
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
    backToBaseBranch: false,
    toReleaseBranch: true,
    branchMappings: [
      { baseBranch: 'master', releaseBranch: 'releases/stable' },
      { baseBranch: 'legacy', releaseBranch: 'releases/legacy' },
      { baseBranch: 'next', releaseBranch: 'releases/next' },
    ],
    getReleaseBranchName: ({ baseBranch }) => {
      if (baseBranch === 'master') {
        return 'releases/stable';
      } else {
        return `releases/${baseBranch}`;
      }
    },
  },
  shouldRelease: ({
    commitMessage,
    currentVersion,
    currentBranch,
    mergeStrategy,
  }) => {
    if (mergeStrategy.backToBaseBranch === true) {
      return `chore: release v${currentVersion}` === commitMessage.trim();
    } else if (mergeStrategy.toReleaseBranch === true) {
      return currentBranch.indexOf('releases/') === 0; // FIXME: use `branchMappings`
    }
  },
  buildCommand: ({ isYarn }) => (isYarn ? 'yarn build' : 'npm run build'),
  publishCommand: ({ isYarn }) => 'npm run release',
  getTagName: ({ currentVersion }) => `v${currentVersion}`,
  testCommandBeforeRelease: ({ isYarn }) =>
    isYarn ? 'yarn test' : 'npm run test',
};
