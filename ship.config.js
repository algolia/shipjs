const fs = require("fs");
const path = require("path");

module.exports = {
  versionUpdated: ({ version, dir, exec }) => {
    // update lerna.json
    const lernaConfigPath = path.resolve(dir, "lerna.json");
    const lerna = JSON.parse(fs.readFileSync(lernaConfigPath).toString());
    lerna.version = version;
    fs.writeFileSync(lernaConfigPath, JSON.stringify(lerna, null, 2));

    // update dependency
    exec(`cd packages/shipjs && yarn add shipjs-lib@${version}`);

    // update `version.js`
    fs.writeFileSync(
      path.resolve(dir, "packages/shipjs/src/version.js"),
      "export default '${version}';"
    );
  },
  beforeCommitChanges: ({ exec }) => {
    exec("yarn toc");
  },
  publishCommand: () =>
    `lerna exec -- yarn publish --no-git-tag-version --non-interactive`
};
