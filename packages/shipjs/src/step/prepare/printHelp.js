import { bold, underline } from '../../color.js';
import { print } from '../../util/index.js';
import runStep from '../runStep.js';

export default () =>
  runStep({}, () => {
    const indent = (line) => `\t${line}`;

    const help = `--help`;
    const dir = `--dir ${underline('PATH')}`;
    const yes = `--yes`;
    const dryRun = `--dry-run`;
    const noBrowse = `--no-browse`;
    const commitFrom = `--commit-from ${underline('SHA')}`;
    const preid = `--preid ${underline('ID')}`;
    const graduate = `--graduate`;
    const all = [help, dir, yes, dryRun, noBrowse, commitFrom, preid, graduate]
      .map((x) => `[${x}]`)
      .join(' ');

    const messages = [
      bold('NAME'),
      indent('shipjs prepare - Prepare a release.'),
      '',
      bold('USAGE'),
      indent(`shipjs prepare ${all}`),
      '',
      bold('OPTIONS'),
      indent(`-h, ${help}`),
      indent('  Print this help'),
      '',
      indent(`-d, ${dir}`),
      indent(
        `  Specify the ${underline(
          'PATH'
        )} of the repository (default: the current directory).`
      ),
      '',
      indent(`-y, ${yes}`),
      indent('  Skip all the interactive prompts and use the default values.'),
      '',
      indent(`-D, ${dryRun}`),
      indent('  Displays the steps without actually doing them.'),
      '',
      indent(`-N, ${noBrowse}`),
      indent('  Do not open a browser after creating a pull request.'),
      '',
      indent(`-c, ${commitFrom}`),
      indent('  Specify from which commit you want to release.'),
      '',
      indent(preid),
      indent(
        `  Prepare a prerelease on the ${underline(
          'ID'
        )} channel (e.g. beta, alpha, rc, next).`
      ),
      indent('  It is published under the npm dist-tag of the same name.'),
      '',
      indent(graduate),
      indent(
        '  Release the current prerelease as its stable version (e.g. 5.0.0-rc.2 -> 5.0.0).'
      ),
    ];
    print(messages.join('\n'));
  });
