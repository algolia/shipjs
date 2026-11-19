import { prerelease } from 'semver';

// `1.0.0-beta.2` -> `beta`, `1.0.0-2` -> null, `1.0.0` -> null
export default function getPrereleaseId(version) {
  const [preid] = prerelease(version) || [];
  return typeof preid === 'string' ? preid : null;
}
