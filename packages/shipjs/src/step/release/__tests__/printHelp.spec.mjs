import { print } from '../../../util/index.mjs';
import { mockPrint } from '../../../../tests/util/index.mjs';
import printHelp from '../printHelp.mjs';

describe('printHelp', () => {
  it('works', () => {
    const output = [];
    mockPrint(print, output);
    printHelp();
    expect(output).toMatchInlineSnapshot(`
      Array [
        "NAME
      	shipjs trigger - Trigger release.

      USAGE
      	shipjs prepare [--help] [--dir PATH] [--dry-run]

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
