import { Component, Suspense, lazy, type ReactNode } from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

import { Assistant } from '@/components/layout/Assistant';
import { PageMeta, ScrollProgress, ScrollToTop, SkipLink } from '@/components/layout/Chrome';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/animations/scroll/SmoothScroll';
import { InteractionLayer } from '@/components/animation/InteractionLayer';
import { AmbientBackdrop } from '@/components/site/Atmosphere';
import { ActionButton } from '@/components/site/Primitives';
import { Home } from '@/pages/Home';

/**
 * Home ships in the initial chunk because it is the landing route; every other page
 * is split out and fetched on navigation. Previously the whole site was one bundle.
 */
const named = <T extends string>(loader: () => Promise<Record<T, React.ComponentType<never>>>, key: T) =>
  lazy(() => loader().then((module) => ({ default: module[key] })));

const About = named(() => import('@/pages/About'), 'About');
const Services = named(() => import('@/pages/Services'), 'Services');
const ServiceDetail = lazy(() =>
  import('@/pages/ServiceDetail').then((module) => ({ default: module.ServiceDetail })),
);
const Expertise = named(() => import('@/pages/Expertise'), 'Expertise');
const Branding = named(() => import('@/pages/Branding'), 'Branding');
const Industries = named(() => import('@/pages/Industries'), 'Industries');
const Process = named(() => import('@/pages/Process'), 'Process');
const Team = named(() => import('@/pages/Team'), 'Team');
const Projects = named(() => import('@/pages/Projects'), 'Projects');
const Resources = named(() => import('@/pages/Resources'), 'Resources');
const Contact = named(() => import('@/pages/Contact'), 'Contact');
const NotFound = named(() => import('@/pages/NotFound'), 'NotFound');

/**
 * Shown while a route's chunk loads. Fills the viewport so the footer starts below
 * the fold: at 60vh the footer was on screen and jumped down when the page arrived,
 * which was the whole of a ~0.31 CLS on every directly loaded page except Home.
 */
function RouteLoading() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f2f0e8]" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <span className="route-loader" aria-hidden="true" />
    </div>
  );
}

/**
 * Contains a route that fails to render — in practice a page chunk that could not
 * be fetched even after the one recovery reload in main.tsx (offline, a dropped
 * connection). Without it the error unmounted the whole app to a blank screen; now
 * the header and footer stay usable and the visitor can retry or go elsewhere.
 * `resetKey` is the location, so navigating away clears the failure.
 */
class RouteErrorBoundary extends Component<{ resetKey: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(previous: { resetKey: string }) {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) this.setState({ failed: false });
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="flex min-h-[60vh] items-center bg-[#f2f0e8] px-5 py-24 md:px-10" role="alert">
        <div className="mx-auto w-full max-w-[1440px]">
          <p className="eyebrow">Connection</p>
          <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.6rem,6vw,5rem)] leading-[.95] tracking-[-.04em]">
            This page did not load.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#3d5a5f]">
            Check your connection and try again. Everything else on the site is still available from the menu.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ActionButton onClick={() => window.location.reload()} variant="dark">
              Try again
            </ActionButton>
            <ActionButton href="/" variant="outline">
              Back to home
            </ActionButton>
          </div>
        </div>
      </section>
    );
  }
}

function RouteBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <RouteErrorBoundary resetKey={location}>{children}</RouteErrorBoundary>;
}

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/services/:slug">{(params) => <ServiceDetail slug={params.slug} />}</Route>
      <Route path="/expertise" component={Expertise} />
      <Route path="/sustainability-branding" component={Branding} />
      <Route path="/industries" component={Industries} />
      <Route path="/process" component={Process} />
      <Route path="/team" component={Team} />
      <Route path="/projects" component={Projects} />
      <Route path="/resources" component={Resources} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Persistent app shell.
 *
 * Header, footer and the assistant live above the router, so navigating no longer
 * unmounts them — the assistant used to lose its conversation on every route change
 * because it was rendered inside each page.
 */
function Shell() {
  return (
    // `isolate` makes the shell the stacking context, so the ambient layer's negative
    // z-index paints above this cream background but beneath every section.
    <div className="noise isolate min-h-dvh bg-[#f2f0e8] text-[#142b32]">
      <AmbientBackdrop />
      <SmoothScroll />
      <InteractionLayer />
      <SkipLink />
      <PageMeta />
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1}>
        <RouteBoundary>
          <Suspense fallback={<RouteLoading />}>
            <Routes />
          </Suspense>
        </RouteBoundary>
      </main>
      <Footer />
      <Assistant />
    </div>
  );
}

/*
 * No query-client, tooltip or toast providers: nothing on the site queries, shows a
 * tooltip or raises a toast, and mounting them put React Query, Radix Toast/Tooltip,
 * floating-ui and tailwind-merge into the bundle every page loads first. Wrap the
 * shell in the relevant provider again if a component starts to need one.
 */
function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Shell />
    </WouterRouter>
  );
}

export default App;
