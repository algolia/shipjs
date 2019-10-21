import { print, exitProcess } from '../../util';
import { hubInstalled, hubConfigured } from '../../helper';
import { mockPrint } from '../../../tests/util';
import checkHub from '../checkHub';

describe('checkHub', () => {
  it('prints error if it is not installed', () => {
    const output = [];
    mockPrint(print, output);
    hubInstalled.mockImplementationOnce(() => false);
    checkHub();
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Checking if \`hub\` exists.",
        "You need to install \`hub\` first.",
        "  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
  });

  it('prints error if it is not configured', () => {
    const output = [];
    mockPrint(print, output);
    hubInstalled.mockImplementationOnce(() => true);
    hubConfigured.mockImplementationOnce(() => false);
    checkHub();
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Checking if \`hub\` exists.",
        "You need to configure \`hub\`.",
        "  > https://github.com/algolia/shipjs/blob/master/GUIDE.md#install-hub",
      ]
    `);
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(1);
  });
});
