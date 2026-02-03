import { success, bold } from '../color.js';
import printDryRunBanner from '../step/printDryRunBanner.js';
import addDevDependencies from '../step/setup/addDevDependencies.js';
import addScriptsToPackageJson from '../step/setup/addScriptsToPackageJson.js';
import addShipConfig from '../step/setup/addShipConfig.js';
import askQuestions from '../step/setup/askQuestions.js';
import printHelp from '../step/setup/printHelp.js';
import { print } from '../util/index.js';

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
    useMonorepo,
    mainVersionFile,
    packagesToBump,
    packagesToPublish,
    isScoped,
    isPublic,
    ciIntegration,
    ciConfig,
  } = await askQuestions({ dir });
  const outputs = [
    addDevDependencies({ dependencies: ['shipjs'], dir, dryRun }),
    await addScriptsToPackageJson({ dir, dryRun }),
    await addShipConfig({
      isScoped,
      isPublic,
      useMonorepo,
      mainVersionFile,
      packagesToBump,
      packagesToPublish,
      dir,
      dryRun,
    }),
    ciIntegration.addConfig({
      ...ciConfig,
      isScoped,
      isPublic,
      baseBranch,
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
  outputs.forEach((printMessage) => {
    if (printMessage && typeof printMessage === 'function') {
      print('');
      printMessage();
    }
  });
  print('');
  print(
    `${bold(
      'To learn more, visit'
    )} https://community.algolia.com/shipjs/guide/getting-started.html`
  );
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
