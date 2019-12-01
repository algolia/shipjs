import commitChanges from '../commitChanges';
import { wrapExecWithDir, run, print } from '../../../util';
import { mockPrint } from '../../../../tests/util';
jest.mock('temp-write', () => ({
  sync: () => '/temp/file/path',
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
      Array [
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
    const beforeCommitChanges = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    wrapExecWithDir.mockImplementation(() => jest.fn());
    const formatCommitMessage = jest
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
      Array [
        Object {
          "command": "git add .",
          "dir": ".",
        },
      ]
    `);
    expect(run.mock.calls[1]).toMatchInlineSnapshot(`
      Array [
        Object {
          "command": "git commit --file=/temp/file/path",
          "dir": ".",
        },
      ]
    `);
  });
});
