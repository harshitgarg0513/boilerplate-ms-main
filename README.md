<p align="center">
  <a href="http://localhost:3000/apidoc" target="blank"><img src="https://beatroute.io/wp-content/uploads/2021/07/BR-Logo.png" width="200" alt="BeatRoute Microservice" /></a>
</p>



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## API Documentation (Swagger)
[Click Here](http://localhost:3000/apidoc)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Versioning](#versioning)
- [Contributing](#contributing)
- [License](#license)


## Prerequisites

Make sure you have the following installed:

- **Node.js**: v20.12.0 or later
- **npm**: v10.5.0 or later
- **NestJS**: v10.4.5 or later

### Version Details

| Component      | Version    |
|----------------|------------|
| Node.js        | 20.12.0+    |
| npm            | 10.5.0+     |
| NestJS         | 10.4.5+     |
| TypeScript     | 5.6.2+     |
| Express        | ^4.17.21     |
| @nestjs/core   | ^10.4.3     |
| @nestjs/swagger| ^7.4.2     |

## Installation

```bash
$ npm install

# intall protobuf-compiler for linux
$ sudo apt install protobuf-compiler

# installation guide for othere OS
https://grpc.io/docs/protoc-installation/

https://www.geeksforgeeks.org/how-to-install-protocol-buffers-on-windows/

```

## Running the app

```bash
# development

$ npm run start:dev:ms
$ npm run start:dev:ms2
$ npm run start:dev:apigateway

# build

$ npm run build:ms
$ npm run build:ms2
$ npm run build:apigateway

# production mode

$ npm run start:prod:ms
$ npm run start:prod:ms2
$ npm run start:prod:apigateway
```

## Contract Governance

Shared contracts are maintained under `contracts/proto` with versioned package paths.

```bash
# generate TypeScript code from contracts/proto
$ npm run contracts:generate

# run breaking-change check against base branch
$ npm run contracts:check

# run generate + compatibility check together
$ npm run contracts:validate
```

Current v1 protobuf package for DMS is:

`beatroute.dms.v1`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Docs

### GRPC documents
https://grpc.io/docs/

### nest js documentation
https://docs.nestjs.com/

## Stay in touch

- Author - [Anoop Trivedi](https://kamilmysliwiec.com)
- Website - [https://beatroute.io](https://beatroute.io/)

## License

Nest is [MIT licensed](LICENSE).
