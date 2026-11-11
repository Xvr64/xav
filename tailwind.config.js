/**
 * Build-time Tailwind, replacing the Play CDN that compiled utilities in the browser.
 * Pinned to 3.4.17, the version the CDN served, with the same theme extension it was given
 * in index.html, so the generated rules (preflight included) are the ones the page was tuned on.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './*.{ts,tsx}', '!./archivedComponents.tsx'],
  // Without this, preflight's `*, ::before, ::after` rule gives every element (and both of its
  // pseudo-elements) some fifty --tw-* custom properties, and any whole-document restyle on this
  // page costs 18-30 ms instead of 13-14 (measured, 2026-11). With it, each default is declared only on the
  // utilities that read it (transforms, rings, shadows, filters), which is all the page needs.
  experimental: { optimizeUniversalDefaults: true },
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        display: ['Newsreader', 'Georgia', 'serif']
      }
    }
  }
};
