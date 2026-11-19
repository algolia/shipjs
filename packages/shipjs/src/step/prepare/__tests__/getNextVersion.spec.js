import { getNextVersion } from 'shipjs-lib';
import { vi } from 'vitest';

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

describe('getNextVersion with graduate', () => {
  it('passes graduate to the built-in logic', () => {
    getNextVersion.mockImplementationOnce(() => ({ version: '5.0.0' }));
    const { nextVersion } = getNextVersionStep({
      config: {},
      currentVersion: '5.0.0-rc.1',
      graduate: true,
    });
    expect(nextVersion).toBe('5.0.0');
    expect(getNextVersion).toHaveBeenLastCalledWith(
      undefined,
      '5.0.0-rc.1',
      undefined,
      { preid: undefined, graduate: true }
    );
  });

  it('passes graduate to the getNextVersion hook', () => {
    const hook = vi.fn(() => '5.0.0');
    getNextVersionStep({
      config: { getNextVersion: hook },
      graduate: true,
    });
    expect(hook).toHaveBeenCalledWith(
      expect.objectContaining({ graduate: true })
    );
  });

  it('exits when the version cannot graduate', () => {
    const output = [];
    mockPrint(print, output);
    getNextVersion.mockImplementationOnce(() => {
      throw new Error('Cannot graduate `4.80.0`: it is not a prerelease.');
    });
    getNextVersionStep({
      config: {},
      currentVersion: '4.80.0',
      graduate: true,
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output.join('\n')).toContain('it is not a prerelease');
  });
});
