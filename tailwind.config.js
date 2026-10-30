/**
 * Build-time Tailwind, replacing the Play CDN that compiled utilities in the browser.
 * Pinned to 3.4.17, the version the CDN served, with the same theme extension it was given
 * in index.html, so the generated rules (preflight included) are the ones the page was tuned on.
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ['./index.html', './*.{ts,tsx}', '!./archivedComponents.tsx'],
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
