/* istanbul ignore file */
import awsServerlessExpress from 'aws-serverless-express';
import apiDocs from './api-docs';

const server = awsServerlessExpress.createServer(apiDocs);

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);
