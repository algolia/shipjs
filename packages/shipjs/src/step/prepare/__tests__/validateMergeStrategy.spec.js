import validateMergeStrategy from '../validateMergeStrategy';
import { print, exitProcess } from '../../../util';
import { mockPrint } from '../../../../tests/util';

describe('validateMergeStrategy', () => {
  it('prints nothing when it is correct', () => {
    const output = [];
    mockPrint(print, output);
    validateMergeStrategy({
      config: {
        mergeStrategy: {
          toSameBranch: ['legacy'],
          toReleaseBranch: {
            develop: 'master',
          },
        },
      },
    });
    expect(print).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledTimes(0);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Validating mergeStrategy.",
      ]
    `);
  });

  it('prints error when release branch is not unique', () => {
    const output = [];
    mockPrint(print, output);
    validateMergeStrategy({
      config: {
        mergeStrategy: {
          toSameBranch: [],
          toReleaseBranch: {
            develop: 'master',
            legacy: 'master',
          },
        },
      },
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Validating mergeStrategy.",
        "Invalid \`mergeStrategy\` in your configuration.",
        "  : Release branch should be unique per base branch.",
        "{
        \\"toSameBranch\\": [],
        \\"toReleaseBranch\\": {
          \\"develop\\": \\"master\\",
          \\"legacy\\": \\"master\\"
        }
      }",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
  });

  it('prints error when same branch name is both strategies', () => {
    const output = [];
    mockPrint(print, output);
    validateMergeStrategy({
      config: {
        mergeStrategy: {
          toSameBranch: ['master'],
          toReleaseBranch: {
            develop: 'master',
          },
        },
      },
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Validating mergeStrategy.",
        "Invalid \`mergeStrategy\` in your configuration.",
        "  : You cannot put a same branch name both in \`toSameBranch\` and \`toReleaseBranch\`",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
  });
});
