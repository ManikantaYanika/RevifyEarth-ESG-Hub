import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, ExternalLink, Instagram, Linkedin, Menu, MoveUpRight, Play, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const asset = (name: string) => `/assets/revify/${name}`;

const nav = [
  ['About', 'about'], ['Services', 'services'], ['Industries', 'industries'],
  ['Process', 'process'], ['ESG Expertise', 'expertise'], ['Team', 'team'],
] as const;

const services = [
  ['01', 'Content Review & Gap Assessment', 'A chapter-by-chapter review to turn disclosure gaps, inconsistencies and fragmented narratives into a clear reporting foundation.'],
  ['02', 'Sustainability Report Design', 'A distinctive editorial system with five creative theme directions, custom visualisations and iterative reviews.'],
  ['03', 'Sustainable Print Production', 'FSC-certified and/or recycled paper options, proofing and considered production for a report that feels as responsible as its content.'],
  ['04', 'Board Presentation Support', 'An executive-level presentation distilling reporting-year highlights, key indicators and strategic forward-looking priorities.'],
  ['05', 'Video Report', 'A 5–7 minute visual narrative with script, storyboard, motion graphics, animated KPIs, voice-over where included and Full HD output.'],
  ['06', 'Sustainability Report Webpage Development', 'A responsive digital home for the report, from sustainability overview and thematic content to video and downloadable access.'],
  ['07', 'Integrated ESG Communication', 'One coherent strategy moving from technical review to report, print, video and web — without losing the thread.'],
];

const team = [
  ['Pallavi Priya', 'CEO and ESG Industry Expert', '10+ years of industry experience in ESG, Past Ex-Coal India, EY, Asian Paints. BTech in Environment from IITD, MBA in Sustainability from IIML.', 'team-pallavi.png'],
  ['Ananya A', 'CFO and ESG Industry Expert', '10+ years of experience in consulting & Quality Assurance. BTech in Electrical from ITER; MBA in Sustainability from IIML.', 'team-ananya.png'],
  ['Bichitra Nanda', 'Director', 'Retd. Civil Servant, Govt. of Odisha.', 'team-bichitra.png'],
  ['Sanskar', 'Marketing & Content Head', '', 'team-sanskar.png'],
  ['Sheetal', 'Report Designer & Content Creator', '', 'team-sheetal.png'],
  ['Yanika Manikantha', 'Web-Developer', '', 'team-yanika.png'],
];

function Logo({ dark = false }: { dark?: boolean }) {
  return <a href="#home" className="flex items-center gap-3" data-testid="link-logo">
    <img src={asset('revify-mark-white.png')} alt="RevifyEarth mark" className={`h-10 w-10 object-contain ${dark ? '' : 'brightness-0 saturate-100 invert-[.85]'}`} />
    <span className={`text-[15px] font-extrabold tracking-[.14em] ${dark ? 'text-[#eef1e9]' : 'text-[#f3f3ec]'}`}>REVIFY<span className="font-medium opacity-70">EARTH</span></span>
  </a>;
}

function ArrowLink({ children, href = '#contact' }: { children: React.ReactNode; href?: string }) {
  return <a href={href} className="group inline-flex items-center gap-3 border-b border-current/40 pb-2 text-[11px] font-bold uppercase tracking-[.16em] transition-colors hover:text-[#a8c95a]" data-testid={`link-${String(children).toLowerCase().replaceAll(' ', '-')}`}>
    {children}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
  </a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/15 bg-[#142b32]/85 text-[#eef1e9] backdrop-blur-md">
    <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
      <Logo dark />
      <nav className="hidden items-center gap-7 lg:flex">
        {nav.map(([label, id]) => <a key={id} href={`#${id}`} className="text-[10px] font-bold uppercase tracking-[.14em] text-white/70 transition-colors hover:text-[#a8c95a]" data-testid={`link-nav-${id}`}>{label}</a>)}
      </nav>
      <a href="#contact" className="hidden items-center gap-2 rounded-full bg-[#a8c95a] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#142b32] transition-transform hover:-translate-y-0.5 md:flex" data-testid="link-start-conversation">Start a conversation <ArrowUpRight className="h-3.5 w-3.5" /></a>
      <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="rounded-full border border-white/20 p-2 lg:hidden" data-testid="button-mobile-menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {open && <nav className="border-t border-white/10 bg-[#142b32] px-5 pb-6 pt-3 lg:hidden">{nav.map(([label, id]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`} className="block border-b border-white/10 py-4 text-xs font-bold uppercase tracking-[.14em]" data-testid={`link-mobile-nav-${id}`}>{label}</a>)}<a onClick={() => setOpen(false)} href="#contact" className="mt-5 inline-block rounded-full bg-[#a8c95a] px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#142b32]" data-testid="link-mobile-contact">Start a conversation</a></nav>}
  </header>;
}

function SectionLabel({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <div className={`mb-7 flex items-center gap-4 ${light ? 'text-[#a8c95a]' : 'text-[#24626b]'}`}><span className="font-mono-custom text-[11px]">{number}</span><span className="h-px w-10 bg-current/40" /><span className="eyebrow" style={{ color: 'inherit' }}>{children}</span></div>;
}

function Home() {
  const [showVideo, setShowVideo] = useState(false);
  return <div className="noise min-h-[100dvh] bg-[#f2f0e8] text-[#142b32]">
    <Header />
    <main>
      <section id="home" className="relative isolate flex min-h-[760px] items-end overflow-hidden bg-[#142b32] pt-24 text-[#f2f0e8] md:min-h-[850px]">
        <img src={asset('hero-birds.jpg')} alt="Seabirds above open water" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#142b32] via-[#142b32]/35 to-[#142b32]/10" />
        <div className="absolute inset-0 -z-10 bg-[#142b32]/10" />
        <div className="mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-24">
          <div className="max-w-5xl">
            <p className="eyebrow mb-7 text-[#d3dfb2] reveal">Sustainability communication / Revify Private Limited</p>
            <h1 className="font-display max-w-4xl text-[clamp(3.4rem,8.2vw,8.5rem)] leading-[.89] tracking-[-.055em] reveal reveal-delay">Make the work<br /><em>impossible</em><br />to overlook.</h1>
            <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/25 pt-5 md:flex-row md:items-end reveal reveal-delay-2">
              <p className="max-w-md text-sm leading-7 text-white/80">We turn complex ESG information into one coherent story — technically robust, visually compelling and strategically aligned.</p>
              <ArrowLink href="#about">Explore RevifyEarth</ArrowLink>
            </div>
          </div>
        </div>
        <div className="absolute bottom-7 right-7 hidden items-center gap-3 font-mono-custom text-[10px] uppercase tracking-widest text-white/65 md:flex"><span className="h-px w-16 bg-white/40" /> Scroll to navigate</div>
      </section>

      <section id="about" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[.8fr_1.2fr] md:px-10 md:py-36">
        <div><SectionLabel number="01">The proposition</SectionLabel><p className="font-display text-4xl leading-[1.05] tracking-[-.035em] text-[#24626b] md:text-6xl">One story.<br /><em>Many ways</em><br />to meet it.</p></div>
        <div className="max-w-2xl md:pt-10"><p className="text-2xl font-medium leading-[1.35] tracking-[-.025em] md:text-4xl">From writing Sagility’s first Sustainability Report to now exploring possibilities for you to be a Holistic ESG branding & Communication partner.</p><p className="mt-8 max-w-xl text-sm leading-7 text-[#3d5a5f]">Revify proposes an Integrated Sustainability Branding & Communication Program that extends beyond report preparation. We bring together sustainability consulting, strategic communication and creative excellence under one integrated engagement model.</p><div className="mt-10"><ArrowLink href="#services">See the full ecosystem</ArrowLink></div></div>
      </section>

      <section id="services" className="bg-[#dce5d0] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-[1440px]"><div className="grid gap-12 md:grid-cols-[.8fr_1.2fr]"><div><SectionLabel number="02">What we do</SectionLabel><h2 className="font-display max-w-md text-5xl leading-[.98] tracking-[-.04em] text-[#142b32] md:text-7xl">Build the<br /><em>communication</em><br />ecosystem.</h2></div><div className="md:pt-14"><p className="max-w-lg text-sm leading-7 text-[#3d5a5f]">Sustainability reporting is a strategic communication exercise — one that builds stakeholder confidence and strengthens corporate reputation.</p></div></div>
          <div className="mt-20 grid border-t border-[#8ba59a] md:grid-cols-2 lg:grid-cols-3">{services.map(([num, title, body], index) => <article key={num} className={`group border-b border-[#8ba59a] py-7 md:px-6 ${index % 2 === 0 ? 'md:border-r' : ''} lg:${index % 3 !== 2 ? 'border-r' : 'border-r-0'} lg:min-h-[250px]`} data-testid={`card-service-${num}`}><div className="flex justify-between"><span className="font-mono-custom text-xs text-[#24626b]">{num}</span><ArrowDownRight className="h-5 w-5 text-[#24626b] transition-transform group-hover:translate-x-1 group-hover:translate-y-1" /></div><h3 className="mt-12 max-w-xs text-lg font-bold tracking-[-.02em]">{title}</h3><p className="mt-4 max-w-sm text-xs leading-6 text-[#3d5a5f]">{body}</p></article>)}</div>
        </div>
      </section>

      <section className="bg-[#142b32] px-5 py-24 text-[#f2f0e8] md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><SectionLabel number="03" light>One coherent system</SectionLabel><div className="grid gap-14 md:grid-cols-[.85fr_1.15fr] md:items-center"><h2 className="font-display text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">The same<br /><em>story,</em><br />wherever it lands.</h2><div><div className="relative h-[340px] overflow-hidden md:h-[420px]"><img src={asset('forest-mist.jpg')} alt="Forest in mist" className="h-full w-full object-cover opacity-80" /><div className="absolute inset-0 bg-gradient-to-t from-[#142b32]/90 via-transparent" /><div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">{['Content Review', 'Report Design', 'Print', 'Video Report', 'ESG Website'].map((item, i) => <span key={item} className="border border-white/35 bg-[#142b32]/60 px-3 py-2 font-mono-custom text-[10px] text-white backdrop-blur-sm">{String(i + 1).padStart(2, '0')} / {item}</span>)}</div></div><p className="mt-6 max-w-lg text-sm leading-7 text-white/65">From Content Review to Report Designing to Print to Video Report to ESG Website, every touchpoint carries the same strategic intent.</p></div></div></div></section>

      <section id="industries" className="mx-auto grid max-w-[1440px] gap-12 px-5 py-24 md:grid-cols-[1.15fr_.85fr] md:px-10 md:py-36"><div className="relative min-h-[470px] overflow-hidden bg-[#24626b]"><img src={asset('volcano.jpg')} alt="Volcano in golden light" className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity opacity-75" /><div className="absolute inset-0 bg-[#24626b]/35" /><div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-[#f2f0e8]"><span className="font-mono-custom text-[10px] uppercase tracking-widest">Evidence / Context / Direction</span><span className="font-display text-5xl italic">01</span></div></div><div className="flex flex-col justify-center"><SectionLabel number="04">The point of view</SectionLabel><h2 className="font-display text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">Clarity is<br /><em>a form of</em><br />leadership.</h2><p className="mt-8 max-w-md text-sm leading-7 text-[#3d5a5f]">For organisations with important sustainability work to communicate, the challenge is rarely a lack of information. It is making the information land — with the right context, confidence and creative signal.</p><div className="mt-9"><ArrowLink href="#expertise">Our ESG expertise</ArrowLink></div></div></section>

      <section id="process" className="border-y border-[#b8c9bd] bg-[#f8f6ef] px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><SectionLabel number="05">A considered process</SectionLabel><div className="grid gap-12 md:grid-cols-[.7fr_1.3fr]"><h2 className="font-display text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">From first<br /><em>evidence</em><br />to final frame.</h2><div><p className="mb-12 max-w-lg text-sm leading-7 text-[#3d5a5f]">A collaborative, practical process that keeps the work moving and the narrative honest. Data collection may vary and the timeline assumes up to 6 weeks for data collection.</p><div className="grid border-t border-[#b8c9bd] sm:grid-cols-2">{['Project kick-off', 'Data collection templates', 'Literature review', 'Data collection support', 'Lifecycle inventory using collected data', 'Evaluation of environmental impacts', 'Consolidate / final report', 'Presentation of results'].map((step, i) => <div key={step} className="flex gap-4 border-b border-[#b8c9bd] py-5"><span className="font-mono-custom text-[10px] text-[#24626b]">0{i + 1}</span><span className="text-sm font-semibold">{step}</span></div>)}</div></div></div></div></section>

      <section id="expertise" className="bg-[#24626b] px-5 py-24 text-[#f2f0e8] md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><SectionLabel number="06" light>Why Revify</SectionLabel><div className="grid gap-16 md:grid-cols-[.8fr_1.2fr]"><div><h2 className="font-display text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">The rigour<br /><em>behind the</em><br />beauty.</h2><p className="mt-8 max-w-sm text-sm leading-7 text-white/70">Technical understanding, strategic storytelling and premium creative design — brought together under one engagement.</p></div><div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">{[['ESG Expertise', 'Sustainability reporting frameworks, climate disclosures, ESG strategy and environmental performance.'], ['Integrated Communication', 'Technical review and report design to multimedia communication and digital experiences under one strategy.'], ['Strategic Storytelling', 'Transform technical sustainability information into meaningful narratives.'], ['Long-term Partnership', 'Continuity, consistency and fresh perspectives each reporting cycle.'], ['Premium Creative Design', 'Editorial design, infographics, data visualisation and stakeholder-centric design.']].map(([title, body], i) => <div key={title} className="border-t border-white/25 pt-5"><div className="mb-5 flex items-center justify-between"><span className="font-mono-custom text-[10px] text-[#a8c95a]">0{i + 1}</span><Plus className="h-4 w-4 text-[#a8c95a]" /></div><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-xs leading-6 text-white/65">{body}</p></div>)}</div></div></div></section>

      <section id="team" className="bg-[#e7dfd0] px-5 py-24 md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><SectionLabel number="07">The people</SectionLabel><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><h2 className="font-display max-w-2xl text-5xl leading-[.97] tracking-[-.04em] md:text-7xl">A partner at<br /><em>every level</em> of the story.</h2><p className="max-w-xs text-sm leading-7 text-[#3d5a5f]">A cross-disciplinary team for the work that needs both precision and perspective.</p></div><div className="mt-16 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{team.map(([name, role, bio, image], i) => <article key={name} className="group border-t border-[#bbaF9d] pt-5" data-testid={`card-team-${i}`}><div className="relative mb-5 flex h-[290px] items-end justify-center overflow-hidden bg-[#c8d0ca]"><div className="absolute inset-0 bg-gradient-to-t from-[#24626b]/25 to-transparent" /><img src={asset(image)} alt={name} className="relative h-full w-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04]" /></div><h3 className="text-lg font-extrabold">{name}</h3><p className="mt-1 font-mono-custom text-[10px] uppercase tracking-wider text-[#24626b]">{role}</p>{bio && <p className="mt-3 text-xs leading-6 text-[#3d5a5f]">{bio}</p>}</article>)}</div></div></section>

      <section className="relative overflow-hidden bg-[#142b32] px-5 py-24 text-[#f2f0e8] md:px-10 md:py-32"><img src={asset('mountain-sunset.jpg')} alt="Mountain landscape at sunset" className="absolute inset-0 h-full w-full object-cover opacity-25" /><div className="relative mx-auto max-w-[1440px]"><div className="grid gap-12 md:grid-cols-[1fr_.8fr] md:items-end"><div><SectionLabel number="08" light>Go beyond the report</SectionLabel><h2 className="font-display max-w-3xl text-5xl leading-[.95] tracking-[-.04em] md:text-8xl">Give the work<br /><em>a wider life.</em></h2></div><div><p className="max-w-sm text-sm leading-7 text-white/70">A 5–7 minute visual narrative can give the reporting year a different kind of reach — through concept, script, storyboard, motion graphics and animated data visualisations.</p><button type="button" onClick={() => setShowVideo(true)} className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#a8c95a] px-5 py-3 text-[10px] font-extrabold uppercase tracking-widest text-[#142b32]" data-testid="button-video-preview"><Play className="h-3.5 w-3.5 fill-current" /> Preview the approach</button></div></div></div></section>

      <section id="contact" className="bg-[#a8c95a] px-5 py-24 text-[#142b32] md:px-10 md:py-32"><div className="mx-auto max-w-[1440px]"><SectionLabel number="09">Start here</SectionLabel><div className="grid gap-14 md:grid-cols-[1.1fr_.9fr]"><div><h2 className="font-display max-w-3xl text-6xl leading-[.92] tracking-[-.05em] md:text-8xl">Your story<br /><em>deserves</em><br />a system.</h2><p className="mt-9 max-w-md text-sm leading-7">Engagements are scoped to the brief. Tell us what you are working on and where the story needs to go.</p></div><div className="flex flex-col justify-end"><div className="border-t border-[#142b32]/30 pt-5"><p className="eyebrow text-[#142b32]">General enquiries</p><a href="mailto:info@revifyearth.com" className="mt-3 block text-xl font-bold hover:underline" data-testid="link-email">info@revifyearth.com</a><a href="https://www.revifyearth.com" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-sm hover:underline" data-testid="link-website">www.revifyearth.com <ExternalLink className="h-3.5 w-3.5" /></a></div><div className="mt-10 border-t border-[#142b32]/30 pt-5"><p className="eyebrow text-[#142b32]">Partnership & project contacts</p><p className="mt-4 text-sm font-semibold">Anu Ananya <span className="font-normal opacity-70">/ Sagility Partnership Manager / CFO</span></p><a href="tel:7978869701" className="text-sm hover:underline" data-testid="link-phone-anu">7978869701</a><p className="mt-4 text-sm font-semibold">Pallavi Priya <span className="font-normal opacity-70">/ Project Manager / CEO</span></p><a href="tel:9608159460" className="text-sm hover:underline" data-testid="link-phone-pallavi">9608159460</a></div></div></div></div></section>
    </main>
    <footer className="bg-[#10252b] px-5 py-10 text-[#eef1e9] md:px-10"><div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-end md:justify-between"><div><Logo dark /><p className="mt-5 max-w-xs text-xs leading-6 text-white/50">Revify Private Limited — ESG Branding & Sustainability Communication.</p></div><div className="flex flex-col gap-4 md:items-end"><div className="flex gap-5"><a href="https://www.linkedin.com" aria-label="LinkedIn" className="text-white/60 hover:text-[#a8c95a]" data-testid="link-linkedin"><Linkedin className="h-4 w-4" /></a><a href="https://www.instagram.com" aria-label="Instagram" className="text-white/60 hover:text-[#a8c95a]" data-testid="link-instagram"><Instagram className="h-4 w-4" /></a></div><p className="font-mono-custom text-[10px] text-white/45">© 2026 Revify Private Limited, All rights reserved.</p></div></div></footer>
    {showVideo && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10252b]/85 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Video report approach" onClick={() => setShowVideo(false)}><div className="relative w-full max-w-2xl bg-[#f2f0e8] p-7 text-[#142b32] md:p-12" onClick={(e) => e.stopPropagation()}><button type="button" className="absolute right-5 top-5" onClick={() => setShowVideo(false)} aria-label="Close video preview" data-testid="button-close-video"><X className="h-5 w-5" /></button><p className="eyebrow">Video report / approach</p><h2 className="mt-6 font-display text-5xl leading-none">Not page-by-page.<br /><em>A visual narrative.</em></h2><p className="mt-6 max-w-lg text-sm leading-7 text-[#3d5a5f]">Narrative and creative concept, script, storyboard, motion graphics, animated KPIs and data visualisations, report graphics, provided footage and photos, licensed stock, on-screen text, licensed background music, voice-over where included, editing, transitions and final render.</p><div className="mt-8 flex flex-wrap gap-2">{['Full HD output', '2 × 30-second Instagram clips', 'Report identity'].map(x => <span key={x} className="border border-[#b8c9bd] px-3 py-2 font-mono-custom text-[10px]">{x}</span>)}</div></div></div>}
  </div>;
}

function Router() { return <Switch><Route path="/" component={Home} /><Route component={Home} /></Switch>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;