import runStep from '../runStep';
import { print } from '../../util';
import { bold, underline } from '../../color';

export default () =>
  runStep({}, () => {
    const indent = line => `\t${line}`;

    const help = `--help`;
    const dir = `--dir ${underline('PATH')}`;
    const all = [help, dir].map(x => `[${x}]`).join(' ');

    const messages = [
      bold('NAME'),
      indent('shipjs setup - Setup Ship.js in your project.'),
      '',
      bold('USAGE'),
      indent(`npx shipjs setup ${all}`),
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
    ];
    print(messages.join('\n'));
  });
