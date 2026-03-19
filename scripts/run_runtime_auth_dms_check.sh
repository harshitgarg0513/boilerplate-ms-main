#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="/Users/harshitgarg/Documents/pack/boilerplate-ms-main"
AUTH_PORT="50052"
DMS_PORT="50053"
GATEWAY_PORT="3000"
DIST_PROTO_PATH="$PROJECT_ROOT/dist/apps/apigateway/apps/apigateway/src/proto"

AUTH_PID=""
DMS_PID=""
GATEWAY_PID=""

cleanup() {
  set +e
  [[ -n "$GATEWAY_PID" ]] && kill "$GATEWAY_PID" >/dev/null 2>&1 || true
  [[ -n "$AUTH_PID" ]] && kill "$AUTH_PID" >/dev/null 2>&1 || true
  [[ -n "$DMS_PID" ]] && kill "$DMS_PID" >/dev/null 2>&1 || true

  lsof -nP -iTCP:${GATEWAY_PORT} -sTCP:LISTEN -t | xargs -r kill -9
  lsof -nP -iTCP:${AUTH_PORT} -sTCP:LISTEN -t | xargs -r kill -9
  lsof -nP -iTCP:${DMS_PORT} -sTCP:LISTEN -t | xargs -r kill -9

  rm -rf "$DIST_PROTO_PATH"
}
trap cleanup EXIT

cd "$PROJECT_ROOT"

if [[ ! -d "$PROJECT_ROOT/node_modules" ]]; then
  echo "node_modules not found. Run: npm install"
  exit 1
fi

lsof -nP -iTCP:${GATEWAY_PORT} -sTCP:LISTEN -t | xargs -r kill -9 || true
lsof -nP -iTCP:${AUTH_PORT} -sTCP:LISTEN -t | xargs -r kill -9 || true
lsof -nP -iTCP:${DMS_PORT} -sTCP:LISTEN -t | xargs -r kill -9 || true

NODE_PATH="$PROJECT_ROOT/node_modules" node -e "const grpc=require('@grpc/grpc-js');const protoLoader=require('@grpc/proto-loader');const path=require('path');const root=process.cwd();const def=protoLoader.loadSync(path.join(root,'proto/beatroute/auth/auth.proto'),{keepCase:true,longs:String,enums:String,defaults:true,oneofs:true,includeDirs:[root]});const proto=grpc.loadPackageDefinition(def).beatroute.auth;const server=new grpc.Server();const fn=(call,cb)=>cb(null,{jwtToken:call.request&&call.request.token?call.request.token:''});server.addService(proto.AuthService.service,{Authenticate:fn,authenticate:fn});server.bindAsync('0.0.0.0:${AUTH_PORT}',grpc.ServerCredentials.createInsecure(),(e)=>{if(e){console.error(e);process.exit(1);}server.start();console.log('auth-mock:${AUTH_PORT}');});" >/tmp/br-auth-mock.log 2>&1 &
AUTH_PID=$!

NODE_PATH="$PROJECT_ROOT/node_modules" node -e "const grpc=require('@grpc/grpc-js');const protoLoader=require('@grpc/proto-loader');const path=require('path');const root=process.cwd();const def=protoLoader.loadSync([path.join(root,'proto/beatroute/dms/example.proto'),path.join(root,'proto/beatroute/dms/health.proto')],{keepCase:true,longs:String,enums:String,defaults:true,oneofs:true,includeDirs:[root]});const proto=grpc.loadPackageDefinition(def).beatroute.dms;const server=new grpc.Server();const create=(call,cb)=>cb(null,{id:1,name:(call.request&&call.request.name)||'mock',description:(call.request&&call.request.description)||''});const index=(call,cb)=>cb(null,{examples:[{id:1,name:'mock',description:'mock'}],pagination:{totalPages:1,currentPage:1,perPage:10,totalCount:1}});const view=(call,cb)=>cb(null,{id:(call.request&&call.request.id)||1,name:'mock',description:'mock'});const del=(call,cb)=>cb(null,{});const health=(call,cb)=>cb(null,{status:true});server.addService(proto.ExampleService.service,{Create:create,Index:index,View:view,Delete:del,create,index,view,delete:del});server.addService(proto.HealthService.service,{CheckHealth:health,checkHealth:health});server.bindAsync('0.0.0.0:${DMS_PORT}',grpc.ServerCredentials.createInsecure(),(e)=>{if(e){console.error(e);process.exit(1);}server.start();console.log('dms-mock:${DMS_PORT}');});" >/tmp/br-dms-mock.log 2>&1 &
DMS_PID=$!

for i in {1..30}; do
  if lsof -nP -iTCP:${AUTH_PORT} -sTCP:LISTEN >/dev/null 2>&1 && lsof -nP -iTCP:${DMS_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! lsof -nP -iTCP:${AUTH_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Auth mock failed to start. See /tmp/br-auth-mock.log"
  exit 1
fi
if ! lsof -nP -iTCP:${DMS_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "DMS mock failed to start. See /tmp/br-dms-mock.log"
  exit 1
fi

GRPC_AUTH_MS_URL="localhost:${AUTH_PORT}" GRPC_DMS_MS_URL="localhost:${DMS_PORT}" npm run start:dev:apigateway >/tmp/br-apigateway.log 2>&1 &
GATEWAY_PID=$!

for i in {1..45}; do
  if lsof -nP -iTCP:${GATEWAY_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! lsof -nP -iTCP:${GATEWAY_PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Gateway failed to start. See /tmp/br-apigateway.log"
  exit 1
fi

mkdir -p "$DIST_PROTO_PATH"
cp -R "$PROJECT_ROOT/proto/beatroute" "$DIST_PROTO_PATH/"

TOKEN=$(node -e "const jwt=require('jsonwebtoken');console.log(jwt.sign({sub:1,username:'admin',role:6}, '3p7t4iZqB8xKj6D9eNfH1R1vL5aW9YpXcM2sT4oQmU8JrVd2F',{expiresIn:'1h'}));")

echo "=== Health Check ==="
curl -sS -i "http://localhost:${GATEWAY_PORT}/health/check" | head -20

echo "=== Authenticated Create ==="
curl -sS -i -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json" -d '{"name":"demo","description":"demo"}' "http://localhost:${GATEWAY_PORT}/example/create" | head -30

echo "=== Authenticated Index ==="
curl -sS -i -H "Authorization: Bearer ${TOKEN}" "http://localhost:${GATEWAY_PORT}/example/index" | head -30

echo "=== Completed (cleanup will run now) ==="
