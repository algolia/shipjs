import { info, warning, error, slateblue, bold, underline } from './src/color';
import { mockColor } from './tests/util';
jest.mock('shipjs-lib');
jest.mock('./src/color');
jest.mock('./src/util');
jest.mock('./src/helper');

beforeEach(() => {
  [info, warning, error, slateblue, bold, underline].forEach(mockColor);
});

afterEach(() => {
  jest.clearAllMocks();
});
