import {
  GIT_COMMIT_PREFIX_PATCH,
  GIT_COMMIT_PREFIX_MINOR,
  GIT_COMMIT_BREAKING_CHANGE,
} from '../const';
import { inc, prerelease } from 'semver';
import getCurrentVersion from './getCurrentVersion';
import silentExec from '../shell/silentExec';

export function getNextVersionFromCommitMessages(version, titles, bodies) {
  if (prerelease(version)) {
    return inc(version, 'prerelease');
  }
  if (bodies.toUpperCase().includes(GIT_COMMIT_BREAKING_CHANGE)) {
    return inc(version, 'major');
  }
  let patch = false;
  let minor = false;
  titles.split('\n').forEach(rawTitle => {
    const title = rawTitle.trim();
    if (!title) {
      return;
    }
    const match = title.match(/(.*?)(\(.*?\))?:.*/);
    if (!match || !match[1]) {
      throw new Error(`Invalid commit message format.\n  > ${title}`);
    }
    const prefix = match[1].toLowerCase();
    if (GIT_COMMIT_PREFIX_PATCH.has(prefix)) {
      patch = true;
    } else if (GIT_COMMIT_PREFIX_MINOR.has(prefix)) {
      minor = true;
    } else {
      throw new Error(`Out of convention.\n  > ${title}`);
    }
  });

  if (minor) {
    return inc(version, 'minor');
  } else if (patch) {
    return inc(version, 'patch');
  } else {
    return null;
  }
}

function getTitles(version, dir) {
  const cmd = `git log v${version}..HEAD --pretty=format:"%s"`;
  return silentExec(cmd, { dir })
    .toString()
    .trim();
}

function getBodies(version, dir) {
  const cmd = `git log v${version}..HEAD --pretty=format:"%b"`;
  return silentExec(cmd, { dir })
    .toString()
    .trim();
}

export default function getNextVersion(dir = '.') {
  const version = getCurrentVersion(dir);
  const titles = getTitles(version, dir);
  const bodies = getBodies(version, dir);
  return getNextVersionFromCommitMessages(version, titles, bodies);
}
