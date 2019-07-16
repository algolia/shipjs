import standardChangelog from 'standard-changelog';
import path from 'path';
import fs from 'fs';
import addStream from 'add-stream';
import tempfile from 'tempfile';
import rimraf from 'rimraf';
import stream from 'stream';
import { grey, error } from '../color';

const Readable = stream.Readable;

export default function generateChangelog({ options: orgOptions, dir }) {
  return new Promise((resolve, reject) => {
    const infile = orgOptions.infile
      ? path.resolve(dir, orgOptions.infile)
      : undefined;
    const outfile = orgOptions.outfile
      ? path.resolve(dir, orgOptions.outfile)
      : undefined;
    const options = {
      warn: orgOptions.verbose && console.warn.bind(console),
      ...orgOptions,
      outfile: orgOptions.sameFile ? outfile || infile : outfile,
      infile,
    };
    const releaseCount = options.firstRelease ? 0 : options.releaseCount;

    const outputError = err => {
      if (options.verbose) {
        console.error(grey(err.stack));
      } else {
        console.error(error(err.toString()));
      }
      process.exit(1);
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
          fs.createWriteStream(outfile, {
            flags: 'a',
          })
        )
        .on('finish', function() {
          standardChangelog.checkpoint('appended changes to %s', [outfile]);
          resolve();
        });
    } else {
      var tmp = tempfile();

      changelogStream
        .pipe(addStream(readStream))
        .pipe(fs.createWriteStream(tmp))
        .on('finish', function() {
          fs.createReadStream(tmp)
            .pipe(fs.createWriteStream(outfile))
            .on('finish', function() {
              standardChangelog.checkpoint('output changes to %s', [outfile]);
              rimraf.sync(tmp);
              resolve();
            });
        });
    }
  });
}
