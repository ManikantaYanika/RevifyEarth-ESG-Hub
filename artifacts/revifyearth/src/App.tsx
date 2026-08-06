import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { Assistant } from '@/components/layout/Assistant';
import { PageMeta, ScrollProgress, ScrollToTop, SkipLink } from '@/components/layout/Chrome';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Home } from '@/pages/Home';

const queryClient = new QueryClient();

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

function RouteLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#f2f0e8]" role="status" aria-live="polite">
      <span className="sr-only">Loading page</span>
      <span className="route-loader" aria-hidden="true" />
    </div>
  );
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
    <div className="noise min-h-dvh bg-[#f2f0e8] text-[#142b32]">
      <SkipLink />
      <PageMeta />
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<RouteLoading />}>
          <Routes />
        </Suspense>
      </main>
      <Footer />
      <Assistant />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Shell />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
