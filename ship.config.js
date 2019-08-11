const fs = require("fs");
const path = require("path");

module.exports = {
  packageJsons: [
    "package.json",
    "packages/shipjs-lib/package.json",
    "packages/shipjs/package.json"
  ],
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
  publishCommand: ({ defaultCommand }) =>
    `(cd packages/shipjs-lib && ${defaultCommand}) && (cd packages/shipjs && ${defaultCommand})`,
  pullRequestReviewer: "eunjae-lee"
};
