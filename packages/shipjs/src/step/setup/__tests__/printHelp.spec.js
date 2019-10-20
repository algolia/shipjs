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
      	shipjs setup - Setup Ship.js in your project.

      USAGE
      	npx shipjs setup [--help] [--dir PATH]

      OPTIONS
      	-h, --help
      	  Print this help

      	-d, --dir PATH
      	  Specify the PATH of the repository (default: the current directory).
      ",
      ]
    `);
  });
});
