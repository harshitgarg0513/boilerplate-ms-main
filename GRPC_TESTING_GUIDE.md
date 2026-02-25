# gRPC Direct Testing Guide

This guide provides commands to test the microservice **directly via gRPC** (bypassing the API Gateway).

## 📋 Prerequisites

Install grpcurl (if not already installed):
```bash
# macOS
brew install grpcurl

# Or download from: https://github.com/fullstorydev/grpcurl/releases
```

---

## 🧪 Test Scenarios

### ✅ Scenario 1: Valid Admin Token (Expect Success)

```bash
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjo2LCJpYXQiOjE3NzE5OTI0NDgsImV4cCI6MTc3MjA3ODg0OH0.BynGLlxMJ4Ss3pA5R0K_jtY7mv_sAuJ_Q2ykVu-tSOE" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Test Valid","description":"Direct gRPC call with admin role"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create
```

**Expected Response**:
```json
{
  "id": 1,
  "name": "gRPC Test Valid",
  "description": "Direct gRPC call with admin role"
}
```

**Exit Code**: 0 (success)

---

### ❌ Scenario 2: No Role Token (Expect PERMISSION_DENIED)

```bash
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibm8tcm9sZSIsImlhdCI6MTc3MTk4NjQxMywiZXhwIjoxNzcyMDcyODEzfQ.FpU6DgGY_o8r1tRJK0kQ3klupgB-giyyfDJvvnlHJIw" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Test No Role","description":"Should fail with permission denied"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create
```

**Expected Response**:
```
ERROR:
  Code: PermissionDenied
  Message: Access denied!
```

**Exit Code**: Non-zero (error)

---

### ❌ Scenario 3: Bad Signature Token (Expect UNAUTHENTICATED)

```bash
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYmFkIiwicm9sZSI6NiwiaWF0IjoxNzcxOTg2MjAzLCJleHAiOjE3NzIwNzI2MDN9.W4R2g4PiciaHff5LG0MUQvAhoZHjg_7CtwXvr-fNBK8" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Test Bad Sig","description":"Should fail with unauthenticated"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create
```

**Expected Response**:
```
ERROR:
  Code: Unauthenticated
  Message: Unauthorized!
```

**Exit Code**: Non-zero (error)

---

### ❌ Scenario 4: No Token (Expect UNAUTHENTICATED)

```bash
grpcurl -plaintext \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Test No Token","description":"Should fail with unauthenticated"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create
```

**Expected Response**:
```
ERROR:
  Code: Unauthenticated
  Message: Unauthorized!
```

---

## 🔍 List Available Services

```bash
grpcurl -plaintext \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  localhost:50051 \
  list
```

**Expected Output**:
```
beatroute.dms.ExampleService
beatroute.dms.HealthService
grpc.reflection.v1alpha.ServerReflection
```

---

## 🔍 Describe Service Methods

```bash
grpcurl -plaintext \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  localhost:50051 \
  describe beatroute.dms.ExampleService
```

**Expected Output**:
```
beatroute.dms.ExampleService is a service:
service ExampleService {
  rpc Create ( .beatroute.dms.CreateExampleRequest ) returns ( .beatroute.dms.ExampleResponse );
  rpc GetAll ( .beatroute.dms.GetAllExampleRequest ) returns ( .beatroute.dms.ExampleListResponse );
  ...
}
```

---

## 🧪 One-Line Test Script

Test all scenarios at once:

```bash
echo "=== 1. Valid Admin (expect success) ===" && \
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjo2LCJpYXQiOjE3NzE5OTI0NDgsImV4cCI6MTc3MjA3ODg0OH0.BynGLlxMJ4Ss3pA5R0K_jtY7mv_sAuJ_Q2ykVu-tSOE" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"Valid","description":"Test"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create && \
echo "" && echo "=== 2. No Role (expect PERMISSION_DENIED) ===" && \
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibm8tcm9sZSIsImlhdCI6MTc3MTk4NjQxMywiZXhwIjoxNzcyMDcyODEzfQ.FpU6DgGY_o8r1tRJK0kQ3klupgB-giyyfDJvvnlHJIw" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"NoRole","description":"Test"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create 2>&1 | head -3 && \
echo "" && echo "=== 3. Bad Signature (expect UNAUTHENTICATED) ===" && \
grpcurl -plaintext \
  -H "authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYmFkIiwicm9sZSI6NiwiaWF0IjoxNzcxOTg2MjAzLCJleHAiOjE3NzIwNzI2MDN9.W4R2g4PiciaHff5LG0MUQvAhoZHjg_7CtwXvr-fNBK8" \
  -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
  -proto beatroute/dms/example.proto \
  -d '{"name":"BadSig","description":"Test"}' \
  localhost:50051 \
  beatroute.dms.ExampleService/Create 2>&1 | head -3
```

---

## 📦 Using Postman for gRPC (Alternative)

Postman supports gRPC in newer versions (v9.7.1+):

### Setup in Postman:
1. **New Request** → Select **gRPC Request** (not HTTP)
2. **Server URL**: `localhost:50051`
3. **Import Proto Files**:
   - Click "Select a method" → "Import .proto file"
   - Browse to: `/Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto/beatroute/dms/example.proto`
   - Import path: `/Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto`
4. **Select Method**: `beatroute.dms.ExampleService/Create`
5. **Add Metadata** (gRPC headers):
   - Key: `authorization`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your JWT token)
6. **Message**: 
   ```json
   {
     "name": "Postman gRPC Test",
     "description": "Testing via Postman gRPC"
   }
   ```

### Test Scenarios in Postman gRPC:
- **Valid Admin**: Use token with `role: 6` in metadata
- **No Role**: Use no-role token in metadata
- **Bad Signature**: Use bad-signature token in metadata

---

## 🎯 gRPC Status Codes

| Code | Name | Scenario |
|------|------|----------|
| 0 | OK | Success ✅ |
| 7 | PERMISSION_DENIED | No role (403) ❌ |
| 16 | UNAUTHENTICATED | Bad token (401) ❌ |

---

## 🔑 Fresh Token Generation

Generate new tokens if they expire:

```bash
# Valid admin token
node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'admin',role:6},'3p7t4iZqB8xKj6D9eNfH1R1vL5aW9YpXcM2sT4oQmU8JrVd2F',{expiresIn:'24h'}));"

# No role token
node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'no-role'},'3p7t4iZqB8xKj6D9eNfH1R1vL5aW9YpXcM2sT4oQmU8JrVd2F',{expiresIn:'24h'}));"

# Bad signature token (use wrong secret)
node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'bad',role:6},'wrong-secret',{expiresIn:'24h'}));"
```

---

## 🚀 Quick Start

1. **Ensure microservice is running**: `npm run start:dev microservice`
2. **Test health endpoint** (no auth required):
   ```bash
   grpcurl -plaintext \
     -import-path /Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto \
     -proto beatroute/dms/health.proto \
     localhost:50051 \
     beatroute.dms.HealthService/CheckHealth
   ```
3. **Run test scenarios** using commands above

---

## 📊 Comparison: HTTP vs gRPC Testing

| Aspect | HTTP (via Gateway) | gRPC (Direct) |
|--------|-------------------|---------------|
| Tool | curl / Postman HTTP | grpcurl / Postman gRPC |
| Port | 3000 | 50051 |
| Auth Header | `Authorization: Bearer <token>` | `-H "authorization: <token>"` |
| Response Format | JSON with wrapper | Direct proto message |
| Status Codes | HTTP (200, 401, 403) | gRPC (0, 7, 16) |
| Error Format | `{"success":false,"status":401}` | `Code: Unauthenticated` |

Both methods test the same authentication guards from `@beatroute-ms/auth`!
