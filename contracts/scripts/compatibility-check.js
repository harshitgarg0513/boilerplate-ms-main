#!/usr/bin/env node

const { execSync } = require('child_process');

const CONTRACT_ROOT = 'contracts/proto';
const DEFAULT_BASES = ['origin/main', 'main', 'HEAD~1'];

function run(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return '';
  }
}

function resolveBaseRef() {
  const explicit = process.env.CONTRACT_BASE_REF;
  if (explicit) {
    const ok = run(`git rev-parse --verify ${explicit}`);
    if (ok) {
      return explicit;
    }
  }

  for (const candidate of DEFAULT_BASES) {
    const ok = run(`git rev-parse --verify ${candidate}`);
    if (ok) {
      return candidate;
    }
  }

  return '';
}

function getChangedProtoFiles(baseRef) {
  const output = run(`git diff --name-only --diff-filter=ACMRT ${baseRef}...HEAD -- ${CONTRACT_ROOT}`);
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.endsWith('.proto'));
}

function getGitFile(ref, filePath) {
  return run(`git show ${ref}:${filePath}`);
}

function parseProto(content) {
  const parsed = {
    messages: {},
    services: {},
  };

  const messageRegex = /message\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let messageMatch = messageRegex.exec(content);
  while (messageMatch) {
    const messageName = messageMatch[1];
    const body = messageMatch[2];
    const byNumber = {};
    const byName = {};

    const fieldRegex = /^\s*(?:repeated\s+)?(?:optional\s+)?([A-Za-z0-9_.]+)\s+(\w+)\s*=\s*(\d+)\s*(?:\[[^\]]*\])?\s*;/gm;
    let fieldMatch = fieldRegex.exec(body);
    while (fieldMatch) {
      const type = fieldMatch[1];
      const name = fieldMatch[2];
      const number = Number(fieldMatch[3]);
      byNumber[number] = { type, name };
      byName[name] = { type, number };
      fieldMatch = fieldRegex.exec(body);
    }

    parsed.messages[messageName] = {
      byNumber,
      byName,
    };

    messageMatch = messageRegex.exec(content);
  }

  const serviceRegex = /service\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let serviceMatch = serviceRegex.exec(content);
  while (serviceMatch) {
    const serviceName = serviceMatch[1];
    const body = serviceMatch[2];
    const rpcMap = {};

    const rpcRegex = /^\s*rpc\s+(\w+)\s*\(\s*([A-Za-z0-9_.]+)\s*\)\s*returns\s*\(\s*([A-Za-z0-9_.]+)\s*\)\s*(?:\{\})?\s*;?/gm;
    let rpcMatch = rpcRegex.exec(body);
    while (rpcMatch) {
      rpcMap[rpcMatch[1]] = {
        requestType: rpcMatch[2],
        responseType: rpcMatch[3],
      };
      rpcMatch = rpcRegex.exec(body);
    }

    parsed.services[serviceName] = rpcMap;
    serviceMatch = serviceRegex.exec(content);
  }

  return parsed;
}

function compareMessage(messageName, oldMessage, newMessage, errors, filePath) {
  for (const [numberText, oldField] of Object.entries(oldMessage.byNumber)) {
    const number = Number(numberText);
    const current = newMessage.byNumber[number];
    if (!current) {
      errors.push(`${filePath} :: message ${messageName} removed field #${number} (${oldField.name})`);
      continue;
    }
    if (current.type !== oldField.type) {
      errors.push(`${filePath} :: message ${messageName} changed type of field #${number} from ${oldField.type} to ${current.type}`);
    }
  }

  for (const [fieldName, oldField] of Object.entries(oldMessage.byName)) {
    const current = newMessage.byName[fieldName];
    if (current && current.number !== oldField.number) {
      errors.push(`${filePath} :: message ${messageName} changed field number of ${fieldName} from ${oldField.number} to ${current.number}`);
    }
  }
}

function compareService(serviceName, oldService, newService, errors, filePath) {
  for (const [rpcName, oldRpc] of Object.entries(oldService)) {
    const current = newService[rpcName];
    if (!current) {
      errors.push(`${filePath} :: service ${serviceName} removed rpc ${rpcName}`);
      continue;
    }

    if (current.requestType !== oldRpc.requestType || current.responseType !== oldRpc.responseType) {
      errors.push(`${filePath} :: service ${serviceName} changed rpc signature for ${rpcName}`);
    }
  }
}

function main() {
  const baseRef = resolveBaseRef();
  if (!baseRef) {
    console.info('Skipping contract compatibility check: no base ref available.');
    process.exit(0);
  }

  const changedFiles = getChangedProtoFiles(baseRef);
  if (changedFiles.length === 0) {
    console.info('No proto changes detected.');
    process.exit(0);
  }

  const errors = [];

  for (const filePath of changedFiles) {
    const oldContent = getGitFile(baseRef, filePath);
    if (!oldContent) {
      continue;
    }

    const newContent = run(`cat ${filePath}`);
    if (!newContent) {
      continue;
    }

    const oldParsed = parseProto(oldContent);
    const newParsed = parseProto(newContent);

    for (const [messageName, oldMessage] of Object.entries(oldParsed.messages)) {
      const current = newParsed.messages[messageName];
      if (!current) {
        errors.push(`${filePath} :: removed message ${messageName}`);
        continue;
      }
      compareMessage(messageName, oldMessage, current, errors, filePath);
    }

    for (const [serviceName, oldService] of Object.entries(oldParsed.services)) {
      const current = newParsed.services[serviceName];
      if (!current) {
        errors.push(`${filePath} :: removed service ${serviceName}`);
        continue;
      }
      compareService(serviceName, oldService, current, errors, filePath);
    }
  }

  if (errors.length > 0) {
    console.error('ERROR: Breaking change detected in protobuf contracts.');
    for (const error of errors) {
      console.error(` - ${error}`);
    }
    process.exit(1);
  }

  console.info('Contract compatibility check passed.');
}

main();
