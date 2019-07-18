module.exports = {
  packageJsons: [
    "package.json",
    "packages/shipjs-lib/package.json",
    "packages/shipjs-cli/package.json"
  ],
  versionUpdated: ({ version, exec }) => {
    exec(`npx json -I -f lerna.json -e 'this.version = "${version}"'`);
  }
};
