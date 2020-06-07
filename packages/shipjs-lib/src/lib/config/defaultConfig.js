import shipJsVersion from '../../version';

export default {
  remote: 'origin',
  // monorepo: {
  //   mainVersionFile: 'package.json',
  //   packagesToBump: ['packages/*', 'examples/*'],
  //   packagesToPublish: ['packages/*'],
  // },
  shouldPrepare: undefined, // async ({ commits, nextVersion, releaseType, releaseTag, commitNumbersPerType }) => {},
  updateChangelog: true,
  conventionalChangelogArgs: '-p angular -i CHANGELOG.md -s',
  installCommand: ({ isYarn }) =>
    isYarn ? 'yarn install --silent' : 'npm install',
  versionUpdated: undefined, // ({ version, releaseType, dir, exec }) => {},
  getNextVersion: undefined, // ({ revisionRange, commitTitles, commitBodies, currentVersion, dir }) => {},
  beforeCommitChanges: undefined, // ({ nextVersion, releaseType, exec, dir }) => {},
  getStagingBranchName: ({ nextVersion, releaseType }) =>
    `releases/v${nextVersion}`,
  formatCommitMessage: ({ version, releaseType, baseBranch }) =>
    `chore: release v${version}`,
  formatPullRequestTitle: ({ version, releaseType }) =>
    `chore: release v${version}`,
  formatPullRequestMessage: ({
    repo, // "instantsearch.js"
    repoURL, // "https://github.com/algolia/instantsearch.js"
    baseBranch, // "master"
    stagingBranch, // "releases/v4.5.0"
    destinationBranch, // "master"
    releaseType, // "major" | "minor" | "patch" | "prerelease"
    diffURL,
    currentVersion,
    nextVersion,
    publishCommands, // either a string or an array (if monorepo)
    title,
  }) => {
    const repoLink = `[${repo}](${repoURL})`;
    const branchFlow = `${baseBranch} → ${stagingBranch} (current) → ${destinationBranch}`;
    const diffLink = `[\`${currentVersion}\` → \`${nextVersion}\`](${diffURL})`;
    const publishCommandsTable =
      typeof publishCommands === 'string'
        ? `\`\`\`${publishCommands}\`\`\``
        : `
| Dir | Command |
|---|---|
${publishCommands
  .map(({ dirName, command }) => `| ${dirName} | ${command} |`)
  .join('\n')}
`.trim();

    const mergeInstruction = `
When merging this pull request, you need to **Squash and merge** and make sure that the title starts with \`${title}\`.
<details>
<summary>See details</summary>

After that, a commit \`${title}\` will be added and you or your CI can run \`shipjs trigger\` to trigger the release based on the commit.
![Squash and merge](https://raw.githubusercontent.com/algolia/shipjs/v${shipJsVersion}/assets/squash-and-merge.png)
</details>
    `.trim();

    const message = `
This pull request prepares the following release:
| Package | Branch | Update | Change |
|---|---|---|---|
| ${repoLink} | ${branchFlow} | ${releaseType} | ${diffLink} |

### Release Summary
This is going to be published with the following command:

${publishCommandsTable}

### Merging Instructions
${mergeInstruction}

---

_This pull request is automatically generated by [Ship.js](https://github.com/algolia/shipjs)_.
`.trim();
    return message;
  },
  pullRequestReviewers: undefined,
  pullRequestTeamReviewers: undefined,
  shouldRelease: ({
    commitMessage,
    currentVersion,
    formatPullRequestTitle,
  }) => {
    const correctCommitMessage = formatPullRequestTitle({
      version: currentVersion,
    });
    if (!commitMessage.trim().startsWith(correctCommitMessage)) {
      return (
        'The commit message should have started with the following:' +
        '\n' +
        `${correctCommitMessage}`
      );
    }
    return true;
  },
  buildCommand: ({ isYarn }) => (isYarn ? 'yarn build' : 'npm run build'),
  beforePublish: undefined, // ({ exec, dir }) => {}
  publishCommand: ({ isYarn, tag, defaultCommand, dir }) => defaultCommand,
  afterPublish: undefined, // ({ exec, dir, version, releaseTag }) => {}
  getTagName: ({ version }) => `v${version}`,
  testCommandBeforeRelease: undefined, // ({ isYarn }) => isYarn ? 'yarn test' : 'npm run test',
  appName: undefined,
  forcePushBranches: [],
  slack: {
    default: {
      username: 'Ship.js',
      // eslint-disable-next-line camelcase
      icon_emoji: ':passenger_ship:',
    },
    prepared: ({ appName, version, pullRequestUrl }) => ({
      pretext: `:writing_hand: The release for *${appName}@${version}* is prepared!`,
      fields: [
        {
          title: 'Branch',
          value: 'master',
          short: true,
        },
        {
          title: 'Version',
          value: version,
          short: true,
        },
        {
          title: 'Pull Request',
          value: pullRequestUrl,
          short: false,
        },
      ],
    }),
    releaseSuccess: ({
      appName,
      version,
      tagName,
      latestCommitHash,
      latestCommitUrl,
      repoURL,
    }) => ({
      pretext: `:tada: Successfully released *${appName}@${version}*`,
      fields: [
        {
          title: 'Branch',
          value: 'master',
          short: true,
        },
        {
          title: 'Commit',
          value: `*<${latestCommitUrl}|${latestCommitHash}>*`,
          short: true,
        },
        {
          title: 'Version',
          value: version,
          short: true,
        },
        {
          title: 'Release',
          value: `${repoURL}/releases/tag/${tagName}`,
        },
      ],
    }),
  },
  releases: {
    assetsToUpload: [],
    extractChangelog: undefined, // ({ version, dir }) => `some specific changelog to that version`,
  },
};
