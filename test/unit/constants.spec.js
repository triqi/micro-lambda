import { expect } from 'chai';

import Constants from '../../src/configs/constants';

describe('configs/parameters', () => {
  it('should export service host', () => {
    process.env.SERVICE_HOST = 'SERVICE_HOST';
    expect(Constants.SERVICE_HOST).to.equal(process.env.SERVICE_HOST);
  });

  it('should export service name', () => {
    process.env.SERVICE_NAME = 'SERVICE_NAME';
    expect(Constants.SERVICE_NAME).to.equal(process.env.SERVICE_NAME);
  });

  it('should export store parameters', () => {
    process.env.SSM_API_KEY = 'SSM_API_KEY';
    process.env.SSM_API_URL = 'SSM_API_KEY';

    expect(Constants.parameters).to.deep.eql([
      { name: 'API_KEY', path: process.env.SSM_API_KEY },
      { name: 'API_URL', path: process.env.SSM_API_URL },
    ]);
  });
});
