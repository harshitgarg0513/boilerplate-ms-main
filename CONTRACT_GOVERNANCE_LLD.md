# Low-Level Design: Contract Governance for gRPC Microservices

## Scope
This implementation provides a contract governance foundation for this workspace using:
- Shared contract module (`contracts`)
- Versioned protobuf namespaces (`v1`, `v2`, ...)
- Automated code generation
- CI compatibility checks
- Two runnable microservices (`microservice`, `microservice2`) for local validation

## Implemented Structure

```text
contracts/
  proto/
    beatroute/
      common/
        empty.proto
        response.proto
        user-identity.proto
      dms/
        v1/
          example.proto
          health.proto
  generated/
    typescript/
  scripts/
    generate-proto.js
    compatibility-check.js
  package.json

apps/
  microservice/
  microservice2/
  apigateway/

ci/
  contract-check.yml
```

## Contract Rules

### Version Namespace
- Each API version is isolated at folder and package level.
- Example: `contracts/proto/beatroute/dms/v1/example.proto`
- Package naming: `beatroute.dms.v1`

### Change Policy
Allowed in same version:
- Add fields
- Add messages
- Add enum values
- Add RPC methods

Not allowed in same version:
- Change field number
- Change field type
- Remove field
- Remove message/service/RPC
- Change request/response type for an existing RPC

Breaking change handling:
- Create new version folder (for example `v2`)
- Keep old version active during migration window

## Runtime Integration

The gRPC servers and clients now read proto files from shared contracts:
- `contracts/proto/beatroute/dms/v1/example.proto`
- `contracts/proto/beatroute/dms/v1/health.proto`

Package configured in transports:
- `beatroute.dms.v1`

## Tooling

### Generation Script
`contracts/scripts/generate-proto.js`
- Scans `contracts/proto`
- Invokes `protoc` + `ts-proto`
- Writes generated artifacts to `contracts/generated/typescript`

### Compatibility Script
`contracts/scripts/compatibility-check.js`
- Compares changed proto files against base ref (`origin/main`, fallbacks supported)
- Fails on:
  - Removed fields/messages/services/RPCs
  - Changed field numbers/types
  - Changed RPC signatures

## CI Enforcement

`ci/contract-check.yml` pipeline:
1. Checkout with full history
2. Install Node + protoc
3. Install dependencies
4. Run code generation
5. Run compatibility checks
6. Run tests

PR fails if compatibility checks fail.

## Local Validation with Two Microservices

### Ports
- `microservice`: `MS_PORT` (default `50051`)
- `microservice2`: `MS2_PORT` (default `50052`)

### Commands
```bash
npm run contracts:generate
npm run contracts:check
npm run start:dev:ms
npm run start:dev:ms2
npm run start:dev:apigateway
```

## Migration Path to External Shared Repo

For production multi-repo governance:
1. Move `contracts/` to dedicated repository (for example `company-contracts`)
2. Publish package versions (for example `@company/contracts@1.2.0`)
3. Consume in each service via package dependency
4. Keep compatibility check in contracts repo CI
5. Services upgrade contracts independently
