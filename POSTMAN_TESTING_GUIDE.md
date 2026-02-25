# Postman Integration Testing Guide

## Quick Start

1. **Import Collection**
   - Open Postman
   - Click "Import" → Select `POSTMAN_COLLECTION.json`
   - Collection: **BeatRoute MS Integration - HTTP & gRPC**

2. **Start Services**
   ```bash
   cd /Users/harshitgarg/Documents/pack/boilerplate-ms-main
   
   # Terminal 1: Start microservice
   npm run start:dev:ms
   
   # Terminal 2: Start API gateway
   npm run start:dev:apigateway
   ```

3. **Run Tests**
   - Use collection runner or execute requests individually
   - Check response status codes and messages

---

## Collection Structure

### ✅ Success Cases (Valid Admin Token)
All requests use `{{VALID_ADMIN_TOKEN}}` with `role=6` (ADMIN)

| Request | Method | Endpoint | Expected |
|---------|--------|----------|----------|
| Health Check | GET | `/health/check` | 200 OK (no auth) |
| Create | POST | `/example/create` | 201 Created |
| Index | GET | `/example/index` | 200 OK with list |
| View | GET | `/example/view1` | 200 OK with item |
| Update | PATCH | `/example/update1` | 200 OK |
| Delete | DELETE | `/example/delete1` | 200 OK |

### ❌ No-Role Token (Forbidden)
Token has valid signature but **missing `role` field**

| Request | Expected Response |
|---------|-------------------|
| Create | 403 Forbidden - "Access denied!" |
| Index | 403 Forbidden - "Access denied!" |
| View | 403 Forbidden - "Access denied!" |

**Why it fails:** `RoleAccessGuard` from `@beatroute-ms/auth` checks for role in JWT payload

### ❌ Bad Signature Token (Unauthorized)
Token signed with **wrong secret** (`WRONG_SECRET` instead of actual secret)

| Request | Expected Response |
|---------|-------------------|
| Create | 401 Unauthorized - "Unauthorized!" |
| Index | 401 Unauthorized - "Unauthorized!" |

**Why it fails:** `AuthGuard` from `@beatroute-ms/auth` JWT signature verification fails

### ❌ No Token (Unauthorized)
No `Authorization` header provided

| Request | Expected Response |
|---------|-------------------|
| Create | 401 Unauthorized |

**Why it fails:** `AuthGuard` requires valid JWT token

---

## Environment Variables

The collection uses these variables (already set):

| Variable | Description | Source |
|----------|-------------|--------|
| `VALID_ADMIN_TOKEN` | Valid JWT, role=6 | `node generate-token.js` |
| `NO_ROLE_TOKEN` | Valid signature, no role | Custom script |
| `BAD_SIGNATURE_TOKEN` | Wrong secret | Custom script |

### Regenerate Tokens

```bash
cd /Users/harshitgarg/Documents/pack/boilerplate-ms-main

# Valid admin token
node generate-token.js

# No-role token
node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'no-role'}, '3p7t4iZqB8xKj6D9eNfH1R1vL5aW9YpXcM2sT4oQmU8JrVd2F',{expiresIn:'24h'}));"

# Bad signature token
node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'bad',role:6}, 'WRONG_SECRET',{expiresIn:'24h'}));"
```

---

## Testing Checklist

- [ ] **Health endpoint works without auth**
- [ ] **Create with valid token → 201 Created**
- [ ] **Index with valid token → 200 OK with pagination**
- [ ] **View with valid token → 200 OK with item**
- [ ] **Update with valid token → 200 OK**
- [ ] **Delete with valid token → 200 OK**
- [ ] **Create with no-role token → 403 Forbidden**
- [ ] **Index with no-role token → 403 Forbidden**
- [ ] **Create with bad signature → 401 Unauthorized**
- [ ] **Create with no token → 401 Unauthorized**

---

## Integration Points Verified

This collection validates integration of `beatroute-shared-platform` packages:

1. **@beatroute-ms/auth**
   - `AuthGuard` - JWT signature validation
   - `RoleAccessGuard` - Role-based access control
   
2. **@beatroute-ms/error-handling**
   - `GatewayRpcToHttpExceptionFilter` - gRPC→HTTP error mapping
   
3. **@beatroute-ms/request-context**
   - Request context propagation via `x-request-context` header
   - Distributed tracing support

---

## Direct cURL Commands

### Success Case
```bash
curl -i -X POST 'http://localhost:3000/example/create' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOjYsImlhdCI6MTc3MTk4NjE5NywiZXhwIjoxNzcxOTg5Nzk3fQ.2UiwXxgXl39ytr3OFU5NISV6km6uFZSa7GV666bA6ag' \
  -d '{"name":"test","description":"desc"}'
```

### No-Role Denial (403)
```bash
curl -i -X POST 'http://localhost:3000/example/create' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibm8tcm9sZSIsImlhdCI6MTc3MTk4NjIwMSwiZXhwIjoxNzcyMDcyNjAxfQ.XAO_15N7CTdAbcf6O48EgRxqALGVO7eden9eYaLCWHM' \
  -d '{"name":"test","description":"desc"}'
```

### Bad Signature (401)
```bash
curl -i -X POST 'http://localhost:3000/example/create' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYmFkIiwicm9sZSI6NiwiaWF0IjoxNzcxOTg2MjAzLCJleHAiOjE3NzIwNzI2MDN9.W4R2g4PiciaHff5LG0MUQvAhoZHjg_7CtwXvr-fNBK8' \
  -d '{"name":"test","description":"desc"}'
```

---

## Troubleshooting

**Services not running?**
```bash
# Check ports
lsof -nP -iTCP:3000 -sTCP:LISTEN  # API Gateway
lsof -nP -iTCP:50051 -sTCP:LISTEN # Microservice

# Restart
cd /Users/harshitgarg/Documents/pack/boilerplate-ms-main
npm run start:dev:ms
npm run start:dev:apigateway
```

**Token expired?**
- Run regenerate commands above
- Update collection variables in Postman

**500 Internal Server Error?**
- Check microservice logs
- Verify database connectivity (or comment out DB modules if not needed)
