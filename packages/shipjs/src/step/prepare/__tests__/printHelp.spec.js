import { print } from '../../../util';
import printHelp from '../printHelp';
import { mockPrint } from '../../../../tests/util';

describe('printHelp', () => {
  it('prints help', () => {
    const output = [];
    mockPrint(print, output);
    printHelp();
    expect(output).toMatchInlineSnapshot(`
      Array [
        "NAME
      	shipjs prepare - Prepare a release.

      USAGE
      	shipjs prepare [--help] [--dir PATH] [--yes] [--dry-run] [--no-browse]

      OPTIONS
      	-h, --help
      	  Print this help

      	-d, --dir PATH
      	  Specify the PATH of the repository (default: the current directory).

      	-y, --yes
      	  Skip all the interactive prompts and use the default values.

      	-D, --dry-run
      	  Displays the steps without actually doing them.

      	-N, --no-browse
      	  Do not open a browser after creating a pull request.
      ",
      ]
    `);
  });
});
