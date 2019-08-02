const fs = require("fs");
const path = require("path");

module.exports = {
  packageJsons: [
    "package.json",
    "packages/shipjs-lib/package.json",
    "packages/shipjs-cli/package.json"
  ],
  versionUpdated: ({ version, dir, exec }) => {
    exec(`npx json -I -f lerna.json -e 'this.version = "${version}"'`);
    exec(
      `npx json -I -f packages/shipjs-cli/package.json -e 'this.dependencies["shipjs-lib"] = "${version}"'`
    );
    exec(
      `echo "export default '${version}';" > packages/shipjs-cli/src/version.js`
    );
  },
  publishCommand: () =>
    `(cd packages/shipjs-lib && npm publish) && (cd packages/shipjs-cli && npm publish)`
};
