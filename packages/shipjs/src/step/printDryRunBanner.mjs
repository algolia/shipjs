import runStep from './runStep.mjs';
import { print } from '../util/index.mjs';
import { bold, warning } from '../color.mjs';

export default () =>
  runStep({}, () => {
    print(warning(bold('##########################')));
    print(warning(bold('#                        #')));
    print(warning(bold(`#   This is a dry-run!   #`)));
    print(warning(bold('#                        #')));
    print(warning(bold('##########################')));
    print('');
  });
