import { run } from '../../../util/index.js';
import installDependencies from '../installDependencies.js';

describe('installDependencies', () => {
  it('runs install command', () => {
    installDependencies({
      config: {
        installCommand: () => `yarn install`,
      },
      dir: '.',
      dryRun: false,
    });
    expect(run.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "command": "yarn install",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
