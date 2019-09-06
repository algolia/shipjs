module.exports = {
  versionUpdated: ({ version, dir, exec }) => {
    exec(`npx json -I -f lerna.json -e 'this.version = "${version}"'`);
    exec(
      `npx json -I -f packages/shipjs/package.json -e 'this.dependencies["shipjs-lib"] = "${version}"'`
    );
    exec(
      `echo "export default '${version}';" > packages/shipjs/src/version.js`
    );
  },
  beforeCommitChanges: ({ exec }) => {
    exec(`npx markdown-toc -i --bullets="-" GUIDE.md`);
  },
  publishCommand: () =>
    `lerna exec -- yarn publish --no-git-tag-version --non-interactive`
};
