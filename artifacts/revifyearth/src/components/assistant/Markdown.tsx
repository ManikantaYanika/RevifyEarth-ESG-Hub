import { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Markdown renderer for assistant replies.
 *
 * XSS posture: react-markdown builds a React element tree and never uses
 * `dangerouslySetInnerHTML`. Raw HTML in the model's output is escaped as text
 * because `rehype-raw` is deliberately not installed, so a reply containing
 * `<script>` renders as visible characters rather than executing.
 *
 * Components are mapped explicitly instead of using the typography plugin so the
 * chat panel keeps the site's own type scale on a dark surface.
 */

const components: Components = {
  p: ({ children }) => <p className="mb-3 leading-6 last:mb-0">{children}</p>,

  h1: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-bold text-[#f2f0e8] first:mt-0 sm:text-[13px]">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 mt-4 text-sm font-bold text-[#f2f0e8] first:mt-0 sm:text-[13px]">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mb-2 mt-3 text-[12px] font-bold text-[#f2f0e8] first:mt-0">{children}</h4>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-3 text-[12px] font-bold text-[#f2f0e8] first:mt-0">{children}</h4>
  ),

  // Markers are styled from the parent: react-markdown v10 gives `li` no indication
  // of which list type contains it, so an `li` renderer cannot branch on it.
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1.5 last:mb-0 [&>li]:relative [&>li]:pl-4 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:text-[#a8c95a] [&>li]:before:content-['—']">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-4 last:mb-0 marker:text-[#a8c95a]">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-6">{children}</li>,

  strong: ({ children }) => <strong className="font-bold text-[#f2f0e8]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,

  a: ({ children, href }) => {
    // Model output is untrusted: only http(s) and mailto survive, which rules out
    // javascript: and data: URLs. Anything else renders as plain text.
    const safe =
      typeof href === 'string' && /^(https?:|mailto:|\/)/i.test(href) ? href : undefined;

    if (!safe) return <span>{children}</span>;

    const external = /^https?:/i.test(safe);
    return (
      <a
        href={safe}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="focus-ring rounded-sm text-[#a8c95a] underline decoration-[#a8c95a]/40 underline-offset-2 hover:decoration-[#a8c95a]"
      >
        {children}
      </a>
    );
  },

  code: ({ children, className }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return (
        <code className="font-mono-custom block text-[11px] leading-5 text-[#d3dfb2]">{children}</code>
      );
    }
    return (
      <code className="font-mono-custom rounded-sm bg-white/10 px-1 py-0.5 text-[11px] text-[#d3dfb2]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-sm border border-white/10 bg-black/25 p-3 last:mb-0">
      {children}
    </pre>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-[#a8c95a] pl-3 italic text-white/70 last:mb-0">
      {children}
    </blockquote>
  ),

  // Tables are the reason remark-gfm is here. The wrapper scrolls independently so a
  // wide comparison never pushes the panel sideways.
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto last:mb-0">
      <table className="w-full border-collapse text-left text-[11px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-white/20">{children}</thead>,
  th: ({ children }) => (
    <th className="whitespace-nowrap px-2 py-1.5 font-bold text-[#f2f0e8]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-b border-white/10 px-2 py-1.5 align-top leading-5">{children}</td>
  ),

  hr: () => <hr className="my-4 border-white/15" />,
};

/**
 * Memoised on `content`. During a stream this re-parses on every delta, and the
 * transcript above the streaming reply must not re-render with it.
 */
export const Markdown = memo(function Markdown({ content }: { content: string }) {
  return (
    // 13px on a phone, 12px in the narrower desktop card. A consultant-length answer
    // at 12px on a 320px screen is a wall of grey.
    <div className="text-[13px] text-white/80 sm:text-xs">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
