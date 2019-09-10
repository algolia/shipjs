import runStep from '../runStep';

export default () =>
  runStep({}, ({ print, bold, underline }) => {
    const indent = line => `\t${line}`;

    const help = `--help`;
    const dir = `--dir ${underline('PATH')}`;
    const yes = `--yes`;
    const firstRelease = `--first-release`;
    const releaseCount = `--release-count ${underline('COUNT')}`;
    const dryRun = `--dry-run`;
    const noBrowse = `--no-browse`;
    const all = [help, dir, yes, firstRelease, releaseCount, dryRun, noBrowse]
      .map(x => `[${x}]`)
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
      indent(`-f, ${firstRelease}`),
      indent('  Generate the CHANGELOG for the first time'),
      '',
      indent(`-r, ${releaseCount}`),
      indent('  How many releases to be generated from the latest'),
      '',
      indent(`-D, ${dryRun}`),
      indent('  Displays the steps without actually doing them.'),
      '',
      indent(`-N, ${noBrowse}`),
      indent('  Do not open a browser after creating a pull request.'),
      '',
    ];
    print(messages.join('\n'));
  });
