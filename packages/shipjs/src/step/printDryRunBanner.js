import runStep from './runStep';

export default () =>
  runStep({}, ({ print, bold, warning }) => {
    print(warning(bold('##########################')));
    print(warning(bold('#                        #')));
    print(warning(bold(`#   This is a dry-run!   #`)));
    print(warning(bold('#                        #')));
    print(warning(bold('##########################')));
    print('');
  });
