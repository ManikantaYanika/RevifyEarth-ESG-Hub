import { createRoot } from 'react-dom/client';

import { initMotionSystem } from './animations';
import App from './App';

import './index.css';

/**
 * Recover from a deploy that happened while the page was open.
 *
 * Every route except Home is a code-split chunk with a content hash in its name.
 * After a redeploy those old names no longer exist, so a tab still running the
 * previous build fails to load the page it was asked to open — the click appears to
 * do nothing, then the app unmounts to a blank screen. Vite reports exactly this
 * failure as `vite:preloadError`; reloading fetches the current index.html and
 * with it the current chunk names, landing on the URL that was requested.
 *
 * Guarded so a chunk that is genuinely broken cannot cause a reload loop: within
 * the window after one recovery reload, the error is left to surface instead.
 */
const RELOAD_KEY = 'revify:chunk-reload';
const RELOAD_WINDOW_MS = 10_000;

window.addEventListener('vite:preloadError', (event) => {
  let last = 0;
  try {
    last = Number(sessionStorage.getItem(RELOAD_KEY)) || 0;
  } catch {
    // Storage blocked: without a guard, reloading could loop, so let the error surface.
    return;
  }
  if (Date.now() - last < RELOAD_WINDOW_MS) return;

  try {
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return;
  }
  event.preventDefault();
  window.location.reload();
});

// Palette, gradients and background tokens, before the first paint.
initMotionSystem();

createRoot(document.getElementById('root')!).render(<App />);
