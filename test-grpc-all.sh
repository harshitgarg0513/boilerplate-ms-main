#!/bin/bash

# gRPC Testing Script - All Scenarios
# Tests microservice directly on port 50051

PROTO_PATH="/Users/harshitgarg/Documents/pack/boilerplate-ms-main/proto"
GRPC_HOST="localhost:50051"

# JWT Tokens
VALID_ADMIN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOjYsImlhdCI6MTc3MTk5MjcxNCwiZXhwIjoxNzcxOTk2MzE0fQ.pI0dRx3JxcV7F80ZF_op-F7TtZeGClwVTjxf-u8v5Zw"
NO_ROLE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoibm8tcm9sZSIsImlhdCI6MTc3MTk5MjczMiwiZXhwIjoxNzcxOTk2MzMyfQ.IpygsoIMgZeNMtDNfINSBR6rwFNyP-LQEoEy-b6dqXY"
BAD_SIGNATURE="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYmFkIiwicm9sZSI6NiwiaWF0IjoxNzcxOTkyNzQxLCJleHAiOjE3NzE5OTYzNDF9.FYzGj4vMuhHIGngBrqF-5BxjBuoZPzMgDw7EWaKRRNk"

echo "=========================================="
echo "     gRPC MICROSERVICE TESTING"
echo "=========================================="
echo ""

# Check if grpcurl is installed
if ! command -v grpcurl &> /dev/null; then
    echo "❌ grpcurl is not installed"
    echo "Install with: brew install grpcurl"
    exit 1
fi

# Check if microservice is running
if ! lsof -nP -iTCP:50051 -sTCP:LISTEN > /dev/null 2>&1; then
    echo "❌ Microservice is not running on port 50051"
    echo "Start with: npm run start:dev microservice"
    exit 1
fi

echo "✅ grpcurl installed"
echo "✅ Microservice running on port 50051"
echo ""

# Test 1: Valid Admin Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ TEST 1: Valid Admin Token (role=6)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Expected: Success (gRPC code 0)"
echo ""

RESULT=$(grpcurl -plaintext \
  -H "authorization: $VALID_ADMIN" \
  -import-path "$PROTO_PATH" \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Valid Admin","description":"Direct gRPC test with admin role"}' \
  "$GRPC_HOST" \
  beatroute.dms.ExampleService/Create 2>&1)

if echo "$RESULT" | grep -q "ERROR"; then
    echo "❌ FAILED - Got error:"
    echo "$RESULT" | head -5
else
    echo "✅ SUCCESS - Response:"
    echo "$RESULT" | jq '.' 2>/dev/null || echo "$RESULT"
fi

echo ""
echo ""

# Test 2: No Role Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ TEST 2: No Role Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Expected: PERMISSION_DENIED (gRPC code 7)"
echo ""

RESULT=$(grpcurl -plaintext \
  -H "authorization: $NO_ROLE" \
  -import-path "$PROTO_PATH" \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC No Role","description":"Should fail"}' \
  "$GRPC_HOST" \
  beatroute.dms.ExampleService/Create 2>&1)

if echo "$RESULT" | grep -q "PermissionDenied"; then
    echo "✅ CORRECT - Got PERMISSION_DENIED:"
    echo "$RESULT" | grep -A 2 "ERROR"
elif echo "$RESULT" | grep -q "ERROR"; then
    echo "⚠️  Got error but wrong code:"
    echo "$RESULT" | head -5
else
    echo "❌ FAILED - Expected error but got success:"
    echo "$RESULT"
fi

echo ""
echo ""

# Test 3: Bad Signature Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ TEST 3: Bad Signature Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Expected: UNAUTHENTICATED (gRPC code 16)"
echo ""

RESULT=$(grpcurl -plaintext \
  -H "authorization: $BAD_SIGNATURE" \
  -import-path "$PROTO_PATH" \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC Bad Signature","description":"Should fail"}' \
  "$GRPC_HOST" \
  beatroute.dms.ExampleService/Create 2>&1)

if echo "$RESULT" | grep -q "Unauthenticated"; then
    echo "✅ CORRECT - Got UNAUTHENTICATED:"
    echo "$RESULT" | grep -A 2 "ERROR"
elif echo "$RESULT" | grep -q "ERROR"; then
    echo "⚠️  Got error but wrong code:"
    echo "$RESULT" | head -5
else
    echo "❌ FAILED - Expected error but got success:"
    echo "$RESULT"
fi

echo ""
echo ""

# Test 4: No Token
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ TEST 4: No Token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Expected: UNAUTHENTICATED (gRPC code 16)"
echo ""

RESULT=$(grpcurl -plaintext \
  -import-path "$PROTO_PATH" \
  -proto beatroute/dms/example.proto \
  -d '{"name":"gRPC No Token","description":"Should fail"}' \
  "$GRPC_HOST" \
  beatroute.dms.ExampleService/Create 2>&1)

if echo "$RESULT" | grep -q "Unauthenticated"; then
    echo "✅ CORRECT - Got UNAUTHENTICATED:"
    echo "$RESULT" | grep -A 2 "ERROR"
elif echo "$RESULT" | grep -q "ERROR"; then
    echo "⚠️  Got error but wrong code:"
    echo "$RESULT" | head -5
else
    echo "❌ FAILED - Expected error but got success:"
    echo "$RESULT"
fi

echo ""
echo ""
echo "=========================================="
echo "     TESTING COMPLETE"
echo "=========================================="
