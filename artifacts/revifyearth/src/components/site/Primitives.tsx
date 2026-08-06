import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'wouter';

import { brandMark } from '@/data/media';

/** The official RevifyEarth mark, used exactly as supplied. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm" data-testid="link-logo">
      <img
        src={brandMark}
        alt="RevifyEarth"
        width={36}
        height={36}
        className={`h-9 w-9 object-contain ${light ? '' : 'brightness-0 saturate-100 invert-[.85]'}`}
      />
      <span
        className={`text-[14px] font-extrabold tracking-[.16em] ${light ? 'text-[#f2f0e8]' : 'text-[#142b32]'}`}
      >
        REVIFY<span className="font-medium opacity-60">EARTH</span>
      </span>
    </Link>
  );
}

/**
 * Section eyebrow.
 *
 * Pass `as="h2"` where the label is the only thing introducing a section — without
 * it the next heading in that section is an h3 sitting directly under the page h1,
 * which is a level jump for screen-reader navigation. Rendering identically either
 * way, so it is a semantics switch rather than a visual one.
 */
export function SectionLabel({
  children,
  light = false,
  as: Tag = 'div',
}: {
  children: ReactNode;
  light?: boolean;
  as?: 'div' | 'h2';
}) {
  return (
    <Tag className={`mb-7 flex items-center gap-4 ${light ? 'text-[#a8c95a]' : 'text-[#24626b]'}`}>
      <span className="h-px w-10 bg-current/40" />
      <span className="eyebrow" style={{ color: 'inherit' }}>
        {children}
      </span>
    </Tag>
  );
}

export function ArrowLink({
  children,
  href = '/contact',
  light = false,
}: {
  children: ReactNode;
  href?: string;
  light?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`focus-ring line-draw group inline-flex items-center gap-3 rounded-sm pb-2 text-[10px] font-bold uppercase tracking-[.17em] ${
        light ? 'text-[#f2f0e8]' : 'text-[#142b32]'
      }`}
      data-testid={`link-${String(children).toLowerCase().replaceAll(' ', '-')}`}
    >
      {children}
      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </Link>
  );
}

type ActionVariant = 'accent' | 'dark' | 'outline' | 'light';

const actionStyles: Record<ActionVariant, string> = {
  accent: 'bg-[#a8c95a] text-[#142b32] hover:bg-[#b7d66c]',
  dark: 'bg-[#142b32] text-[#f2f0e8] hover:bg-[#1d3d47]',
  outline: 'border border-current text-[#142b32] hover:bg-[#142b32] hover:text-[#f2f0e8]',
  light: 'bg-[#f2f0e8] text-[#142b32] hover:bg-white',
};

/**
 * The one button in the system. Every instance carries a destination and a verb —
 * there are no decorative buttons on the site.
 */
export function ActionButton({
  children,
  href,
  onClick,
  variant = 'accent',
  icon,
  type = 'button',
  className = '',
  testId,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ActionVariant;
  icon?: ReactNode;
  type?: 'button' | 'submit';
  className?: string;
  testId?: string;
}) {
  const shared = `focus-ring inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.14em] transition-all duration-300 hover:-translate-y-0.5 ${actionStyles[variant]} ${className}`;

  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    if (external) {
      return (
        <a href={href} className={shared} data-testid={testId} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {children}
          {icon}
        </a>
      );
    }
    return (
      <Link href={href} className={shared} data-testid={testId}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={shared} data-testid={testId}>
      {children}
      {icon}
    </button>
  );
}

export function Atmosphere({ dark = false }: { dark?: boolean }) {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="orb orb-a" />
      <div className="orb orb-b" />
      {dark && <div className="absolute inset-0 bg-[#142b32]/25" />}
    </div>
  );
}

export function QuoteBand({ children }: { children: ReactNode }) {
  return (
    <section className="bg-[#24626b] px-5 py-20 text-[#f2f0e8] md:px-10 md:py-28">
      <div className="mx-auto max-w-[1040px] text-center">
        <p className="font-display text-4xl leading-[1.05] tracking-[-.035em] md:text-6xl">“{children}”</p>
      </div>
    </section>
  );
}
