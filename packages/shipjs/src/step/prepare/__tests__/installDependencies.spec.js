import { run } from '../../../util';
import installDependencies from '../installDependencies';

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
      Object {
        "command": "yarn install",
        "dir": ".",
        "dryRun": false,
      }
    `);
  });
});
