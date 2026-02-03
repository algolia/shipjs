import { print } from '../../../util/index.js';
import printHelp from '../printHelp.js';
import { mockPrint } from '../../../../tests/util/index.js';

describe('printHelp', () => {
  it('prints help', () => {
    const output = [];
    mockPrint(print, output);
    printHelp();
    expect(output).toMatchInlineSnapshot(`
      [
        "NAME
      	shipjs setup - Setup Ship.js in your project.

      USAGE
      	npx shipjs setup [--help] [--dir PATH] [--dry-run]

      OPTIONS
      	-h, --help
      	  Print this help

      	-d, --dir PATH
      	  Specify the PATH of the repository (default: the current directory).

      	-D, --dry-run
      	  Displays the steps without actually doing them.
      ",
      ]
    `);
  });
});
