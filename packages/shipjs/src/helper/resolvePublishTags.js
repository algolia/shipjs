import fs from 'fs';
import path from 'path';

import { getPrereleaseId } from 'shipjs-lib';

// Calls `config.getPublishTag` and normalizes what it returns
// (a string, or `{ tag, prereleaseTag }`) to `{ tag, prereleaseTag }`.
// `tag` is for stable versions, `prereleaseTag` for prerelease versions.
export function resolvePublishTags({
  config,
  version,
  releaseTag,
  prerelease = null,
  branch,
  packages,
}) {
  const result = config.getPublishTag({
    version,
    releaseTag,
    prerelease,
    branch,
    packages,
  });
  if (typeof result === 'string') {
    return { tag: result, prereleaseTag: result };
  }
  if (result && typeof result.tag === 'string') {
    return {
      tag: result.tag,
      prereleaseTag:
        typeof result.prereleaseTag === 'string'
          ? result.prereleaseTag
          : result.tag,
    };
  }
  throw new Error(
    '`getPublishTag` must return a string or `{ tag, prereleaseTag }`.'
  );
}

// The dist-tag a given version will be published under.
export function getTagForVersion(version, { tag, prereleaseTag }) {
  return getPrereleaseId(version) ? prereleaseTag : tag;
}

// The dist-tag for the package in `dir`, from the version in its package.json.
export function getTagForDir(dir, tags) {
  if (tags.tag === tags.prereleaseTag) {
    return tags.tag;
  }
  const filePath = path.resolve(dir, 'package.json');
  if (!fs.existsSync(filePath)) {
    return tags.tag;
  }
  const { version } = JSON.parse(fs.readFileSync(filePath).toString());
  return getTagForVersion(version, tags);
}
