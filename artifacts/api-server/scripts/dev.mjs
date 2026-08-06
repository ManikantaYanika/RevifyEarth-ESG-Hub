import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Development entry point.
 *
 * Replaces `export NODE_ENV=development && …`, which is POSIX-only and fails on
 * Windows where `export` is not a command. Node's own child process env is portable.
 *
 * PORT is defaulted rather than required so `pnpm --filter @workspace/api-server run
 * dev` works from a clean checkout; an explicit PORT (as Replit supplies) still wins.
 */

process.env.NODE_ENV ||= 'development';
process.env.PORT ||= '5000';

const packageDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const run = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: packageDir,
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exited with code ${code}`));
    });
  });

try {
  await run([path.join(packageDir, 'build.mjs')]);
  await run([
    '--enable-source-maps',
    // Node 20.12+/24. Missing .env is not an error, so contributors without one can
    // still boot the server — the assistant simply reports itself unavailable.
    '--env-file-if-exists=.env',
    path.join(packageDir, 'dist', 'index.mjs'),
  ]);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
