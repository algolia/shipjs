const fs = require("fs");
const path = require("path");

module.exports = {
  monorepo: {
    readVersionFrom: "package.json",
    packagesToBump: ["packages/*"],
    packagesToPublish: ["packages/*"]
  },
  versionUpdated: ({ version, dir, exec }) => {
    // update lerna.json
    updateJson(dir, "lerna.json", json => {
      json.version = version;
    });

    // update package.json
    updateJson(dir, "package.json", json => {
      json.version = version;
    });

    // update dependency
    updateJson(dir, "packages/shipjs/package.json", json => {
      json.dependencies["shipjs-lib"] = version;
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
    exec("yarn toc");
  },
  beforePublish: ({ exec }) => {
    exec("cd README.md packages/shipjs/");
  }
};

const updateJson = (dir, fileName, fn) => {
  const filePath = path.resolve(dir, fileName);
  const json = JSON.parse(fs.readFileSync(filePath).toString());
  fn(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
};
