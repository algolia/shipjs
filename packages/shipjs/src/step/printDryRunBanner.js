import runStep from './runStep';
import { print } from '../util';
import { bold, warning } from '../color';

export default () =>
  runStep({}, () => {
    print(warning(bold('##########################')));
    print(warning(bold('#                        #')));
    print(warning(bold(`#   This is a dry-run!   #`)));
    print(warning(bold('#                        #')));
    print(warning(bold('##########################')));
    print('');
  });
