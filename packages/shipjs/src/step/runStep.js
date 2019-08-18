import { exec } from 'shipjs-lib'; // eslint-disable-line import/no-unresolved
import print from '../util/print';
import exitProcess from '../util/exitProcess';
import wrapRun from '../util/wrapRun';
import { info, warning, error, bold, underline, slateblue } from '../color';

const makeSpaces = num => ' '.repeat(num);
const indentPrint = indent => (...args) => print(makeSpaces(indent), ...args);

export default function runStep({ title }, stepFn) {
  if (title) {
    print(bold(slateblue(`› ${title}`)));
  }
  return stepFn({
    run: wrapRun({ exec, print, info, error }),
    print: indentPrint(2),
    info,
    warning,
    error,
    bold,
    underline,
    exitProcess,
  });
}
