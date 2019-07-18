const fs = require("fs");
const path = require("path");

module.exports = {
  packageJsons: [
    "package.json",
    "packages/shipjs-lib/package.json",
    "packages/shipjs-cli/package.json"
  ],
  versionUpdated: ({ version, dir, exec }) => {
    const filePath = path.resolve(dir, "lerna.json");
    const json = JSON.parse(fs.readFileSync(filePath).toString());
    json.version = version;
    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`);
  }
};
