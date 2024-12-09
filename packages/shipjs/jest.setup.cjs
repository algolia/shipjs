const {
  info,
  warning,
  error,
  slateblue,
  bold,
  underline,
  reset,
} = require('./src/color.mjs');
const { mockColor } = require('./tests/util/index.mjs');
jest.mock('shipjs-lib');
jest.mock('./src/color');
jest.mock('./src/helper');
jest.mock('./src/util', () => {
  const actual = jest.requireActual('./src/util');
  const mock = jest.genMockFromModule('./src/util');

  return {
    ...mock,
    arrayify: actual.arrayify,
  };
});

beforeEach(() => {
  [info, warning, error, slateblue, bold, underline, reset].forEach(mockColor);
});

afterEach(() => {
  jest.resetAllMocks();
});
