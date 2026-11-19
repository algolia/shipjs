import { lt, valid } from 'semver';
import { getPrereleaseId, silentExec } from 'shipjs-lib';

import { error, info } from '../../color.js';
import { getTagForVersion } from '../../helper/index.js';
import { exitProcess, print } from '../../util/index.js';
import runStep from '../runStep.js';

function getLatestOnNpm(name, dir) {
  const { code, stdout } = silentExec(`npm view ${name} dist-tags.latest`, {
    dir,
    ignoreError: true,
  });
  const latest = code === 0 ? (stdout || '').trim() : '';
  return valid(latest) ? latest : null;
}

export default ({ config, version, packages, tag, prereleaseTag, dir }) =>
  runStep(
    {
      title: 'Checking the npm dist-tag.',
      skipIf: () => config.guardPublishTag === false,
    },
    () => {
      const problems = [];
      [tag, prereleaseTag].forEach((distTag) => {
        if (!distTag || valid(distTag)) {
          problems.push(
            `\`${distTag}\` is not a valid npm dist-tag (it must not be empty or a version).`
          );
        }
      });

      const tags = { tag, prereleaseTag };
      const toPublish =
        packages.length > 0 ? packages : [{ name: null, version }];
      toPublish.forEach(({ name, version: packageVersion }) => {
        const distTag = getTagForVersion(packageVersion, tags);
        const label = name ? `${name}@${packageVersion}` : packageVersion;
        if (distTag !== 'latest') {
          return;
        }
        if (getPrereleaseId(packageVersion)) {
          problems.push(
            `${label} is a prerelease and would be published under \`latest\`.`
          );
          return;
        }
        const latest = name ? getLatestOnNpm(name, dir) : null;
        if (latest && lt(packageVersion, latest)) {
          problems.push(
            `${label} would move \`latest\` back from ${latest}. Publish it under another dist-tag (see \`getPublishTag\`).`
          );
        }
      });

      if (problems.length > 0) {
        print(error('Refusing to publish:'));
        problems.forEach((problem) => print(`  - ${problem}`));
        print(
          info(
            'Set `guardPublishTag: false` in ship.config.js to skip this check.'
          )
        );
        exitProcess(1);
      }
    }
  );
