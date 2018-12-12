/* istanbul ignore file */
import express from 'express';
import fs from 'fs';
import https from 'https';

import Api from './api';
import apiDocs from './api-docs';

// Create an express app (without parameter store)
const api = new Api().attachApi().attachErrorHandler().express;

https
  // Attach a self-signed certificate for https
  .createServer(
    {
      pfx: fs.readFileSync('internals/localhost.pfx'),
      passphrase: 'micro-lambda',
    },
    express()
      .use(apiDocs)
      .use(api),
  )
  .listen(3000, () => {
    /* eslint-disable no-console */
    console.log('API started on https://localhost:3000');
    console.log('API docs started on https://localhost:3000/docs');
    /* eslint-enable no-console */
  });
