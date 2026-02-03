import { getNextVersion } from 'shipjs-lib';

import { mockPrint } from '../../../../tests/util/index.js';
import { print, exitProcess } from '../../../util/index.js';
import getNextVersionStep from '../getNextVersion.js';

describe('getNextVersion', () => {
  it('returns next version', () => {
    getNextVersion.mockImplementationOnce(() => ({
      version: '0.1.2',
      ignoredMessages: [],
    }));
    const { nextVersion } = getNextVersionStep({ config: {} });
    expect(nextVersion).toBe('0.1.2');
  });

  it('returns next version by hook from config', () => {
    getNextVersion.mockImplementationOnce(() => ({
      version: '0.1.2',
      ignoredMessages: [],
    }));
    const { nextVersion } = getNextVersionStep({
      config: {
        getNextVersion: () => '1.2.3',
      },
    });
    expect(nextVersion).toBe('1.2.3');
  });

  it('exits with nothing to release', () => {
    getNextVersion.mockImplementationOnce(() => ({
      version: null,
    }));
    getNextVersionStep({ config: {} });
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
    getNextVersionStep({ config: {} });
    expect(output).toMatchInlineSnapshot(`
      [
        "› Calculating the next version.",
        "The following commit messages out of convention are ignored:",
        "  hello world",
        "  foo bar",
        "  out of convention",
      ]
    `);
  });
});
