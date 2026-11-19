import fs from 'fs';
import os from 'os';
import path from 'path';

import { expandPackageList, getPrereleaseId } from 'shipjs-lib';
import { vi } from 'vitest';

import { run } from '../../../util/index.js';
import runPublish from '../runPublish.js';

vi.unmock('../../../helper');

function makePackage(root, name, version) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir);
  fs.writeFileSync(
    path.join(dir, 'package.json'),
    JSON.stringify({ name, version })
  );
  return dir;
}

describe('runPublish with a prerelease tag', () => {
  beforeEach(() => {
    getPrereleaseId.mockImplementation((version) =>
      version.includes('-beta') ? 'beta' : null
    );
  });

  it('passes tag, prereleaseTag and prerelease to publishCommand', () => {
    const publishCommand = vi.fn(
      ({ tag, prereleaseTag }) =>
        `lerna publish from-package --dist-tag ${tag} --pre-dist-tag ${prereleaseTag}`
    );
    runPublish({
      isYarn: true,
      config: { publishCommand, useOidcTokenProvider: true },
      releaseTag: 'latest',
      prereleaseTag: 'beta',
      prerelease: { preid: 'beta' },
      dir: '.',
      dryRun: false,
    });
    expect(publishCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        tag: 'latest',
        prereleaseTag: 'beta',
        prerelease: { preid: 'beta' },
      })
    );
    expect(run.mock.calls[0][0].command).toBe(
      'lerna publish from-package --dist-tag latest --pre-dist-tag beta'
    );
  });

  it('publishes each monorepo package under the tag matching its version', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'shipjs-'));
    const a = makePackage(root, 'a', '5.0.0-beta.0');
    const b = makePackage(root, 'b', '3.1.0');
    expandPackageList.mockImplementationOnce(() => [a, b]);
    runPublish({
      isYarn: false,
      config: {
        publishCommand: ({ defaultCommand }) => defaultCommand,
        useOidcTokenProvider: true,
        monorepo: {},
      },
      releaseTag: 'latest',
      prereleaseTag: 'beta',
      prerelease: { preid: 'beta' },
      dir: root,
      dryRun: false,
    });
    expect(run.mock.calls.map(([{ command, dir }]) => [dir, command])).toEqual([
      [a, 'npm publish --tag beta'],
      [b, 'npm publish --tag latest'],
    ]);
  });
});
