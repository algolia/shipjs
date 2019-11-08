import path from 'path';
import globby from 'globby';
import tempWrite from 'temp-write';
import { quote } from 'shell-quote';
import runStep from '../runStep';
import { run } from '../../util';
import { getChangelog, hubInstalled, hubConfigured } from '../../helper';

const cannotUseHub = () => !hubInstalled() || !hubConfigured();

export default async ({ version, config, dir, dryRun }) =>
  await runStep(
    {
      title: 'Creating a release on GitHub repository',
      skipIf: cannotUseHub,
    },
    async () => {
      const {
        getTagName,
        releases: { assetsToUpload } = {},
        updateChangelog,
        extractChangelog,
      } = config;
      const tagName = getTagName({ version });
      const args = [];

      // extract matching changelog
      const getChangelogFn = updateChangelog ? getChangelog : extractChangelog;
      const changelog = getChangelogFn({ version, dir });
      const content = `${tagName}\n\n${changelog || ''}`;
      const exportedPath = tempWrite.sync(content);
      args.push('-F', quote([exportedPath]));

      // handle assets
      if (assetsToUpload) {
        const assetPaths = [];

        if (typeof assetsToUpload === 'function') {
          // function
          //   assetsToUpload: ({dir, version, tagName}) => [...]
          const files = await Promise.resolve(
            assetsToUpload({ dir, version, tagName })
          );
          assetPaths.push(...files);
        } else if (Array.isArray(assetsToUpload) && assetsToUpload.length > 0) {
          // list
          //   assetsToUpload: ['package.json', 'dist/*.zip']
          for (const asset of assetsToUpload) {
            const files = await globby(asset, { cwd: dir });
            if (files) {
              assetPaths.push(...files);
            }
          }
        } else if (typeof assetsToUpload === 'string') {
          // string
          //   assetsToUpload: 'archive.zip'
          const files = await globby(assetsToUpload, { cwd: dir });
          if (files) {
            assetPaths.push(...files);
          }
        }

        for (const asset of assetPaths) {
          args.push('-a', quote([path.resolve(dir, asset)]));
        }
      }

      // create GitHub release
      const hubCommand = ['hub', 'release', 'create'];
      const command = [...hubCommand, ...args, tagName].join(' ');
      run({ command, dir, dryRun });
    }
  );
