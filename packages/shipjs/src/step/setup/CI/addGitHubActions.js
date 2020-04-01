import runStep from '../../runStep';
import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import mkdirp from 'mkdirp';
import { print } from '../../../util';
import { info, warning } from '../../../color';

export default ({
  baseBranch,
  releaseBranch,
  manualPrepare,
  schedulePrepare,
  cronExpr,
  dir,
  dryRun,
}) =>
  runStep(
    {
      title: 'Creating GitHub Actions configuration',
    },
    () => {
      const log = [
        createGitHubAction({
          content: getBaseConfig({ releaseBranch }),
          actionPath: '.github/workflows/shipjs-trigger.yml',
          dir,
          dryRun,
        }),
        manualPrepare &&
          createGitHubAction({
            content: getManualPrepareConfig({ baseBranch }),
            actionPath: '.github/workflows/shipjs-manual-prepare.yml',
            dir,
            dryRun,
          }),
        schedulePrepare &&
          createGitHubAction({
            content: getScheduleConfig({
              baseBranch,
              cronExpr,
            }),
            actionPath: '.github/workflows/shipjs-schedule-prepare.yml',
            dir,
            dryRun,
          }),

        () => {
          print('  You still need to finish setting up GitHub Actions.');
          print(
            '  > https://community.algolia.com/shipjs/guide/getting-started.html#setup-github-actions'
          );
        },
      ].filter(Boolean);

      return () => log.forEach((printResult) => printResult());
    }
  );

function createGitHubAction({ content, actionPath, dir, dryRun }) {
  const filePath = path.resolve(dir, actionPath);

  if (fs.existsSync(filePath)) {
    return () => {
      print(`${warning('✘')} \`${actionPath}\` already exists.`);
    };
  }

  if (dryRun) {
    print(actionPath);
    print(content);
  } else {
    mkdirp.sync(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
  }
  return () => {
    print(`${info('✔')} Created \`${actionPath}\`.`);
  };
}

function getBaseConfig({ releaseBranch }) {
  return ejs.render(
    `name: Ship js trigger
on:
  push:
    branches:
      - <%= releaseBranch %>
jobs:
  build:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          ref: <%= releaseBranch %>
      - uses: actions/setup-node@v1
        with:
          registry-url: "https://registry.npmjs.org"
      - run: |
          if [ -f "yarn.lock" ]; then
            yarn install
          else
            npm install
          fi
      - run: npm run release:trigger
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: \${{ secrets.NPM_AUTH_TOKEN }}
          SLACK_INCOMING_HOOK: \${{ secrets.SLACK_INCOMING_HOOK }}
`,
    { releaseBranch }
  );
}

function getManualPrepareConfig({ baseBranch }) {
  return ejs.render(
    `name: Ship js Manual Prepare
on:
  issue_comment:
    types: [created]
jobs:
  manual_prepare:
    if: |
      github.event_name == 'issue_comment' &&
      (github.event.comment.author_association == 'member' || github.event.comment.author_association == 'owner') &&
      startsWith(github.event.comment.body, '@shipjs prepare')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          ref: <%= baseBranch %>
      - uses: actions/setup-node@v1
      - run: |
          if [ -f "yarn.lock" ]; then
            yarn install
          else
            npm install
          fi
      - run: |
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git config --global user.name "github-actions[bot]"
      - run: npm run release:prepare -- --yes --no-browse
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          SLACK_INCOMING_HOOK: \${{ secrets.SLACK_INCOMING_HOOK }}

  create_done_comment:
    if: success()
    needs: manual_prepare
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github@master
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          args: comment "@\${{ github.actor }} \`shipjs prepare\` done"

  create_fail_comment:
    if: cancelled() || failure()
    needs: manual_prepare
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github@master
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          args: comment "@\${{ github.actor }} \`shipjs prepare\` fail"
`,
    { baseBranch }
  );
}

function getScheduleConfig({ baseBranch, cronExpr }) {
  return ejs.render(
    `name: Ship js Schedule Prepare
on:
  schedule:
    # * is a special character in YAML so you have to quote this string
    - cron:  "<%= cronExpr %>"
jobs:
  schedule_prepare:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
          ref: <%= baseBranch %>
      - uses: actions/setup-node@v1
      - run: |
          if [ -f "yarn.lock" ]; then
            yarn install
          else
            npm install
          fi
      - run: |
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git config --global user.name "github-actions[bot]"
      - run: npm run release:prepare -- --yes --no-browse
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          SLACK_INCOMING_HOOK: \${{ secrets.SLACK_INCOMING_HOOK }}
`,
    { baseBranch, cronExpr }
  );
}
