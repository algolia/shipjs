import { getCurrentVersion } from 'shipjs-lib';

import { mockPrint } from '../../../../tests/util/index.js';
import { print, exitProcess } from '../../../util/index.js';
import validate from '../validate.js';

describe('validate', () => {
  it('returns current version', () => {
    getCurrentVersion.mockImplementationOnce(() => '1.2.3');
    const { currentVersion } = validate({
      config: {
        shouldRelease: () => true,
      },
      dir: '.',
    });
    expect(currentVersion).toBe('1.2.3');
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
      [
        "› Checking the current status.",
        "Skipping a release due to the following reason:",
        "  > conditions aren't met!",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(0);
  });
});
