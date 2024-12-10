import runStep from './runStep.js';
import { print } from '../util/index.js';
import { bold, warning } from '../color.js';

export default () =>
  runStep({}, () => {
    print(warning(bold('##########################')));
    print(warning(bold('#                        #')));
    print(warning(bold(`#   This is a dry-run!   #`)));
    print(warning(bold('#                        #')));
    print(warning(bold('##########################')));
    print('');
  });
