import { print } from '../../../util/index.js';
import runAfterPublish from '../runAfterPublish.js';
import { mockPrint } from '../../../../tests/util/index.js';

describe('runAfterPublish', () => {
  it('works', async () => {
    const afterPublish = jest.fn();
    await runAfterPublish({
      version: '1.2.3',
      releaseTag: 'latest',
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
        "releaseTag": "latest",
        "version": "1.2.3",
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
