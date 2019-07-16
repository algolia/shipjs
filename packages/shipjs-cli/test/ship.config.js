module.exports = {
  baseBranches: ['master'],
  versionUpdated({ version }) {
    console.log(`new version: ${version}`);
  },
};
