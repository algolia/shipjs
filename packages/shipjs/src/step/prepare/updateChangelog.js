import path from 'path';
import fs from 'fs';
import conventionalChangelogCore from 'conventional-changelog-core';
import conventionalChangelogPresetLoader from 'conventional-changelog-preset-loader';
import tempfile from 'tempfile';
import addStream from 'add-stream';
import merge from 'deepmerge';
import runStep from '../runStep';
import { parseArgs } from '../../util';

export default ({
  config,
  firstRelease,
  nextVersion,
  releaseCount,
  revisionRange,
  dir,
  dryRun,
}) =>
  runStep(
    {
      title: 'Updating the changelog.',
      skipIf: () => config.updateChangelog !== true,
    },
    () => {
      if (dryRun) {
        return Promise.resolve();
      }
      return new Promise((resolve, reject) => {
        const { conventionalChangelogArgs } = config;
        prepareParams({
          dir,
          conventionalChangelogArgs,
          releaseCount,
          firstRelease,
          revisionRange,
          reject,
        }).then(({ args, gitRawCommitsOpts, templateContext }) => {
          runConventionalChangelog({
            args,
            templateContext: {
              ...templateContext,
              version: nextVersion,
            },
            gitRawCommitsOpts,
            resolve,
            reject,
            dir,
          });
        });
      });
    }
  );

// The following implementation is mostly based on this file:
// https://github.com/conventional-changelog/conventional-changelog/blob/master/packages/conventional-changelog-cli/cli.js
const argSpec = {
  '--infile': String,
  '--outfile': String,
  '--same-file': Boolean,
  '--preset': String,
  '--pkg': String,
  '--append': Boolean,
  '--release-count': Number,
  '--output-unreleased': Boolean,
  '--verbose': Boolean,
  '--config': String,
  '--context': String,
  '--lerna-package': String,
  '--tag-prefix': String,
  '--commit-path': String,

  // Aliases
  '-i': '--infile',
  '-o': '--outfile',
  '-s': '--same-file',
  '-p': '--preset',
  '-k': '--pkg',
  '-a': '--append',
  '-r': '--release-count',
  '-u': '--output-unreleased',
  '-v': '--verbose',
  '-n': '--config',
  '-c': '--context',
  '-l': '--lerna-package',
  '-t': '--tag-prefix',
};

export async function prepareParams({
  dir,
  conventionalChangelogArgs,
  releaseCount,
  firstRelease,
  revisionRange,
  reject,
}) {
  const args = parseArgs(argSpec, (conventionalChangelogArgs || '').split(' '));
  if (args.infile && args.infile === args.outfile) {
    args.sameFile = true;
  } else if (args.sameFile) {
    if (args.infile) {
      args.outfile = args.infile;
    } else {
      reject(new Error('infile must be provided if same-file flag presents.'));
      return undefined;
    }
  }
  args.infile = path.resolve(dir, args.infile);
  args.outfile = path.resolve(dir, args.outfile);
  if (releaseCount !== undefined) {
    args.releaseCount = releaseCount;
  }
  if (firstRelease !== undefined) {
    args.firstRelease = firstRelease;
  }
  args.pkg = {
    path: args.pkg || dir,
  };
  const [from, to] = revisionRange.split('..');
  const gitRawCommitsOpts = {
    from,
    to,
  };
  if (args.commitPath) {
    gitRawCommitsOpts.path = args.commitPath;
  }
  const templateContext =
    args.context && require(path.resolve(dir, args.context));
  args.config = args.config ? require(path.resolve(dir, args.config)) : {};
  if (args.preset) {
    try {
      args.config = merge(
        await conventionalChangelogPresetLoader(args.preset),
        args.config
      );
    } catch (err) {
      /* eslint-disable no-console */
      if (typeof args.preset === 'object') {
        console.error(`Preset: "${args.preset.name}" ${err.message}`);
      } else if (typeof args.preset === 'string') {
        console.error(`Preset: "${args.preset}" ${err.message}`);
      } else {
        console.error(`Preset: ${err.message}`);
      }
      /* eslint-enable no-console */
    }
  }

  return { args, gitRawCommitsOpts, templateContext };
}

function runConventionalChangelog({
  args,
  templateContext,
  gitRawCommitsOpts,
  resolve,
  reject,
  dir,
}) {
  if (!fs.existsSync(args.outfile)) {
    fs.writeFileSync(args.outfile, '');
  }

  const changelogStream = conventionalChangelogCore(
    args,
    templateContext,
    { ...gitRawCommitsOpts, path: dir },
    undefined,
    undefined,
    { path: dir, cwd: dir }
  ).on('error', reject);

  const readStream = fs.createReadStream(args.infile).on('error', reject);
  if (args.sameFile) {
    if (args.append) {
      changelogStream
        .pipe(
          fs.createWriteStream(args.outfile, {
            flags: 'a',
          })
        )
        .on('finish', resolve);
    } else {
      const tmp = tempfile();

      changelogStream
        .pipe(addStream(readStream))
        .pipe(fs.createWriteStream(tmp))
        .on('finish', () => {
          fs.createReadStream(tmp)
            .pipe(fs.createWriteStream(args.outfile))
            .on('finish', resolve);
        });
    }
  } else {
    let outStream;
    if (args.outfile) {
      outStream = fs.createWriteStream(args.outfile);
    } else {
      outStream = process.stdout;
    }

    let stream;
    if (args.append) {
      stream = readStream.pipe(addStream(changelogStream));
    } else {
      stream = changelogStream.pipe(addStream(readStream));
    }

    stream.pipe(outStream).on('finish', resolve);
  }
}
