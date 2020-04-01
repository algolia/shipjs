import runStep from '../runStep';
import { print } from '../../util';
import { bold, underline } from '../../color';

export default () =>
  runStep({}, () => {
    const indent = (line) => `\t${line}`;
    const help = `--help`;
    const dir = `--dir ${underline('PATH')}`;
    const dryRun = `--dry-run`;
    const all = [help, dir, dryRun].map((x) => `[${x}]`).join(' ');

    const messages = [
      bold('NAME'),
      indent('shipjs trigger - Trigger release.'),
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
      indent(`-D, ${dryRun}`),
      indent('  Displays the steps without actually doing them.'),
      '',
    ];
    print(messages.join('\n'));
  });
