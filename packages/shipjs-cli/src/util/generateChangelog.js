import standardChangelog from 'standard-changelog';
import path from 'path';
import fs from 'fs';
import addStream from 'add-stream';
import tempfile from 'tempfile';
import rimraf from 'rimraf';
import stream from 'stream';
import { grey, error } from '../color';

const Readable = stream.Readable;

// eslint-disable-next-line no-console
const consoleWarn = console.warn;
// eslint-disable-next-line no-console
const consoleError = console.error;

export default function generateChangelog({ options: orgOptions, dir }) {
  return new Promise(resolve => {
    const infile = orgOptions.infile
      ? path.resolve(dir, orgOptions.infile)
      : undefined;
    const outfile = orgOptions.outfile
      ? path.resolve(dir, orgOptions.outfile)
      : undefined;
    const options = {
      warn: orgOptions.verbose && consoleWarn.bind(console),
      ...orgOptions,
      outfile: orgOptions.sameFile ? outfile || infile : outfile,
      infile,
    };
    const releaseCount = options.firstRelease ? 0 : options.releaseCount;

    const outputError = err => {
      if (options.verbose) {
        consoleError(grey(err.stack));
      } else {
        consoleError(error(err.toString()));
      }
      process.exit(1); // eslint-disable-line no-process-exit
    };

    const changelogStream = standardChangelog(options, undefined, {}).on(
      'error',
      outputError
    );
    standardChangelog.createIfMissing(infile);

    let readStream = null;
    if (releaseCount !== 0) {
      readStream = fs.createReadStream(infile).on('error', outputError);
    } else {
      readStream = new Readable();
      readStream.push(null);
    }

    if (options.append) {
      changelogStream
        .pipe(
          fs.createWriteStream(options.outfile, {
            flags: 'a',
          })
        )
        .on('finish', function() {
          standardChangelog.checkpoint('appended changes to %s', [
            options.outfile,
          ]);
          resolve();
        });
    } else {
      const tmp = tempfile();

      changelogStream
        .pipe(addStream(readStream))
        .pipe(fs.createWriteStream(tmp))
        .on('finish', function() {
          fs.createReadStream(tmp)
            .pipe(fs.createWriteStream(options.outfile))
            .on('finish', function() {
              standardChangelog.checkpoint('output changes to %s', [
                options.outfile,
              ]);
              rimraf.sync(tmp);
              resolve();
            });
        });
    }
  });
}
