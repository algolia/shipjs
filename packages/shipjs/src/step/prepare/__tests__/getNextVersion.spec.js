import { getNextVersion } from 'shipjs-lib';
import { print, exitProcess } from '../../../util';
import getNextVersionStep from '../getNextVersion';
import { info, warning } from '../../../color';
jest.mock('shipjs-lib');
jest.mock('../../../util');
jest.mock('../../../color');

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
    info.mockImplementation(str => str);
    warning.mockImplementation(str => str);
    print.mockImplementation((...args) => {
      output.push(args.join(' '));
    });
    getNextVersion.mockImplementationOnce(() => ({
      version: '0.1.2',
      ignoredMessages: ['hello world', 'foo bar', 'out of convention'],
    }));
    getNextVersionStep({});
    expect(output).toMatchInlineSnapshot(`
      Array [
        "The following commit messages out of convention are ignored:",
        "  hello world",
        "  foo bar",
        "  out of convention",
      ]
    `);
  });
});
