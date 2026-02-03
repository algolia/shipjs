import { vi } from 'vitest';

import { mockPrint } from '../../../../tests/util/index.js';
import { print } from '../../../util/index.js';
import runBeforePublish from '../runBeforePublish.js';

describe('runBeforePublish', () => {
  it('works', async () => {
    const beforePublish = vi.fn();
    await runBeforePublish({
      config: {
        beforePublish,
      },
      dir: '.',
      dryRun: false,
    });
    expect(beforePublish).toHaveBeenCalledTimes(1);
    expect(beforePublish.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
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
      [
        "› Running "beforePublish" callback.",
        "-> execute beforePublish() callback.",
      ]
    `);
  });
});
