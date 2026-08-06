// Launches the RevifyEarth frontend outside Replit.
// artifacts/revifyearth/vite.config.ts hard-requires PORT and BASE_PATH, which
// the Replit workflow injects from .replit-artifact/artifact.toml. Locally there
// is no workflow, so fall back to the same values that file declares. Anything
// already present in the environment still wins.
import { spawn } from 'node:child_process';

process.env.PORT ||= '22205';
process.env.BASE_PATH ||= '/';

// Under `pnpm dev` npm_execpath points at pnpm's own entry, so we can call it
// through node and skip shell resolution of the .cmd shim on Windows.
const pnpmCli = process.env.npm_execpath;
const command = pnpmCli ? process.execPath : 'pnpm';
const args = [
  ...(pnpmCli ? [pnpmCli] : []),
  '--filter',
  '@workspace/revifyearth',
  'run',
  'dev',
  ...process.argv.slice(2),
];

const child = spawn(command, args, {
  stdio: 'inherit',
  shell: !pnpmCli && process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
