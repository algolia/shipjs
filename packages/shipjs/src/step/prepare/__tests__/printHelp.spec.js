import { print } from '../../../util';
import { bold, underline } from '../../../color';
import printHelp from '../printHelp';
jest.mock('../../../util');
jest.mock('../../../color');

describe('printHelp', () => {
  it('prints help', () => {
    const output = [];
    bold.mockImplementation(str => str);
    underline.mockImplementation(str => str);
    print.mockImplementation((...args) => output.push(args.join(' ')));
    printHelp();
    expect(output).toMatchInlineSnapshot(`
      Array [
        "NAME
      	shipjs prepare - Prepare a release.

      USAGE
      	shipjs prepare [--help] [--dir PATH] [--yes] [--first-release] [--release-count COUNT] [--dry-run] [--no-browse]

      OPTIONS
      	-h, --help
      	  Print this help

      	-d, --dir PATH
      	  Specify the PATH of the repository (default: the current directory).

      	-y, --yes
      	  Skip all the interactive prompts and use the default values.

      	-f, --first-release
      	  Generate the CHANGELOG for the first time

      	-r, --release-count COUNT
      	  How many releases to be generated from the latest

      	-D, --dry-run
      	  Displays the steps without actually doing them.

      	-N, --no-browse
      	  Do not open a browser after creating a pull request.
      ",
      ]
    `);
  });
});
