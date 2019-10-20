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

    await commitChanges({
      config: {
        formatCommitMessage: () => 'test message',
        beforeCommitChanges,
      },
      dryRun: false,
      dir: '.',
    });

    expect(wrapExecWithDir).toHaveBeenCalledTimes(1);
    expect(wrapExecWithDir).toHaveBeenCalledWith('.');
    expect(beforeCommitChanges).toHaveBeenCalledTimes(1);
    expect(beforeCommitChanges).toHaveBeenCalledWith(
      expect.objectContaining({
        exec: expect.any(Function),
        dir: '.',
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
