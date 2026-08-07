import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type UserConfig } from 'vite';

const DEFAULT_DEV_PORT = 5173;

/**
 * Dev-server port.
 *
 * `PORT` is a *runtime* concern and must never be required to produce a build. A
 * static host (Netlify, Vercel) runs `vite build` in a container that has no reason
 * to define one, and throwing at module scope failed the deploy before Vite had read
 * a single source file. This is only called when a server is actually being started.
 *
 * A provided value is still validated, and still bound with `strictPort`: the Replit
 * workflow hands the frontend an exact port, and silently listening on a different
 * one would leave the preview pointing at nothing. Without `PORT` we fall back to
 * Vite's own default and allow it to roll forward if the port is busy.
 */
function resolveDevServerPort(): { port: number; strictPort: boolean } {
  const rawPort = process.env.PORT;
  if (!rawPort) return { port: DEFAULT_DEV_PORT, strictPort: false };

  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }
  return { port, strictPort: true };
}

/**
 * Public base path.
 *
 * Defaults to '/', which is what Netlify, Vercel and a local build all serve from.
 * `BASE_PATH` stays the override for a deployment mounted under a sub-path, which is
 * how the Replit workflow supplies it.
 */
const basePath = process.env.BASE_PATH ?? '/';

// Where the api-server listens in development. Its own default is 5000; override
// with API_PORT if it has been moved.
const apiPort = Number(process.env.API_PORT ?? 5000);

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  // `command` is 'serve' for both `vite dev` and `vite preview`, 'build' otherwise —
  // so the port is never resolved during a production build.
  const { port, strictPort } =
    command === 'serve'
      ? resolveDevServerPort()
      : { port: DEFAULT_DEV_PORT, strictPort: false };

  return {
    base: basePath,
    plugins: [
      react(),
      tailwindcss(),
      // Every Replit plugin is loaded dynamically and only when serving. They are
      // dev tooling — an error modal, a source mapper, a banner — with nothing to
      // contribute to a production bundle, and all three live in devDependencies.
      // A top-level `import` of the error overlay made a static host's build depend
      // on a Replit package being installed: if `NODE_ENV=production` prunes dev
      // dependencies, the config fails to load and the deploy dies with
      // "Cannot find module", before Vite reads a single source file.
      ...(command === 'serve'
        ? [
            await import('@replit/vite-plugin-runtime-error-modal').then((m) => m.default()),
            ...(process.env.REPL_ID !== undefined
              ? [
                  await import('@replit/vite-plugin-cartographer').then((m) =>
                    m.cartographer({
                      root: path.resolve(import.meta.dirname, '..'),
                    }),
                  ),
                  await import('@replit/vite-plugin-dev-banner').then((m) => m.devBanner()),
                ]
              : []),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(import.meta.dirname, '..', '..', 'attached_assets'),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
      // The assistant calls /api/assistant/chat on the api-server. Proxying keeps the
      // browser on one origin in development, so the request is same-origin and needs
      // no CORS allowlist entry — matching how it behaves in production.
      proxy: {
        '/api': {
          target: `http://127.0.0.1:${apiPort}`,
          changeOrigin: true,
          // Server-Sent Events must not be buffered or the reply arrives all at once.
          configure(proxy) {
            proxy.on('proxyRes', (proxyRes) => {
              if (proxyRes.headers['content-type']?.includes('text/event-stream')) {
                delete proxyRes.headers['content-length'];
              }
            });
          },
        },
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
