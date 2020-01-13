/* istanbul ignore file */
import awsServerlessExpress from 'aws-serverless-express';
import apiDocs from './api-docs';

const server = awsServerlessExpress.createServer(apiDocs);

// eslint-disable-next-line import/prefer-default-export
export const handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
