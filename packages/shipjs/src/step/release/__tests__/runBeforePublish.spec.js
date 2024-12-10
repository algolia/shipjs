import { print } from '../../../util/index.js';
import runBeforePublish from '../runBeforePublish.js';
import { mockPrint } from '../../../../tests/util/index.js';

describe('runBeforePublish', () => {
  it('works', async () => {
    const beforePublish = jest.fn();
    await runBeforePublish({
      config: {
        beforePublish,
      },
      dir: '.',
      dryRun: false,
    });
    expect(beforePublish).toHaveBeenCalledTimes(1);
    expect(beforePublish.mock.calls[0][0]).toMatchInlineSnapshot(`
      Object {
        "dir": ".",
        "exec": undefined,
      }
    `);
  });

  it('works in dry mode', async () => {
    const output = [];
    mockPrint(print, output);
    await runBeforePublish({
      config: {
        beforePublish: () => '',
      },
      dir: '.',
      dryRun: true,
    });
    expect(output).toMatchInlineSnapshot(`
      Array [
        "› Running \\"beforePublish\\" callback.",
        "-> execute beforePublish() callback.",
      ]
    `);
  });
});
