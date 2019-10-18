import { exec } from 'shipjs-lib';
import { print, exitProcess, wrapRun } from '../util';
import { info, warning, error, bold, underline, slateblue } from '../color';

const makeSpaces = num => ' '.repeat(num);
const indentPrint = indent => (...args) => print(makeSpaces(indent), ...args);

export default function runStep({ title, skipIf }, stepFn) {
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  if (skipIf && typeof skipIf === 'function' && skipIf() === true) {
    return null;
  }
  return stepFn({
    run: wrapRun({ exec, print, error }),
    print: indentPrint(2),
    info,
    warning,
    error,
    bold,
    underline,
    exitProcess,
  });
}
