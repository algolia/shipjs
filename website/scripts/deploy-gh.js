#!/usr/bin/env node

import { execSync } from 'child_process';

execSync('vuepress build', { stdio: 'inherit' });
execSync('gh-pages -m "auto commit [ci skip]" -d .vuepress/dist', {
  stdio: 'inherit',
});
