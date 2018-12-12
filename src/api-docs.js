/* istanbul ignore file */
import express from 'express';
import swaggerUi from 'swagger-ui-dist';
import swaggerJSDoc from 'swagger-jsdoc';
import Constants from './configs/constants';

// Include the modules that contains the documentation for it to be bundled by webpack
require.resolve('./api');
require.resolve('./docs');

const app = express();

const swaggerSpec = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: `API Docs`,
    },
    servers: [
      {
        url: `https://${Constants.SERVICE_HOST}/${Constants.SERVICE_NAME}`,
      },
    ],
    basePath: `/${Constants.SERVICE_NAME}`,
    schemes: ['https'],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          in: 'header',
          name: 'x-api-key',
          type: 'apiKey',
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
  },
  apis: ['src/**/*.js', 'src/**/*.docs.yml'],
};
const swaggerDoc = swaggerJSDoc(swaggerSpec);
const apiDocs = '/docs/api-docs.json';

// Serve the swagger json definition
app.get([`/${Constants.SERVICE_NAME}${apiDocs}`, apiDocs], (req, res) => {
  swaggerDoc.host = req.get('host');
  swaggerDoc.basePath = req.path.replace(apiDocs, '');
  res.json(swaggerDoc);
});

// Serve the swagger-ui static files
app.use(
  [`/${Constants.SERVICE_NAME}/docs`, '/docs'],
  express.static('src/docs/swagger-ui'),
  express.static(swaggerUi.getAbsoluteFSPath()),
);

export default app;
