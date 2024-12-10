import { prerelease } from 'semver';

export default function getReleaseTag(version) {
  const [releaseTag] = prerelease(version) || [];
  return releaseTag || 'latest';
}
