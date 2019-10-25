import printHelp from '../step/setup/printHelp';
import askQuestions from '../step/setup/askQuestions';
import addDevDependencies from '../step/setup/addDevDependencies';
import addScriptsToPackageJson from '../step/setup/addScriptsToPackageJson';
import addShipConfig from '../step/setup/addShipConfig';
import addCircleCIConfig from '../step/setup/addCircleCIConfig';
import { print } from '../util';
import { success } from '../color';

async function setup({ help = false, dir = '.' }) {
  if (help) {
    printHelp();
    return;
  }
  const {
    baseBranch,
    releaseBranch,
    configureCircleCI,
    scheduleCircleCI,
    cronExpr,
    useMonorepo,
    mainVersionFile,
    packagesToBump,
    packagesToPublish,
  } = await askQuestions({ dir });
  const outputs = [
    addDevDependencies({ dependencies: ['shipjs'], dir }),
    addScriptsToPackageJson({ dir }),
    await addShipConfig({
      baseBranch,
      releaseBranch,
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
      dir,
    }),
    addCircleCIConfig({
      baseBranch,
      configureCircleCI,
      scheduleCircleCI,
      cronExpr,
      dir,
    }),
  ];

  print('');
  print(success('🎉  FINISHED'));
  outputs.forEach(printMessage => {
    if (printMessage && typeof printMessage === 'function') {
      print('');
      printMessage();
    }
  });
}

const arg = {
  '--dir': String,
  '--help': Boolean,

  // Aliases
  '-d': '--dir',
  '-h': '--help',
};

export default {
  arg,
  fn: setup,
};
