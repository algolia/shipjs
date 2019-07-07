import { BASE_BRANCH, RELEASE_BRANCH } from '../const';
import validate from './validate';

export default function prepare({
  baseBranch = BASE_BRANCH,
  releaseBranch = RELEASE_BRANCH,
} = {}) {
  const validationResult = validate({ baseBranch });
  if (validationResult !== true) {
    return validationResult;
  }

  return null;
}
