export default {
  baseBranches: ['master'],
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  versionUpdated: ({ version, exec }) => {},
  changelogUpdated: ({ exec }) => {},
  getReleaseBranchName: ({ nextVersion }) => `releases/v${nextVersion}`,
  mergeReleaseBranchTo: {
    currentBranch: true,
  },
  // mergeReleaseBranchTo: {
  //   getName: ({ currentBranch }) => {
  //     if (currentBranch === 'master') {
  //       return 'releases/stable';
  //     } else {
  //       return `releases/${currentBranch}`;
  //     }
  //   },
  // },
};
