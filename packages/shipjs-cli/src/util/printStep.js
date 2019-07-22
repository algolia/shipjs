import { magenta, bold } from '../color';
import print from './print';

export default function printStep(message) {
  print(magenta(bold(`- ${message}`)));
}
