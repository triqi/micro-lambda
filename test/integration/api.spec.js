import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import got from 'got';
import { SSM, SharedIniFileCredentials } from 'aws-sdk';

import Constants from '../../src/configs/constants';
import ParameterStoreService from '../../src/services/parameter-store-service';

chai.use(chaiAsPromised);

describe('API integration', () => {

  before(async () => {
    const { AWS_STAGE = 'dev', AWS_PROFILE = 'default', AWS_REGION = 'ap-southeast-2' } = process.env;

    // Setup parameter store paths
    process.env.SSM_API_KEY = `/${AWS_STAGE}/api/api_key`;
    process.env.SSM_API_URL = `/${AWS_STAGE}/api/api_url`;

    // Load parameter store values
    await new ParameterStoreService({
      parameters: Constants.parameters,
      useCache: false,
      ssm: new SSM({
        region: AWS_REGION,
        credentials: new SharedIniFileCredentials({ profile: AWS_PROFILE }),
      }),
    }).load();
  });

  it('Unauthorized requests should return 403 response', () =>
    expect(
      got({
        url: `${process.env[Constants.apiUrl.name]}/123?message=abc`,
        responseType: 'json',
      }),
    ).to.be.rejectedWith('Forbidden'));

  it('Valid requests should return correct response', async () => {
    const { body } = await got({
      url: `${process.env[Constants.apiUrl.name]}/123?message=abc`,
      headers: { 'x-api-key': process.env[Constants.apiKey.name] },
      responseType: 'json',
    })
    expect(body).to.eql({
      data: {
        id: '123',
        type: 'response',
        attributes: { message: 'abc' },
      },
    })
  });
});
