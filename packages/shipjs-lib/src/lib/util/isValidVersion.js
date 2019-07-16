import { valid } from 'semver';

export default function isValidVersion(version) {
  return valid(version);
}
