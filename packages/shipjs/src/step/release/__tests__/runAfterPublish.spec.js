import { print } from '../../../util';
import runAfterPublish from '../runAfterPublish';
import { mockPrint } from '../../../../tests/util';

describe('runAfterPublish', () => {
  it('works', async () => {
    const afterPublish = jest.fn();
    await runAfterPublish({
      config: {
        afterPublish,
      },
      dir: '.',
      dryRun: false,
    });
    expect(afterPublish).toHaveBeenCalledTimes(1);
    expect(afterPublish.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "dir": ".",
        "exec": undefined,
      }
    `);
  });

  it('works in dry mode', async () => {
    const output = [];
    mockPrint(print, output);
    await runAfterPublish({
      config: {
        afterPublish: () => '',
      },
      dir: '.',
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Running \\"afterPublish\\" callback.",
        "-> execute afterPublish() callback.",
      ]
    `);
  });
});
