import runStep from '../runStep';
import fs from 'fs';
import path from 'path';
import { print } from '../../util';
import { warning } from '../../color';

export default ({
  baseBranch,
  configureCircleCI,
  scheduleCircleCI,
  cronExpr,
  dir,
}) =>
  runStep(
    {
      title: 'Adding CircleCI configuration',
      skipIf: () => !configureCircleCI,
    },
    () => {
      const filePath = path.resolve(dir, '.circleci', 'config.yml');
      if (fs.existsSync(filePath)) {
        printAlreadyExistsError();
        return;
      }
    }
  );

function printAlreadyExistsError() {
  print(warning('`.circleci/config.yml` already exists!'));
  print('You can configure CircleCI by yourself through these two steps:');
  print(
    '  - Basic setup: https://github.com/algolia/shipjs/blob/master/GUIDE.md#automate-part-3-shipjs-trigger-on-your-ci'
  );
  print(
    '  - Schedule your release: https://github.com/algolia/shipjs/blob/master/GUIDE.md#schedule-your-release'
  );
}
