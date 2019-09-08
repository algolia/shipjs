const fs = require("fs");
const path = require("path");

module.exports = {
  monorepo: {
    readVersionFrom: "package.json",
    packagesToBump: ["packages/*"],
    packagesToPublish: ["packages/*"]
  },
  versionUpdated: ({ version, dir, exec }) => {
    const updateVersion = (filePath, expression) => {
      exec(`npx json -I -f ${filePath} -e '${expression} = "${version}"'`);
    };

    // update lerna.json
    updateVersion("lerna.json", "this.version");

    // update dependency
    updateVersion(
      "packages/shipjs/package.json",
      'this.dependencies["shipjs-lib"]'
    );

    // update `version.js`
    fs.writeFileSync(
      path.resolve(dir, "packages/shipjs/src/version.js"),
      `export default '${version}';`
    );
  },
  beforeCommitChanges: ({ exec }) => {
    exec("yarn toc");
  },
  publishCommand: () =>
    `lerna exec -- yarn publish --no-git-tag-version --non-interactive`
};
