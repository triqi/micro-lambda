# micro-lambda

This is a highly opinionated RESTful API microservice template for AWS Lambda.

## Core technologies
1. Serverless framework
2. Serverless express app
3. Serverless webpack
4. Swagger API Documentation
5. JSON API specs
6. Dot ENV

## Core infrastructure
1. AWS Lambda
2. AWS API Gateway
3. AWS SSM Parameter Store
4. AWS X-Ray

## Setup
`npm install`

## Run
Setup your local environment with `.env`
1. `cat .env.example > .env`
2. `npm start`

## Test
1. `npm run test` for lint + unit tests
2. `npm run test:unit`  for unit tests only

## Build
`npm run build`

## Deploy
`npm run deploy`

### Integration testing
Configure your `.env` file with the deployed resources
1. `API_KEY=<API Gateway Key>`
2. `API_URL=<API Gateway Url>`
3. `npm run test:integration`  for integration tests

## TODOs
- [ ] Document deployment instructions
- [ ] Document the use of SSM Parameter store
- [ ] Document CI builds
