import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'request-promise-native';
import { SSM, SharedIniFileCredentials } from 'aws-sdk';

import Constants from '../../src/configs/constants';
import ParameterStoreService from '../../src/services/parameter-store-service';

chai.use(chaiAsPromised);

describe('API integration', () => {
  /**
   * Un-skip this step if you wish to use parameter store values, otherwise configure you .env
   */
  before.skip(async () => {
    const { AWS_STAGE = 'dev', AWS_PROFILE = 'dev', AWS_REGION = 'ap-southeast-2' } = process.env;

    // Setup parameter store paths
    process.env.SSM_API_KEY = `/${AWS_STAGE}/api/api_key`;
    process.env.SSM_API_URL = `/${AWS_STAGE}/api/api_url`;

    // Load parameter store values
    await new ParameterStoreService({
      parameters: Constants.API_PARAMETERS,
      useCache: false,
      ssm: new SSM({
        region: AWS_REGION,
        credentials: new SharedIniFileCredentials({ profile: AWS_PROFILE }),
      }),
    }).load();
  });

  it('Unauthorized requests should return 403 response', () =>
    expect(
      request({
        url: `${process.env[Constants.API_URL.name]}/123?message=abc`,
        json: true,
      }),
    ).to.be.rejectedWith('Forbidden'));

  it('Valid requests should return correct response', () =>
    expect(
      request({
        url: `${process.env[Constants.API_URL.name]}/123?message=abc`,
        headers: { 'x-api-key': process.env[Constants.API_KEY.name] },
        json: true,
      }),
    ).to.eventually.eql({
      data: {
        id: '123',
        type: 'response',
        attributes: { message: 'abc' },
      },
    }));
});
