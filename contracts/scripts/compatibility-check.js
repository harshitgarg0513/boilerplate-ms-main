#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const path = require('path');

const CONTRACT_ROOT = 'contracts/proto';
const DEFAULT_BASES = ['origin/main', 'main', 'HEAD~1'];
const REPO_ROOT = path.resolve(__dirname, '../..');

function run(command) {
  try {
    return execSync(command, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
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

function ensureBufInstalled() {
  const check = spawnSync('buf', ['--version'], {
    cwd: REPO_ROOT,
    stdio: 'pipe',
  });
  return check.status === 0;
}

function runBufBreaking(baseRef) {
  const against = `.git#ref=${baseRef},subdir=${CONTRACT_ROOT}`;
  return spawnSync('buf', ['breaking', CONTRACT_ROOT, '--against', against], {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
}

function main() {
  if (!ensureBufInstalled()) {
    console.error('buf CLI is required for contract compatibility checks.');
    console.error('Install it from https://buf.build/docs/installation/ and retry.');
    process.exit(1);
  }

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

  const result = runBufBreaking(baseRef);
  if (result.status !== 0) {
    console.error('ERROR: Breaking change detected in protobuf contracts.');
    process.exit(result.status || 1);
  }

  console.info('Contract compatibility check passed.');
}

main();
