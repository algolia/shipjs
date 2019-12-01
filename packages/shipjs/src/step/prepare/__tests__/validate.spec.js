import { getCurrentVersion, getCurrentBranch } from 'shipjs-lib';
import { validateBeforePrepare, getBaseBranches } from '../../../helper';
import { print, exitProcess } from '../../../util';
import validate from '../validate';
import { mockPrint } from '../../../../tests/util';
jest.mock('../../../helper');

describe('validate', () => {
  it('works', () => {
    validateBeforePrepare.mockImplementation(() => true);
    const version = '1.2.3';
    const branch = 'legacy';
    getCurrentVersion.mockImplementation(() => version);
    getCurrentBranch.mockImplementation(() => branch);
    const { currentVersion, baseBranch } = validate({
      config: {
        getTagName: () => 'v1.2.3',
        mergeStrategy: {
          toSameBranch: ['master'],
          toReleaseBranch: {
            legacy: 'v1',
          },
        },
      },
    });
    expect(currentVersion).toEqual(version);
    expect(baseBranch).toEqual(branch);
    expect(exitProcess).toHaveBeenCalledTimes(0);
  });

  it('prints error', () => {
    validateBeforePrepare.mockImplementation(() => [
      'workingTreeNotClean',
      'currentBranchIncorrect',
    ]);
    const output = [];
    mockPrint(print, output);
    getBaseBranches.mockImplementation(() => ['master', 'legacy']);
    getCurrentVersion.mockImplementation(() => '1.2.3');
    validate({
      config: {
        getTagName: () => 'v1.2.3',
        mergeStrategy: {
          toSameBranch: ['master'],
          toReleaseBranch: {
            legacy: 'v1',
          },
        },
      },
    });
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Checking the current status.",
        "Failed to prepare a release for the following reason(s).",
        "  - The working tree is not clean.",
        "  - The current branch must be one of [\\"master\\",\\"legacy\\"]",
      ]
    `);
  });
});
