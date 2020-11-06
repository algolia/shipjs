const fs = require("fs");
const path = require("path");

module.exports = {
  monorepo: {
    mainVersionFile: "package.json",
    packagesToBump: ["packages/*"],
    packagesToPublish: ["packages/*"],
  },
  versionUpdated: ({ version, dir, exec }) => {
    // update lerna.json
    updateJson(dir, "lerna.json", (json) => {
      json.version = version;
    });

    // update `version.js`
    fs.writeFileSync(
      path.resolve(dir, "packages/shipjs/src/version.js"),
      `export default '${version}';\n`
    );
    fs.writeFileSync(
      path.resolve(dir, "packages/shipjs-lib/src/version.js"),
      `export default '${version}';\n`
    );
  },
  beforeCommitChanges: ({ exec }) => {
    exec("./scripts/update-contributors-badge.js");
  },
  beforePublish: ({ exec }) => {
    exec("cp README.md packages/shipjs/");
  },
  testCommandBeforeRelease: () => 'echo "No test before release"', // TODO: remove later
  // skip preparation if the patch update contains no fix
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === "patch" && fix === 0) {
      return false;
    }
    return true;
  },
};

const updateJson = (dir, fileName, fn) => {
  const filePath = path.resolve(dir, fileName);
  const json = JSON.parse(fs.readFileSync(filePath).toString());
  fn(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
};
