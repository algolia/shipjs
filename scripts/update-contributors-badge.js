#!/usr/bin/env node

const fs = require("fs");
const { contributors } = JSON.parse(
  fs.readFileSync(".all-contributorsrc").toString()
);
const readme = fs.readFileSync("README.md").toString();
fs.writeFileSync(
  "README.md",
  readme.replace(
    /https:\/\/img\.shields\.io\/badge\/all_contributors-\d+-orange\.svg/,
    `https://img.shields.io/badge/all_contributors-${contributors.length}-orange.svg`
  )
);
