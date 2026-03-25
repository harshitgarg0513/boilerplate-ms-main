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

function getVersionDir(filePath) {
  const match = filePath.match(/^(contracts\/proto\/.+\/v\d+)\//);
  return match ? match[1] : '';
}

function pathExistsInRef(ref, treePath) {
  const out = run(`git ls-tree -d --name-only ${ref} -- ${treePath}`);
  return out === treePath;
}

function main() {
  if (!ensureBufInstalled()) {
    console.error('buf CLI is required for contract governance policy checks.');
    process.exit(1);
  }

  const baseRef = resolveBaseRef();
  if (!baseRef) {
    console.error('Unable to resolve base ref for governance policy checks.');
    console.error('Set CONTRACT_BASE_REF (for CI use origin/<base-branch>, e.g. origin/main).');
    process.exit(1);
  }

  const changedFiles = getChangedProtoFiles(baseRef);
  if (changedFiles.length === 0) {
    console.info('No proto changes detected for governance policy checks.');
    process.exit(0);
  }

  const changedVersionDirs = Array.from(new Set(changedFiles.map(getVersionDir).filter(Boolean)));
  const existingVersionDirs = changedVersionDirs.filter((dir) => pathExistsInRef(baseRef, dir));
  const newVersionDirs = changedVersionDirs.filter((dir) => !pathExistsInRef(baseRef, dir));

  const breakingResult = runBufBreaking(baseRef);
  if (breakingResult.status === 0) {
    console.info('Governance policy check passed.');
    process.exit(0);
  }

  if (existingVersionDirs.length > 0) {
    console.error('ERROR: Breaking changes were introduced in existing released version directories.');
    for (const dir of existingVersionDirs) {
      console.error(` - ${dir}`);
    }
    if (newVersionDirs.length > 0) {
      console.error('A new version directory was added, but existing version directories were still broken.');
      console.error('Keep existing versions backward compatible and place breaking changes only in the new version.');
    } else {
      console.error('Policy: breaking changes must be introduced under a new version directory (for example v2).');
    }
    process.exit(1);
  }

  console.error('ERROR: Breaking changes detected and governance policy could not confirm a safe version migration path.');
  process.exit(1);
}

main();
