import { getGitConfig } from 'shipjs-lib';
import runStep from '../../runStep';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import mkdirp from 'mkdirp';
import { print } from '../../../util';
import { info, warning } from '../../../color';

export default ({ baseBranch, schedulePrepare, cronExpr, dir, dryRun }) =>
  runStep(
    {
      title: 'Creating CircleCI configuration',
    },
    () => {
      const filePath = path.resolve(dir, '.circleci', 'config.yml');
      if (fs.existsSync(filePath)) {
        return () => {
          print(`${warning('✘')} \`.circleci/config.yml\` already exists.`);
          print(
            '  You can manually configure CircleCI through these two steps:'
          );
          print(
            '  > Basic setup: https://community.algolia.com/shipjs/guide/getting-started.html#automate-part-3-trigger'
          );
          print(
            '  > Schedule your release: https://community.algolia.com/shipjs/guide/useful-config.html#schedule-your-release'
          );
        };
      }
      const content = getConfig({
        baseBranch,
        schedulePrepare,
        cronExpr,
        gitUserName: getGitConfig('user.name') || 'Your Name',
        gitUserEmail: getGitConfig('user.email') || 'your@email.com',
      });
      if (dryRun) {
        print(`.circleci/config.yml`);
        print(content);
      } else {
        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, content);
      }
      return () => {
        print(`${info('✔')} Created \`.circleci/config.yml\`.`);
        print('  You still need to finish setting up at CircleCI.');
        print(
          '  > https://community.algolia.com/shipjs/guide/getting-started.html#automate-part-3-trigger'
        );
      };
    }
  );

function getConfig({
  baseBranch,
  schedulePrepare,
  cronExpr,
  gitUserName,
  gitUserEmail,
}) {
  return ejs.render(
    `
# Javascript Node CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-javascript/ for more details
#

aliases:
  - &install_yarn_version
    name: Install specific Yarn version
    command: |
      curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.16.0
      echo 'export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"' >> $BASH_ENV

  - &restore_yarn_cache
    name: Restore Yarn cache
    keys:
      - yarn-{{ .Branch }}-packages-{{ checksum "yarn.lock" }}

  - &save_yarn_cache
    name: Save Yarn cache
    key: yarn-{{ .Branch }}-packages-{{ checksum "yarn.lock" }}
    paths:
      - ~/.cache/yarn

  - &run_yarn_install
    name: Install dependencies
    command: yarn install

defaults: &defaults
  working_directory: ~/repo
  docker:
    - image: circleci/node:12.14.1

version: 2
jobs:
  test:
    <<: *defaults
    steps:
      - checkout
      - run: *install_yarn_version
      - restore_cache: *restore_yarn_cache
      - run: *run_yarn_install
      - save_cache: *save_yarn_cache
      - run:
          name: Run Tests
          command: yarn test
<% if (schedulePrepare) { %>
  prepare_release:
    <<: *defaults
    steps:
      - checkout
      - run: *install_yarn_version
      - restore_cache: *restore_yarn_cache
      - run: *run_yarn_install
      - save_cache: *save_yarn_cache
      - run:
          name: Prepare release
          command: |
            git config --global user.email "<%= gitUserEmail %>"
            git config --global user.name "<%= gitUserName %>"
            yarn run release --yes --no-browse
<% } %>
  shipjs_trigger:
    <<: *defaults
    steps:
      - checkout
      - run: *install_yarn_version
      - restore_cache: *restore_yarn_cache
      - run: *run_yarn_install
      - save_cache: *save_yarn_cache
      - run:
          name: Triggering Ship.js to Release
          command: |
            git config --global user.email "<%= gitUserEmail %>"
            git config --global user.name "<%= gitUserName %>"
            yarn shipjs trigger
workflows:
  version: 2
  release_if_needed:
    jobs:
      - shipjs_trigger:
          filters:
            branches:
              only:
                - <%= baseBranch %>
<% if (schedulePrepare) { %>
  schedule_release:
    triggers:
      - schedule:
          cron: "<%= cronExpr %>"
          filters:
            branches:
              only:
                - <%= baseBranch %>
    jobs:
      - prepare_release
<% } %>
`,
    { baseBranch, schedulePrepare, cronExpr, gitUserName, gitUserEmail }
  );
}
