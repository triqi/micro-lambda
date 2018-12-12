/* istanbul ignore file */
import express from 'express';
import cors from 'cors';
import LogService from './services/log-service';
import ParameterStoreService from './services/parameter-store-service';
import Constants from './configs/constants';
import HttpError from './errors/http-error';

import SampleController from './controllers/sample-controller';

export default class Api {
  constructor() {
    this._express = express()
      .disable('x-powered-by')
      .use(LogService.middleware())
      .use(HttpError.middleware());
  }

  get express() {
    return this._express;
  }

  attachParameterStore() {
    this._express.use(ParameterStoreService.middleware(Constants.parameters));
    return this;
  }

  attachApi() {
    this._express
      // Remove the next line to disable CORS (internal services)
      .use(cors())
      .use(express.json())
      .use([`/${Constants.SERVICE_NAME}`, '/'], SampleController.middleware());
    return this;
  }

  attachErrorHandler() {
    this._express.use(LogService.errorMiddleware());
    return this;
  }

  use(middleware) {
    this._express.use(middleware);
    return this;
  }
}
