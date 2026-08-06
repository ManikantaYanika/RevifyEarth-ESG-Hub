// Cross-platform replacement for the previous `sh -c '...'` preinstall hook.
// Runs before any dependency is installed, so it must stay on Node builtins.
// Paths resolve from this file, not the cwd, so it behaves the same however the
// package manager invokes it.
import { rmSync } from 'node:fs';

for (const lockfile of ['package-lock.json', 'yarn.lock']) {
  rmSync(new URL(`../${lockfile}`, import.meta.url), { force: true });
}

const userAgent = process.env.npm_config_user_agent ?? '';

if (!userAgent.startsWith('pnpm/')) {
  console.error('Use pnpm instead');
  process.exit(1);
}
