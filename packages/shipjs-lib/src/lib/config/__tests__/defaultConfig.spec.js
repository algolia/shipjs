import defaultConfig from '../defaultConfig';
jest.mock('../../../version', () => '0.5.2');
const {
  formatCommitMessage,
  formatPullRequestTitle,
  formatPullRequestMessage,
  shouldRelease,
} = defaultConfig;
const publishCommands = 'npm publish --tag latest';

describe('defaultConfig', () => {
  it('should export an object', () => {
    expect(defaultConfig).toMatchObject(expect.objectContaining({}));
  });

  it('formatCommitMessage', () => {
    const version = '0.1.2';
    expect(
      formatCommitMessage({
        version,
        baseBranch: 'master',
      })
    ).toBe(`chore: release v0.1.2`);
  });

  it('formatPullRequestMessage returns a correct message', () => {
    const repo = 'shipjs';
    const repoURL = 'https://github.com/algolia/shipjs';
    const baseBranch = 'master';
    const stagingBranch = 'releases/v0.1.1';
    const currentVersion = '0.1.0';
    const releaseType = 'patch';
    const currentTag = 'v0.1.0';
    const nextVersion = '0.1.1';
    const diffURL = `${repoURL}/compare/${currentTag}...${stagingBranch}`;
    const title = formatPullRequestTitle({ version: nextVersion, releaseType });

    const destinationBranch = 'master';
    const message = formatPullRequestMessage({
      repo,
      repoURL,
      baseBranch,
      stagingBranch,
      destinationBranch,
      releaseType,
      diffURL,
      currentVersion,
      nextVersion,
      publishCommands,
      title,
    });
    expect(message).toMatchInlineSnapshot(`
        "This pull request prepares the following release:
        | Package | Branch | Update | Change |
        |---|---|---|---|
        | [shipjs](https://github.com/algolia/shipjs) | master → releases/v0.1.1 (current) → master | patch | [\`0.1.0\` → \`0.1.1\`](https://github.com/algolia/shipjs/compare/v0.1.0...releases/v0.1.1) |

        ### Release Summary
        This is going to be published with the following command:

        \`\`\`npm publish --tag latest\`\`\`

        ### Merging Instructions
        When merging this pull request, you need to **Squash and merge** and make sure that the title starts with \`chore: release v0.1.1\`.
        <details>
        <summary>See details</summary>

        After that, a commit \`chore: release v0.1.1\` will be added and you or your CI can run \`shipjs trigger\` to trigger the release based on the commit.
        ![Squash and merge](https://raw.githubusercontent.com/algolia/shipjs/v0.5.2/assets/squash-and-merge.png)
        </details>

        ---

        _This pull request is automatically generated by [Ship.js](https://github.com/algolia/shipjs)_."
      `);
  });

  describe('shouldRelease', () => {
    const currentVersion = '0.1.2';
    const commitMessage = 'chore: release v0.1.2';

    it('returns error with wrong commit message', () => {
      const result = shouldRelease({
        commitMessage: '',
        currentVersion,
        formatPullRequestTitle,
      });
      expect(result).toMatchInlineSnapshot(`
        "The commit message should have started with the following:
        chore: release v0.1.2"
      `);
    });

    it('returns true', () => {
      const result = shouldRelease({
        commitMessage,
        currentVersion,
        formatPullRequestTitle,
      });
      expect(result).toBe(true);
    });
  });
});
