import { getGitConfig } from 'shipjs-lib';
import runStep from '../../runStep';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import mkdirp from 'mkdirp';
import { print } from '../../../util';
import { info, warning } from '../../../color';

// manualPrepare
export default ({ releaseBranch, dir, dryRun }) =>
  runStep(
    {
      title: 'Creating GitHub Actions configuration',
    },
    () => {
      const filePath = path.resolve(
        dir,
        '.github/workflows',
        'shipjs-trigger.yml'
      );

      if (fs.existsSync(filePath)) {
        return () => {
          print(
            `${warning(
              '✘'
            )} \`.github/workflows/shipjs-trigger.yml\` already exists.`
          );
          print('  You can manually configure GitHub Actions');
        };
      }
      const content = getBaseConfig({
        releaseBranch,
        gitUserName: getGitConfig('user.name') || 'Your Name',
        gitUserEmail: getGitConfig('user.email') || 'your@email.com',
      });
      if (dryRun) {
        print(`shipjs-trigger.yml`);
        print(content);
      } else {
        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
      }
      return () => {
        print(`${info('✔')} Created \`.github/workflows/shipjs-trigger.yml\`.`);
        print('  You still need to finish setting up at GitHub Actions.');
      };
    }
  );

function getBaseConfig({ releaseBranch, gitUserName, gitUserEmail }) {
  return ejs.render(
    `
name: Ship js trigger
  on:
    push:
      branches:
        - <%= releaseBranch %>
  jobs:
    build:
      name: Build
      runs-on: Ubuntu-latest
      steps:
        - uses: actions/checkout@master
        - uses: actions/setup-node@master
          with:
            registry-url: "https://registry.npmjs.org"
        - run: git switch master
        - run: npm install
        - run: npm run release:trigger
          env:
            GITHUB_TOKEN: \${{ secrets.GH_TOKEN }}
            NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
    
`,
    { releaseBranch, gitUserName, gitUserEmail }
  );
}
