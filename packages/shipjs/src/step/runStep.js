import { print } from '../util';
import { bold, slateblue } from '../color';

export default function runStep({ title, skipIf }, stepFn) {
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  if (skipIf && typeof skipIf === 'function' && skipIf() === true) {
    return null;
  }
  return stepFn();
}
