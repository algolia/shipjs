import { getNextVersion } from 'shipjs-lib';
import { print, exitProcess } from '../../../util';
import getNextVersionStep from '../getNextVersion';
import { mockPrint } from '../../../../tests/util';

describe('getNextVersion', () => {
  it('returns next version', () => {
    getNextVersion.mockImplementationOnce(() => ({
      version: '0.1.2',
      ignoredMessages: [],
    }));
    const { nextVersion } = getNextVersionStep({});
    expect(nextVersion).toEqual('0.1.2');
  });

  it('exits with nothing to release', () => {
    getNextVersion.mockImplementationOnce(() => ({
      version: null,
    }));
    getNextVersionStep({});
    expect(exitProcess).toHaveBeenCalledTimes(1);
    expect(exitProcess).toHaveBeenCalledWith(0);
  });

  it('prints ignoredMessages', () => {
    const output = [];
    mockPrint(print, output);
    getNextVersion.mockImplementationOnce(() => ({
      version: '0.1.2',
      ignoredMessages: ['hello world', 'foo bar', 'out of convention'],
    }));
    getNextVersionStep({});
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Calculating the next version.",
        "The following commit messages out of convention are ignored:",
        "  hello world",
        "  foo bar",
        "  out of convention",
      ]
    `);
  });
});
