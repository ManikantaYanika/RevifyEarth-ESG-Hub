import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin";

const DEFAULT_DEV_PORT = 5174;

/**
 * Dev-server port. Resolved only when a server is actually being started, never for
 * `vite build` — a static host has no reason to define PORT, and throwing at module
 * scope failed the deploy before Vite read a single file. A provided value is still
 * validated and bound strictly, because the Replit workflow supplies an exact port.
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

/** '/' is what a root-served host uses; BASE_PATH overrides for a sub-path mount. */
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig(async ({ command }): Promise<UserConfig> => {
  const { port, strictPort } =
    command === "serve"
      ? resolveDevServerPort()
      : { port: DEFAULT_DEV_PORT, strictPort: false };

  return {
    base: basePath,
    plugins: [
      mockupPreviewPlugin(),
      react(),
      tailwindcss(),
      // Replit plugins are dev tooling; loading them dynamically and only when
      // serving keeps a production build from depending on devDependencies that
      // `NODE_ENV=production` would prune at install time.
      ...(command === "serve"
        ? [
            await import("@replit/vite-plugin-runtime-error-modal").then((m) =>
              m.default(),
            ),
            ...(process.env.REPL_ID !== undefined
              ? [
                  await import("@replit/vite-plugin-cartographer").then((m) =>
                    m.cartographer({
                      root: path.resolve(import.meta.dirname, ".."),
                    }),
                  ),
                ]
              : []),
          ]
        : []),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
      },
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort,
      host: "0.0.0.0",
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
