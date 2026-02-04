#!/usr/bin/env node

import { execSync } from 'child_process';

execSync('vuepress build', { stdio: 'inherit' });

const ghPagesArgs = ['-m "auto commit [ci skip]"', '-d .vuepress/dist'];

if (process.env.GITHUB_TOKEN) {
  const repo = `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/algolia/shipjs.git`;
  ghPagesArgs.push(`--repo ${repo}`);
  ghPagesArgs.push('--user "Algolia <instantsearch-bot@algolia.com>"');
}

execSync(`gh-pages ${ghPagesArgs.join(' ')}`, {
  stdio: 'inherit',
});
