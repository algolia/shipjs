import printHelp from '../step/setup/printHelp';
import printDryRunBanner from '../step/printDryRunBanner';
import askQuestions from '../step/setup/askQuestions';
import addDevDependencies from '../step/setup/addDevDependencies';
import addScriptsToPackageJson from '../step/setup/addScriptsToPackageJson';
import addShipConfig from '../step/setup/addShipConfig';
import integrations from '../step/setup/CI';
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
    useMonorepo,
    mainVersionFile,
    packagesToBump,
    packagesToPublish,
    isScoped,
    isPublic,
    CIIndex,
    CIConfig,
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
    await integrations[CIIndex].addConfig({
      ...CIConfig,
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
