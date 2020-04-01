import runStep from '../runStep';
import { print } from '../../util';
import { bold, underline } from '../../color';

export default () =>
  runStep({}, () => {
    const indent = (line) => `\t${line}`;

    const help = `--help`;
    const dir = `--dir ${underline('PATH')}`;
    const yes = `--yes`;
    const dryRun = `--dry-run`;
    const noBrowse = `--no-browse`;
    const commitFrom = `--commit-from ${underline('SHA')}`;
    const all = [help, dir, yes, dryRun, noBrowse, commitFrom]
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
    ];
    print(messages.join('\n'));
  });
