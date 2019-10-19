import {
  getCurrentVersion,
  getCurrentBranch,
  getLatestCommitMessage,
} from 'shipjs-lib';
import { print, exitProcess } from '../../../util';
import { mockPrint } from '../../../../tests/util';
import validate from '../validate';

describe('validate', () => {
  it('returns current version', () => {
    getCurrentVersion.mockImplementationOnce(() => '1.2.3');
    const { currentVersion } = validate({
      config: {
        shouldRelease: () => true,
      },
      dir: '.',
    });
    expect(currentVersion).toEqual('1.2.3');
  });

  it('skips when conditions are not met', () => {
    const output = [];
    mockPrint(print, output);
    validate({
      config: {
        shouldRelease: () => `conditions aren't met!`,
      },
      dir: '.',
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Checking the current status.",
        "Skipping a release due to the following reason:",
        "  > conditions aren't met!",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(0);
  });
});
