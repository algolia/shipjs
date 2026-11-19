import { mockPrint } from '../../../../tests/util/index.js';
import { print } from '../../../util/index.js';
import printHelp from '../printHelp.js';

describe('printHelp', () => {
  it('prints help', () => {
    const output = [];
    mockPrint(print, output);
    printHelp();
    expect(output).toMatchInlineSnapshot(`
      [
        "NAME
      	shipjs prepare - Prepare a release.

      USAGE
      	shipjs prepare [--help] [--dir PATH] [--yes] [--dry-run] [--no-browse] [--commit-from SHA] [--preid ID] [--graduate]

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

      	-c, --commit-from SHA
      	  Specify from which commit you want to release.

      	--preid ID
      	  Prepare a prerelease on the ID channel (e.g. beta, alpha, rc, next).
      	  It is published under the npm dist-tag of the same name.

      	--graduate
      	  Release the current prerelease as its stable version (e.g. 5.0.0-rc.2 -> 5.0.0).",
      ]
    `);
  });
});
