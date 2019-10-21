import printHelp from '../step/setup/printHelp';
import askQuestions from '../step/setup/askQuestions';
import addDevDependencies from '../step/setup/addDevDependencies';
import addScriptsToPackageJson from '../step/setup/addScriptsToPackageJson';
import addShipConfig from '../step/setup/addShipConfig';
import addCircleCIConfig from '../step/setup/addCircleCIConfig';

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

  addDevDependencies({ dependencies: ['shipjs'], dir });
  addScriptsToPackageJson({ dir });
  addShipConfig({
    baseBranch,
    releaseBranch,
    useMonorepo,
    mainVersionFile,
    packagesToBump,
    packagesToPublish,
    dir,
  });
  addCircleCIConfig({
    baseBranch,
    configureCircleCI,
    scheduleCircleCI,
    cronExpr,
    dir,
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
