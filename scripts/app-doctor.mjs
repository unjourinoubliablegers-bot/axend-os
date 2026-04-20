import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const requiredFiles = [
  '.editorconfig',
  'package.json',
  'README.md',
  'docs/AXEND_LOW_TOKEN_METHOD_1_PAGE.md',
  'src/App.tsx',
  'src/main.tsx',
  'src/lib/storage.ts',
  'src-tauri/tauri.conf.json',
  'src-tauri/Cargo.toml',
  'src-tauri/src/lib.rs',
  'axend/state/project-core.json',
  'axend/state/project-status.json',
  'axend/state/current-lot.json',
  'axend/state/proof-log.json',
  'axend/proofs/latest-proof.json',
  'axend/handoffs/RESTART_PACK.md',
  'scripts/generate-handoff.mjs',
  'scripts/generate-restart-pack.mjs',
  'scripts/validate-proof.mjs',
  'scripts/complete-lot-validation.mjs',
  'scripts/ollama-router.mjs',
  'scripts/lint-no-control-chars.mjs',
  'scripts/validate-state.mjs',
  'scripts/check-reference-links.mjs',
  '.gitattributes',
  '.github/workflows/ci.yml'
];

const missing = requiredFiles.filter((item) => !fs.existsSync(path.join(root, item)));
const nodeMajor = Number(process.versions.node.split('.')[0]);
let failed = false;

function fail(message) {
  console.error(message);
  failed = true;
}

function run(cmd, args) {
  return spawnSync(cmd, args, { cwd: root, encoding: 'utf-8', shell: process.platform === 'win32' });
}

console.log(`Node version detected: ${process.versions.node}`);
if (nodeMajor < 20) fail('Node 20+ recommandé.');
if (missing.length) {
  fail('Missing files:');
  for (const item of missing) console.error(`- ${item}`);
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
if (!pkg.packageManager) fail('package.json missing packageManager.');
if (!pkg.scripts?.lint || !pkg.scripts?.test || !pkg.scripts?.['format:check']) fail('package.json missing lint/test/format:check scripts.');

const jsonChecks = {
  'axend/state/project-core.json': ['projectName', 'mission', 'primaryObjective', 'stack', 'rules', 'targetUser'],
  'axend/state/project-status.json': ['phase', 'currentLotId', 'currentLotStatus', 'nextMilestone', 'lastValidatedProofAt'],
  'axend/state/current-lot.json': ['lotId', 'title', 'goal', 'definitionOfDone', 'status', 'nextAction', 'proofExpected', 'blocker', 'filesInScope'],
  'axend/state/proof-log.json': ['entries'],
  'axend/proofs/latest-proof.json': ['id', 'lotId', 'kind', 'status', 'summary']
};

for (const [relative, keys] of Object.entries(jsonChecks)) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) continue;
  try {
    const data = JSON.parse(fs.readFileSync(target, 'utf-8'));
    const missingKeys = keys.filter((key) => !(key in data));
    if (missingKeys.length) fail(`${relative} missing keys: ${missingKeys.join(', ')}`);
  } catch (error) {
    fail(`${relative} invalid JSON: ${error.message}`);
  }
}

try {
  const latestProof = JSON.parse(fs.readFileSync(path.join(root, 'axend/proofs/latest-proof.json'), 'utf-8'));
  const proofLog = JSON.parse(fs.readFileSync(path.join(root, 'axend/state/proof-log.json'), 'utf-8'));
  const latestLogEntry = proofLog.entries?.[proofLog.entries.length - 1] ?? null;
  if (latestLogEntry && latestLogEntry.id !== latestProof.id) {
    fail('proof-log latest entry does not match latest-proof.json id.');
  }
  if (latestProof.status === 'validated') {
    if (!Array.isArray(latestProof.items) || latestProof.items.length === 0) {
      fail('latest-proof.json is validated but has no proof items.');
    }
    if (Array.isArray(latestProof.items) && latestProof.items.some((item) => item.status !== 'done')) {
      fail('latest-proof.json is validated but some proof items are not done.');
    }
  }
} catch (error) {
  fail(`proof consistency check failed: ${error.message}`);
}

const gitResult = run('git', ['--version']);
if (gitResult.status !== 0) fail('git unavailable.');
else console.log(`git OK -> ${gitResult.stdout.trim() || gitResult.stderr.trim()}`);

const pnpmResult = run('pnpm', ['--version']);
const pnpmAvailable = pnpmResult.status === 0;
if (pnpmAvailable) console.log(`pnpm OK -> ${pnpmResult.stdout.trim() || pnpmResult.stderr.trim()}`);
else if (strict || fs.existsSync(path.join(root, 'node_modules'))) fail('pnpm unavailable.');
else console.warn('pnpm unavailable on this machine: warning only in non-strict mode.');

for (const optionalBin of ['ollama', 'cargo', 'rustc']) {
  const result = run(optionalBin, ['--version']);
  if (result.status === 0) console.log(`${optionalBin} OK -> ${result.stdout.trim() || result.stderr.trim()}`);
  else console.warn(`${optionalBin} unavailable on this machine.`);
}

for (const script of [
  ['node', ['scripts/lint-no-control-chars.mjs']],
  ['node', ['scripts/validate-state.mjs']],
  ['node', ['scripts/validate-proof.mjs']],
  ['node', ['scripts/check-format.mjs']],
  ['node', ['scripts/check-reference-links.mjs']]
]) {
  const result = run(script[0], script[1]);
  if (result.status !== 0) fail(`${script[1][0]} failed:
${result.stdout}
${result.stderr}`);
}

if (fs.existsSync(path.join(root, 'node_modules')) && pnpmAvailable) {
  for (const script of ['type-check', 'lint', 'test']) {
    const result = run('pnpm', [script]);
    if (result.status !== 0) fail(`${script} failed:
${result.stdout}
${result.stderr}`);
    else console.log(`${script} OK`);
  }

  if (strict) {
    const build = run('pnpm', ['build']);
    if (build.status !== 0) fail(`build failed:
${build.stdout}
${build.stderr}`);
    else console.log('build OK');
  }
} else {
  console.warn('node_modules absent: skip type-check/tests/build.');
}

if (failed) process.exit(1);
console.log(`AXEND doctor OK${strict ? ' (strict)' : ''}`);
