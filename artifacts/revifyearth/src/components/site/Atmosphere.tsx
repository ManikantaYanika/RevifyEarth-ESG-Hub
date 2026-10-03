import { AnimatedBackground } from '@/animations/background/AnimatedBackground';

/**
 * Site entry points to the background engine. The engine, its layers and every
 * value it uses live in src/animations; these only choose the variant.
 */

/** Hero background — sits at z-index -1 inside the hero's isolated section. */
export function Atmosphere({ dark = false }: { dark?: boolean }) {
  return <AnimatedBackground variant={dark ? 'heroDark' : 'heroLight'} />;
}

/** Page-wide field, fixed behind the shell; shows through every cream section. */
export function AmbientBackdrop() {
  return <AnimatedBackground variant="page" fixed />;
}
