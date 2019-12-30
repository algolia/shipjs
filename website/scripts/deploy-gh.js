#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

(async function() {
  const configPath = path.resolve(__dirname, '..', '.vuepress', 'config.js');
  const originalConfig = fs.readFileSync(configPath).toString();
  const configWithBase = originalConfig.replace(
    'module.exports = {',
    `module.exports = {\n  base: "/shipjs/",`
  );
  fs.writeFileSync(configPath, configWithBase);
  await exec('vuepress build');
  await exec('gh-pages -d .vuepress/dist');

  fs.writeFileSync(configPath, originalConfig);
})();
