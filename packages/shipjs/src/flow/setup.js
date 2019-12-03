import printHelp from '../step/setup/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import askQuestions from '../step/setup/askQuestions';
import addDevDependencies from '../step/setup/addDevDependencies';
import addScriptsToPackageJson from '../step/setup/addScriptsToPackageJson';
import addShipConfig from '../step/setup/addShipConfig';
import addCircleCIConfig from '../step/setup/addCircleCIConfig';
import { print } from '../util';
import { success } from '../color';

async function setup({ help = false, dir = '.', dryRun = false }) {
  if (help) {
    printHelp();
    return;
  }
  if (dryRun) {
    printDryRunBanner();
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
    isScoped,
    isPublic,
  } = await askQuestions({ dir });
  const outputs = [
    addDevDependencies({ dependencies: ['shipjs'], dir, dryRun }),
    await addScriptsToPackageJson({ dir, dryRun }),
    await addShipConfig({
      isScoped,
      isPublic,
      baseBranch,
      releaseBranch,
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
      dir,
      dryRun,
    }),
    addCircleCIConfig({
      baseBranch,
      configureCircleCI,
      scheduleCircleCI,
      cronExpr,
      dir,
      dryRun,
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
  '--dry-run': Boolean,

  // Aliases
  '-d': '--dir',
  '-h': '--help',
  '-D': '--dry-run',
};

export default {
  arg,
  fn: setup,
};
