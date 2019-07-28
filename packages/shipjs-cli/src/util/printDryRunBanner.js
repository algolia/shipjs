import print from './print';
import { warning, bold } from '../color';

export default function printDryRunBanner() {
  print(warning(bold('##########################')));
  print(warning(bold('#                        #')));
  print(warning(bold(`#   This is a dry-run!   #`)));
  print(warning(bold('#                        #')));
  print(warning(bold('##########################')));
  print('');
}
