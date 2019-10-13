import commitChanges from '../commitChanges';
import { wrapExecWithDir, run, print } from '../../../util';
import { info } from '../../../color';
jest.mock('temp-write', () => ({
  sync: () => '/temp/file/path',
}));
jest.mock('../../../util');
jest.mock('../../../color');

beforeAll(() => {
  info.mockImplementation(str => str);
});

describe('commitChanges', () => {
  it('works in dry mode', () => {
    const result = [];
    print.mockImplementation((...args) => {
      result.push(args.join(' '));
    });
    commitChanges({
      config: {
        formatCommitMessage: () => 'test message',
      },
      dryRun: true,
    });
    expect(result).toMatchInlineSnapshot(`
      Array [
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
