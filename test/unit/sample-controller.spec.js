import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import express from 'express';
import request from 'supertest';

import controller from '../../src/controllers/sample-controller';
import { jsonError } from '../../src/errors/http-error';

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('controllers/sample-controller', () => {
  const createApp = () => express()
    .use((req, res, next) => {
      req.log = { error: sinon.stub() };
      res.jsonError = error => jsonError(res, error);
      next();
    })
    .use(controller.middleware());

  describe('GET /:id?', () => {
    it('invalid ID should result in 404 error', () =>
      request(createApp())
        .get('/')
        .expect(404));

    it('invalid message should result in 400 error', () =>
      request(createApp())
        .get('/123')
        .expect(400, {
          errors: [{
            status: 400,
            title: 'Message is required',
          }],
        }));

    it('valid ID should return data', () =>
      request(createApp())
        .get('/123?message=Hello, world!')
        .expect(200, {
          data: {
            id: '123',
            type: 'response',
            attributes: { message: 'Hello, world!' },
          },
        }));
  });
});
