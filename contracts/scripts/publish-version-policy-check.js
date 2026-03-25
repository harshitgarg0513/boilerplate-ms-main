#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const CONTRACT_SIGNAL_PATHS = [
  'contracts/proto',
  'contracts/scripts',
  'contracts/generated/typescript',
  'contracts/proto/buf.yaml',
];
const DEFAULT_BASES = ['origin/main', 'main', 'HEAD~1'];

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
  if (explicit && run(`git rev-parse --verify ${explicit}`)) {
    return explicit;
  }

  for (const candidate of DEFAULT_BASES) {
    if (run(`git rev-parse --verify ${candidate}`)) {
      return candidate;
    }
  }

  return '';
}

function listChangedFiles(baseRef) {
  const scopedPaths = CONTRACT_SIGNAL_PATHS.join(' ');
  const output = run(`git diff --name-only --diff-filter=ACMRT ${baseRef}...HEAD -- ${scopedPaths}`);
  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function readPackageVersion(refOrPath) {
  let raw = '';
  if (refOrPath.includes(':')) {
    raw = run(`git show ${refOrPath}`);
  } else {
    raw = run(`cat ${refOrPath}`);
  }

  if (!raw) {
    return '';
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed.version || '';
  } catch (error) {
    return '';
  }
}

function parseSemver(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function compareSemver(a, b) {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function main() {
  const baseRef = resolveBaseRef();
  if (!baseRef) {
    console.error('Unable to resolve base ref for publish policy checks.');
    process.exit(1);
  }

  const changedFiles = listChangedFiles(baseRef);
  if (changedFiles.length === 0) {
    console.info('No contract-signal changes detected for publish policy check.');
    process.exit(0);
  }

  const oldVersion = readPackageVersion(`${baseRef}:contracts/package.json`);
  const newVersion = readPackageVersion('contracts/package.json');

  if (!oldVersion || !newVersion) {
    console.error('Unable to read contracts/package.json version for publish policy check.');
    process.exit(1);
  }

  if (oldVersion === newVersion) {
    console.error('ERROR: contracts/package.json version must be bumped when contracts change.');
    console.error(`Current version remains ${newVersion}.`);
    process.exit(1);
  }

  const oldSemver = parseSemver(oldVersion);
  const newSemver = parseSemver(newVersion);
  if (!oldSemver || !newSemver) {
    console.error('ERROR: contracts/package.json version must use strict semver (x.y.z).');
    process.exit(1);
  }

  if (compareSemver(newSemver, oldSemver) <= 0) {
    console.error('ERROR: contracts/package.json version must increase compared to base branch.');
    console.error(`Base version: ${oldVersion}, current version: ${newVersion}`);
    process.exit(1);
  }

  console.info(`Publish version policy passed: ${oldVersion} -> ${newVersion}`);
}

main();
