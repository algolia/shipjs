import print from './print';

const makeSpaces = (num) => ' '.repeat(num);
const indentPrint = (indent) => (...args) => print(makeSpaces(indent), ...args);
const indentedPrint = indentPrint(2);

export default indentedPrint;
