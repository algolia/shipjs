import { bold, warning } from '../color.js';
import { print } from '../util/index.js';

import runStep from './runStep.js';

export default () =>
  runStep({}, () => {
    print(warning(bold('##########################')));
    print(warning(bold('#                        #')));
    print(warning(bold(`#   This is a dry-run!   #`)));
    print(warning(bold('#                        #')));
    print(warning(bold('##########################')));
    print('');
  });
