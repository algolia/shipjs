import { print } from '../util';
import { bold, slateblue } from '../color';

export default function runStep({ title, skipIf }, stepFn) {
  if (skipIf && typeof skipIf === 'function' && skipIf() === true) {
    return null;
  }
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  return stepFn();
}
