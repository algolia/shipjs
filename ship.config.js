const fs = require("fs");

module.exports = {
  packageJsons: [
    "package.json",
    "packages/shipjs-lib/package.json",
    "packages/shipjs-cli/package.json"
  ],
  versionUpdated: ({ version, exec }) => {
    const json = JSON.parse(fs.readFileSync("lerna.json").toString());
    json.version = version;
    fs.writeFileSync("lerna.json", `${JSON.stringify(json, null, 2)}\n`);
  }
};
