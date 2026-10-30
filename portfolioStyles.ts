import { buildAbyssCss } from './abyssPalette';

// ============================================================================
// MAIN APPLICATION COMPONENT & REDESIGNED OCEANIC TYPOGRAPHY SYSTEM
// ============================================================================

export const GLOBAL_PORTFOLIO_CSS = `
  /* Families, type scale and spacing tokens live in terminal.css (the single source). */
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

  /* Typography tokens */
  .font-sans, .cv-arch, .font-arch { font-family: var(--font-sans); font-style: normal; }
  .font-mono, .font-tech, .font-annot { font-family: var(--font-mono); font-style: normal; letter-spacing: var(--tracking-mono); }
  .font-serif { font-family: var(--font-display); font-variation-settings: 'opsz' 72; }
  
  /* Hero / Cover display typography */
  #home .font-display, .hero-display { font-family: var(--font-hero); }
  #home .font-title { font-family: var(--font-hero-title); }
  .font-display { font-family: var(--font-hero); }
  .font-title { font-family: var(--font-sans); }

  /* Fluid typography & oceanic scales */
  .ocean-h2 {
    font-family: var(--font-sans);
    font-size: var(--text-h2);
    line-height: var(--leading-h2);
    letter-spacing: var(--tracking-h2);
    font-weight: 400;
    color: var(--ink-primary);
    text-wrap: balance;
  }
  .ocean-h3 {
    font-family: var(--font-sans);
    font-size: var(--text-h3);
    line-height: var(--leading-h3);
    letter-spacing: var(--tracking-h3);
    font-weight: 400;
    color: var(--ink-primary);
  }
  .ocean-meta {
    font-family: var(--font-mono);
    font-size: var(--text-meta);
    line-height: var(--leading-meta);
    letter-spacing: var(--tracking-mono-wide);
    text-transform: uppercase;
  }
  .ocean-body {
    font-family: var(--font-sans);
    font-size: var(--text-body);
    line-height: var(--leading-body);
    letter-spacing: var(--tracking-body);
    color: #1F2428;
  }

  /* Oceanic detached floating section numbers */
  .ocean-float-num {
    font-family: var(--font-mono);
    font-size: clamp(4.5rem, 3rem + 5vw, 7.5rem);
    font-weight: 300;
    line-height: 0.9;
    letter-spacing: -0.06em;
    color: var(--ink-171717);
    opacity: 0.16;
    user-select: none;
    pointer-events: none;
    will-change: transform;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Oceanic interactive hover for unboxed skills */
  .ocean-skill-item {
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  }
  @media (hover: hover) {
    .ocean-skill-item:hover {
      transform: translate3d(6px, 0, 0);
    }
  }

  /* Oceanic tide: dynamic typographic fluid shift with floating animation */
  .tide-word { display: inline-grid; justify-items: start; vertical-align: baseline; }
  .tide-layer {
    grid-area: 1 / 1;
    opacity: 0;
    white-space: nowrap;
    animation-name: tideCycle;
    animation-duration: 7s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: opacity, filter;
    backface-visibility: hidden;
  }
  @keyframes tideCycle {
    0% {
      opacity: 0;
      filter: blur(3px);
      animation-timing-function: cubic-bezier(0.33, 0, 0.2, 1);
    }
    6% {
      opacity: 1;
      filter: blur(0px);
    }
    25% {
      opacity: 1;
      filter: blur(0px);
      animation-timing-function: cubic-bezier(0.6, 0, 0.8, 1);
    }
    31% {
      opacity: 0;
      filter: blur(3px);
    }
    100% {
      opacity: 0;
      filter: blur(3px);
    }
  }
  .globe-city-label { display: inline-block; }
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

  /* Opening typography: wave-like waterline emergence */
  @keyframes oceanWordRise {
    0% {
      opacity: 0;
      transform: translate3d(0, 0.38em, 0);
      clip-path: inset(-20% -20% 88% -20%);
      filter: blur(3px);
    }
    58% {
      opacity: 0.94;
      clip-path: inset(-28% -22% -32% -22%);
      filter: blur(0.5px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      clip-path: inset(-28% -22% -32% -22%);
      filter: blur(0px);
    }
  }
  @keyframes oceanSoftRise {
    0% {
      opacity: 0;
      transform: translate3d(0, 0.32em, 0);
      filter: blur(2px);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      filter: blur(0px);
    }
  }
  .ocean-wave-word {
    display: inline-block;
    animation-name: oceanWordRise;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    animation-fill-mode: both;
    will-change: transform, opacity, clip-path, filter;
  }
  .ocean-subtitle-in {
    animation: oceanSoftRise 0.82s cubic-bezier(0.22, 1, 0.36, 1) 1.18s both;
    will-change: transform, opacity, filter;
  }
  .ocean-cue-in {
    animation: oceanSoftRise 0.75s cubic-bezier(0.22, 1, 0.36, 1) 1.42s both;
  }
  @media (prefers-reduced-motion: reduce) {
    .tide-layer { animation: none; transform: none; filter: none; }
    .globe-caption-in { animation: none; }
    .ocean-wave-word,
    .ocean-subtitle-in,
    .ocean-cue-in {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
      clip-path: none !important;
    }
    .ocean-float-num { transform: none !important; }
    .ocean-skill-item:hover { transform: none !important; }
    .sr-only + .tide-layer { opacity: 1; }
  }
  @keyframes pulseLine {
    0%, 100% { transform: scaleY(0.35); transform-origin: top; opacity: 0.4; }
    50% { transform: scaleY(1); transform-origin: top; opacity: 1; }
  }
  .animate-scroll-line { animation: pulseLine 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
  [data-home-offscreen="true"] .tide-layer,
  [data-home-offscreen="true"] .animate-scroll-line,
  [data-home-offscreen="true"] .animate-pulse {
    animation-play-state: paused !important;
  }
`;
