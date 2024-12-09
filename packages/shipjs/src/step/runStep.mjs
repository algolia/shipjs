import { print } from '../util/index.mjs';
import { bold, slateblue } from '../color.mjs';

export default function runStep({ title, skipIf }, stepFn) {
  if (skipIf && typeof skipIf === 'function' && skipIf() === true) {
    return null;
  }
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  return stepFn();
}
