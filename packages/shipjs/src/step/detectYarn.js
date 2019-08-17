import runStep from './runStep';
import detectYarn from '../util/detectYarn';

export default ({ dir }) =>
  runStep({ title: 'Checking if using yarn.' }, () => {
    return detectYarn(dir);
  });
