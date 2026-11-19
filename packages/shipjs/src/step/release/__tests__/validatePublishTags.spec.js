import { getPrereleaseId, silentExec } from 'shipjs-lib';

import { mockPrint } from '../../../../tests/util/index.js';
import { getTagForVersion } from '../../../helper/index.js';
import { exitProcess, print } from '../../../util/index.js';
import validatePublishTags from '../validatePublishTags.js';

const isPre = (version) => (version.includes('-') ? 'beta' : null);

describe('validatePublishTags', () => {
  beforeEach(() => {
    getPrereleaseId.mockImplementation(isPre);
    getTagForVersion.mockImplementation((version, tags) =>
      isPre(version) ? tags.prereleaseTag : tags.tag
    );
    silentExec.mockImplementation(() => ({ code: 0, stdout: '4.80.0\n' }));
  });

  it('passes for a prerelease on its channel', () => {
    validatePublishTags({
      config: {},
      version: '0.0.0',
      packages: [
        { name: 'a', version: '5.0.0-beta.0' },
        { name: 'b', version: '4.81.0' },
      ],
      tag: 'latest',
      prereleaseTag: 'beta',
      dir: '.',
    });
    expect(exitProcess).not.toHaveBeenCalled();
    expect(silentExec).toHaveBeenCalledTimes(1);
    expect(silentExec.mock.calls[0][0]).toBe('npm view b dist-tags.latest');
  });

  it('refuses a prerelease on latest', () => {
    const output = [];
    mockPrint(print, output);
    validatePublishTags({
      config: {},
      version: '0.0.0',
      packages: [{ name: 'a', version: '5.0.0-beta.0' }],
      tag: 'latest',
      prereleaseTag: 'latest',
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output.join('\n')).toMatch(
      'a@5.0.0-beta.0 is a prerelease and would be published under `latest`.'
    );
  });

  it('refuses to move latest back to an older version', () => {
    silentExec.mockImplementation(() => ({ code: 0, stdout: '5.0.0\n' }));
    const output = [];
    mockPrint(print, output);
    validatePublishTags({
      config: {},
      version: '0.0.0',
      packages: [{ name: 'a', version: '4.80.1' }],
      tag: 'latest',
      prereleaseTag: 'latest',
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
    expect(output.join('\n')).toMatch('would move `latest` back from 5.0.0');
  });

  it('allows an older version under another tag', () => {
    silentExec.mockImplementation(() => ({ code: 0, stdout: '5.0.0\n' }));
    validatePublishTags({
      config: {},
      version: '0.0.0',
      packages: [{ name: 'a', version: '4.80.1' }],
      tag: 'v4',
      prereleaseTag: 'v4',
      dir: '.',
    });
    expect(exitProcess).not.toHaveBeenCalled();
    expect(silentExec).not.toHaveBeenCalled();
  });

  it('passes for a package not on npm yet', () => {
    silentExec.mockImplementation(() => ({ code: 1, stdout: '' }));
    validatePublishTags({
      config: {},
      version: '1.0.0',
      packages: [{ name: 'new', version: '1.0.0' }],
      tag: 'latest',
      prereleaseTag: 'latest',
      dir: '.',
    });
    expect(exitProcess).not.toHaveBeenCalled();
  });

  it('refuses an invalid tag', () => {
    validatePublishTags({
      config: {},
      version: '1.0.0',
      packages: [],
      tag: '1.0.0',
      prereleaseTag: '1.0.0',
      dir: '.',
    });
    expect(exitProcess).toHaveBeenCalledWith(1);
  });

  it('can be turned off', () => {
    validatePublishTags({
      config: { guardPublishTag: false },
      version: '0.0.0',
      packages: [{ name: 'a', version: '5.0.0-beta.0' }],
      tag: 'latest',
      prereleaseTag: 'latest',
      dir: '.',
    });
    expect(exitProcess).not.toHaveBeenCalled();
  });
});
