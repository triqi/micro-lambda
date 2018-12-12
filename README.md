# micro-lambda

## TODO: Summary and philosophy of this project

## Setup
`npm install`

## Run
Setup your local environment with `.env`
1. `> touch .env`
2. `> cat .env.example > .ev`

`npm start`

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

`npm run test:integration`  for integration tests

### TODO: Add detailed deployment instructions

## TODO: Document the use of SSM Parameter store
