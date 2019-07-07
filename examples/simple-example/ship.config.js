const fs = require('fs');

module.exports = {
  packageJsons: ['package.json'],
  versionUpdated(version) {
    fs.writeFileSync('version.js', `export default "v${version}"\n`);
  },
};
