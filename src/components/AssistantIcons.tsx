import type { ReactNode } from 'react';

/**
 * One 20px line icon per assistant answer. Deliberately literal — each icon
 * draws the thing the answer describes (a section of a site, a cursor leaving
 * the viewport) rather than a decorative abstraction, so the option is
 * readable before the label is.
 */
const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" {...s}>
      {children}
    </svg>
  );
}

export const ASSISTANT_ICONS: Record<string, ReactNode> = {
  /* ---- where ---- */
  section: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M2.5 7.5h15" />
      <rect x="4.75" y="9.75" width="6" height="4.5" rx="1" fill="currentColor" opacity="0.18" stroke="none" />
      <path d="M4.75 9.75h6v4.5h-6z" />
    </Svg>
  ),
  exact: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M2.5 7.5h15" />
      <path d="M7.25 12.25l1.75 1.75 3.75-3.75" />
    </Svg>
  ),
  element: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M6.5 8h7M6.5 11h4" />
      <circle cx="14" cy="12.75" r="2.75" />
      <path d="M14 10.75v4M12 12.75h4" />
    </Svg>
  ),
  anywhere: (
    <Svg>
      <circle cx="10" cy="10" r="7" />
      <path d="M3 10h14M10 3c1.9 2 2.9 4.4 2.9 7S11.9 15 10 17C8.1 15 7.1 12.6 7.1 10S8.1 5 10 3z" />
    </Svg>
  ),

  /* ---- who ---- */
  new: (
    <Svg>
      <circle cx="8.5" cy="7" r="3" />
      <path d="M3 16.5c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" />
      <path d="M15.5 3v4M13.5 5h4" />
    </Svg>
  ),
  returning: (
    <Svg>
      <circle cx="10" cy="7" r="3" />
      <path d="M4.5 16.5c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5" />
      <path d="M3 6.5A5 5 0 0 1 6.5 3M3 3.5v3h3" />
    </Svg>
  ),
  campaign: (
    <Svg>
      <path d="M3 8.5v3a1 1 0 0 0 1 1h2l5 3.5V4L6 7.5H4a1 1 0 0 0-1 1z" />
      <path d="M14 7.5a4 4 0 0 1 0 5" />
      <path d="M16.5 5.5a7 7 0 0 1 0 9" />
    </Svg>
  ),
  everyone: (
    <Svg>
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M2.5 16c0-2.5 2.2-4 5-4s5 1.5 5 4" />
      <path d="M13 12.2c2.5.1 4.5 1.5 4.5 3.8" />
    </Svg>
  ),

  /* ---- when ---- */
  arrival: (
    <Svg>
      <path d="M10.5 2.5L4.5 11h4l-1 6.5 6-8.5h-4l1-6.5z" />
    </Svg>
  ),
  engaged: (
    <Svg>
      <rect x="6.5" y="2.5" width="7" height="11" rx="3.5" />
      <path d="M10 5.25v2" />
      <path d="M7.75 15.5L10 17.5l2.25-2" />
    </Svg>
  ),
  leaving: (
    <Svg>
      <path d="M11.5 3.5h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-4" />
      <path d="M8.5 13L3.5 8l5-5" />
      <path d="M3.5 8h9" />
    </Svg>
  ),
  always: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <rect x="14" y="7.5" width="3.5" height="5" rx="1" fill="currentColor" opacity="0.18" stroke="none" />
      <path d="M14 7.5h3.5v5H14z" />
    </Svg>
  ),

  /* ---- tone ---- */
  block: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" fill="currentColor" opacity="0.14" stroke="none" />
      <rect x="5.5" y="6.5" width="9" height="7" rx="1.5" fill="var(--surface)" />
    </Svg>
  ),
  quiet: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M5.5 6.5h9" />
      <rect x="5.5" y="8.75" width="9" height="4" rx="1" fill="currentColor" opacity="0.18" stroke="none" />
      <path d="M5.5 8.75h9v4h-9z" />
      <path d="M5.5 15h5" />
    </Svg>
  ),
  passive: (
    <Svg>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <rect x="15.25" y="7" width="2.25" height="6" rx="1.1" fill="currentColor" opacity="0.2" stroke="none" />
      <path d="M15.25 7h2.25v6h-2.25z" />
      <path d="M5.5 8h6M5.5 11h4" />
    </Svg>
  ),
};

export function AskIcon() {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" {...s}>
      <path d="M17 11.5a3 3 0 0 1-3 3H8l-4 3v-3H6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3z" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" {...s} strokeWidth={2}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  );
}
