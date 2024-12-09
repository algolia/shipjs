import { isWorkingTreeClean } from 'shipjs-lib';
import { print, exitProcess } from '../../../util/index.mjs';
import validate from '../validate.mjs';
import { mockPrint } from '../../../../tests/util/index.mjs';
jest.mock('../../../helper');

describe('validate', () => {
  it('works', () => {
    isWorkingTreeClean.mockImplementation(() => true);
    validate({ config: {} });
    expect(exitProcess).toHaveBeenCalledTimes(0);
  });

  it('prints error', () => {
    const output = [];
    mockPrint(print, output);
    isWorkingTreeClean.mockImplementation(() => false);
    validate({
      config: {},
    });
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Checking the current status.",
        "Failed to prepare a release.",
        "  - The working tree is not clean.",
      ]
    `);
  });
});
