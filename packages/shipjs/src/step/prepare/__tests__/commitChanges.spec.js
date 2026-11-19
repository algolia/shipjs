import { vi } from 'vitest';

import { mockPrint } from '../../../../tests/util/index.js';
import { wrapExecWithDir, run, print } from '../../../util/index.js';
import commitChanges from '../commitChanges.js';

vi.mock('temp-write', () => ({
  default: {
    sync: () => '/temp/file/path',
  },
}));

describe('commitChanges', () => {
  it('works in dry mode', () => {
    const output = [];
    mockPrint(print, output);
    commitChanges({
      config: {
        formatCommitMessage: () => 'test message',
      },
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      [
        "› Committing the changes.",
        "$ git add .",
        "$ git commit",
        "  |",
        "  | test message",
        "  |",
      ]
    `);
  });

  it('works', async () => {
    const beforeCommitChanges = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    wrapExecWithDir.mockImplementation(() => vi.fn());
    const formatCommitMessage = vi
      .fn()
      .mockImplementation(() => 'test message');

    await commitChanges({
      config: {
        formatCommitMessage,
        beforeCommitChanges,
      },
      dryRun: false,
      dir: '.',
      nextVersion: '1.2.3',
      releaseType: 'patch',
    });

    expect(wrapExecWithDir).toHaveBeenCalledTimes(1);
    expect(wrapExecWithDir).toHaveBeenCalledWith('.');
    expect(formatCommitMessage).toHaveBeenCalledTimes(1);
    expect(formatCommitMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        version: '1.2.3',
        releaseType: 'patch',
      })
    );
    expect(beforeCommitChanges).toHaveBeenCalledTimes(1);
    expect(beforeCommitChanges).toHaveBeenCalledWith(
      expect.objectContaining({
        exec: expect.any(Function),
        dir: '.',
        nextVersion: '1.2.3',
        releaseType: 'patch',
      })
    );
    expect(run.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "command": "git add .",
          "dir": ".",
        },
      ]
    `);
    expect(run.mock.calls[1]).toMatchInlineSnapshot(`
      [
        {
          "command": "git commit --file=/temp/file/path",
          "dir": ".",
        },
      ]
    `);
  });

  it('passes packages to the hooks', async () => {
    wrapExecWithDir.mockImplementation(() => vi.fn());
    const formatCommitMessage = vi.fn(() => 'chore: release (beta)');
    const beforeCommitChanges = vi.fn(() => Promise.resolve());
    const packages = [{ name: 'a', version: '5.0.0-beta.0' }];
    await commitChanges({
      config: { formatCommitMessage, beforeCommitChanges },
      dryRun: false,
      dir: '.',
      nextVersion: '5.0.0-beta.0',
      prerelease: { preid: 'beta' },
      packages,
    });
    expect(formatCommitMessage).toHaveBeenCalledWith(
      expect.objectContaining({ packages, prerelease: { preid: 'beta' } })
    );
    expect(beforeCommitChanges).toHaveBeenCalledWith(
      expect.objectContaining({ packages })
    );
  });
});
