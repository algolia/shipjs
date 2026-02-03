import { run } from '../../../util/index.js';
import checkoutToStagingBranch from '../checkoutToStagingBranch.js';

describe('checkoutToStagingBranch', () => {
  it('works', () => {
    checkoutToStagingBranch({
      stagingBranch: 'abc',
      dir: '.',
      dryRun: false,
    });
    expect(run).toHaveBeenCalledTimes(1);
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "command": "git checkout -b abc",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
