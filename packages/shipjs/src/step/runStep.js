import { bold, slateblue } from '../color.js';
import { print } from '../util/index.js';

export default function runStep({ title, skipIf }, stepFn) {
  if (skipIf && typeof skipIf === 'function' && skipIf() === true) {
    return null;
  }
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  return stepFn();
}
