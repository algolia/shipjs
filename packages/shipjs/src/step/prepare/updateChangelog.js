import fs from 'fs';
import path from 'path';

import { ConventionalChangelog } from 'conventional-changelog';
import tempfile from 'tempfile';

import { parseArgs } from '../../util/index.js';
import runStep from '../runStep.js';

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
    async () => {
      if (dryRun) {
        return;
      }

      const { conventionalChangelogArgs } = config;
      const { args, gitCommitsParams } = await prepareParams({
        dir,
        conventionalChangelogArgs,
        releaseCount,
        firstRelease,
        revisionRange,
      });

      await runConventionalChangelog({
        args,
        gitCommitsParams,
        nextVersion,
        dir,
      });
    }
  );

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
}) {
  const args = parseArgs(argSpec, (conventionalChangelogArgs || '').split(' '));

  if (args.infile && args.infile === args.outfile) {
    args.sameFile = true;
  } else if (args.sameFile) {
    if (args.infile) {
      args.outfile = args.infile;
    } else {
      throw new Error('infile must be provided if same-file flag presents.');
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

  const [from, to] = revisionRange.split('..');
  const gitCommitsParams = { from, to };

  if (args.commitPath) {
    gitCommitsParams.path = args.commitPath;
  }

  return { args, gitCommitsParams };
}

async function runConventionalChangelog({
  args,
  gitCommitsParams,
  nextVersion,
  dir,
}) {
  if (!fs.existsSync(args.outfile)) {
    fs.writeFileSync(args.outfile, '');
  }

  const generator = new ConventionalChangelog(dir).readPackage(
    args.pkg || dir
  );

  if (args.preset) {
    generator.loadPreset(args.preset);
  }

  if (args.config) {
    const customConfig = (await import(path.resolve(dir, args.config))).default;
    generator.config(customConfig);
  }

  if (args.context) {
    const context = (await import(path.resolve(dir, args.context))).default;
    generator.context({ ...context, version: nextVersion });
  } else {
    generator.context({ version: nextVersion });
  }

  if (args.tagPrefix) {
    generator.tags(args.tagPrefix);
  }

  if (args.lernaPackage) {
    generator.lernaPackage(args.lernaPackage);
  }

  generator.commits(gitCommitsParams);

  generator.options({
    releaseCount: args.releaseCount,
    outputUnreleased: args.outputUnreleased,
  });

  // Collect changelog content
  let newChangelog = '';
  for await (const chunk of generator.write()) {
    newChangelog += chunk;
  }

  // Read existing changelog
  const existingChangelog = fs.existsSync(args.infile)
    ? fs.readFileSync(args.infile, 'utf-8')
    : '';

  // Write combined changelog
  if (args.sameFile) {
    if (args.append) {
      fs.appendFileSync(args.outfile, newChangelog);
    } else {
      // Prepend new changelog to existing
      const tmp = tempfile();
      fs.writeFileSync(tmp, newChangelog + existingChangelog);
      fs.copyFileSync(tmp, args.outfile);
      fs.unlinkSync(tmp);
    }
  } else {
    let content;
    if (args.append) {
      content = existingChangelog + newChangelog;
    } else {
      content = newChangelog + existingChangelog;
    }
    fs.writeFileSync(args.outfile, content);
  }
}
