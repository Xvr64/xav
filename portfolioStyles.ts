import { buildAbyssCss } from './abyssPalette';

// ============================================================================
// GLOBAL PAGE CSS — the reset, the Globe caption's entrance and the abyss palette.
// Families, type roles, grid and spacing live in terminal.css (the single source).
// ============================================================================

export const GLOBAL_PORTFOLIO_CSS = `
  /* Global CSS Reset for sizing and overflow prevention */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }
  /* Hide scrollbar visually while keeping full scroll functionality */
  html {
    scroll-padding-top: 4.5rem;
    overflow-y: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  body {
    scrollbar-width: none;
    -ms-overflow-style: none;
    font-family: var(--font-sans);
    background-color: #FFFFFF;
    color: var(--ink-primary);
    font-size: var(--text-body);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-body);
    font-size-adjust: none;
    font-synthesis: none;
    font-kerning: normal;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar {
    display: none;
    width: 0px;
    background: transparent;
  }
  button, input, textarea, select { font-family: inherit; }

  @keyframes globeCaptionIn {
    from { opacity: 0; transform: translate3d(0, 6px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  .globe-caption-in { animation: globeCaptionIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }

  /* Depth legibility: a halo around all page text in the colour of the water behind it */
  .ocean-legible {
    text-shadow:
      0 0 2px var(--abyss-halo),
      0 0 9px var(--abyss-halo);
  }

  /* ABYSS PALETTE */
  ${buildAbyssCss()}

  @media (prefers-reduced-motion: reduce) {
    .globe-caption-in { animation: none; }
  }
`;
