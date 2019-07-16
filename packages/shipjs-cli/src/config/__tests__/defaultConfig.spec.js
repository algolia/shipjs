import defaultConfig from '../defaultConfig';

describe('defaultConfig', () => {
  it('should export an object', () => {
    expect(defaultConfig).toMatchObject(expect.objectContaining({}));
  });
});
