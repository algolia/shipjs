export default {
  remote: 'origin',
  baseBranches: ['master'],
  packageJsons: ['package.json'],
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  installDependencies: ({ isYarn }) =>
    isYarn ? 'yarn install' : 'npm install',
  versionUpdated: ({ version, exec }) => {},
  changelogUpdated: ({ exec }) => {},
  getReleaseBranchName: ({ nextVersion }) => `releases/v${nextVersion}`,
  formatCommitMessage: ({ nextVersion }) => `chore: release v${nextVersion}`,
  formatPullRequestMessage: ({
    repoURL,
    baseBranch,
    releaseBranch,
    destinationBranch,
    mergeReleaseBranchTo,
    currentVersion,
    nextVersion,
  }) => {
    const lines = [
      `chore: release v${nextVersion}`,
      '',
      '## Release Summary',
      `- Version change: \`v${currentVersion}\` → \`v${nextVersion}\``,
      `- Merge: \`${releaseBranch}\` → \`${destinationBranch}\``,
      mergeReleaseBranchTo.baseBranch === true
        ? `- [Compare the changes between the versions](${repoURL}/compare/v${currentVersion}...${releaseBranch})`
        : '',
    ];
    return lines.join('\n');
  },
  mergeReleaseBranchTo: {
    baseBranch: true,
  },
  // mergeReleaseBranchTo: {
  //   getName: ({ baseBranch }) => {
  //     if (baseBranch === 'master') {
  //       return 'releases/stable';
  //     } else {
  //       return `releases/${baseBranch}`;
  //     }
  //   },
  // },
  shouldRelease: ({
    commitMessage,
    currentVersion,
    currentBranch,
    mergeReleaseBranchTo,
  }) => {
    if (mergeReleaseBranchTo.baseBranch === true) {
      return `chore: release v${currentVersion}` === commitMessage.trim();
    } else {
      return currentBranch.indexOf('releases/') === 0;
    }
  },
  releaseCommand: 'npm run release',
  formatTagName: ({ currentVersion, currentBranch }) => `v${currentVersion}`,
};
