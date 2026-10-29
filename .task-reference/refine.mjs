import fs from 'node:fs';
const file = 'xavier_h_ry_editorial_portfolio.tsx';
let s = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
function replace(a,b) { if (!s.includes(a)) throw new Error('Missing: '+a.slice(0,80)); s=s.replace(a,b); }
function between(a,b,value) { const i=s.indexOf(a), j=s.indexOf(b,i); if(i<0||j<0) throw new Error(a); s=s.slice(0,i)+value+s.slice(j); }
replace('createAsciiJellyfishField, createAsciiFishingBoat','createAsciiJellyfishField, createAsciiFishingBoat, boatSurfaceY');
between('/** Page descent progress:', '/** Ink flip', `/** Accelerates into deep water, then settles smoothly at black within one viewport. */
const abyssFromProgress = (progress: number) => {
  const t = Math.max(0, Math.min(1, progress));
  // Exponential of squared progress: acceleration at entry, a soft tail at the end.
  return -Math.expm1(-6 * t * t) / -Math.expm1(-6);
};
`);
between('function applyAbyssWash(', '\nfunction buildAbyssCss()', `function applyAbyssWash(abyssLevel: number) {
  const shade = Math.round(255 * (1 - abyssLevel));
  const root = document.documentElement.style;
  root.setProperty('--ocean-background', \`rgb(\${shade}, \${shade}, \${shade})\`);
  root.setProperty('--abyss-wash', \`\${shade}, \${shade}, \${shade}\`);
  root.setProperty('--abyss-halo', \`rgba(\${shade}, \${shade}, \${shade}, 0.82)\`);
}
`);
replace('--abyss-halo: rgba(245, 243, 238, 0.85);\n    --abyss-wash: 245, 243, 238;', '--ocean-background: #FFFFFF;\n    --abyss-halo: rgba(255, 255, 255, 0.85);\n    --abyss-wash: 255, 255, 255;');
replace('  rules.push(`.glass-panel', '  rules.push(`html, body { background-color: var(--ocean-background); }`);\n  rules.push(`.glass-panel');
between('      // Night palette: the globe', '      const mc =', '      // The entire Globe section remains in its daylight palette.\n      const nt = 0;\n');
between('      {/* Journey timeline:', '\n    </div>\n  );\n});', '');
replace("  const dwellStops = segs.filter((s) => s.kind === 'dwell');\n", '');
replace('    let lastBackdropTime = -999;\n', '');
replace('    let docScrollable = 1;\n', '    let docScrollable = 1;\n    let globeEnd = Infinity;\n    let transitionDistance = 1;\n');
replace('      docScrollable = Math.max(1, document.documentElement.scrollHeight - h);', `      docScrollable = Math.max(1, document.documentElement.scrollHeight - h);
      const globe = document.getElementById('global');
      globeEnd = globe ? globe.getBoundingClientRect().bottom + window.scrollY : Infinity;
      transitionDistance = Math.max(1, Math.min(h, docScrollable - globeEnd));`);
replace("    handleResize();\n    window.addEventListener('resize', handleResize);", `    handleResize();
    const layoutObserver = new ResizeObserver(handleResize);
    layoutObserver.observe(document.documentElement);
    const globeSection = document.getElementById('global');
    if (globeSection) layoutObserver.observe(globeSection);
    window.addEventListener('resize', handleResize);`);
s=s.replaceAll('h * 0.165 -', 'boatSurfaceY(w, h) -');
between('      // 1. Warm bright surface atmosphere', '      // 3. ASCII fishing boat:', `      // A sparse three-row band follows the same sampled surface as the hull.
      // No sky fill or continuous bright crest: the page stays pure white here.
      ctx.save();
      ctx.font = '400 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const waveStep = 13;
      const waveChars = ['.', '-', "'", ',', '-'];
      for (let row = 0; row < 3; row++) {
        for (let i = 0; i <= Math.ceil(w / waveStep); i++) {
          const seed = ((i * 73 + row * 31) % 101) / 101;
          if (seed > 0.42 + row * 0.12) continue;
          const wx = i * waveStep + row * 4;
          const wy = sampleSurfaceY(wx) + row * 5 + (seed - 0.5) * 4;
          const breath = 0.9 + 0.1 * Math.sin(wx * 0.012 + time * 0.3);
          ctx.fillStyle = \`rgba(38, 70, 86, \${((0.16 - row * 0.035) * breath).toFixed(3)})\`;
          ctx.fillText(waveChars[(i + row * 2) % waveChars.length], wx, wy);
        }
      }
      ctx.restore();

`);
replace('// ONE linear, clamped page progress drives the whole descent (no section triggers, no ease-in)', '// Preserve overall page progress for creature movement and ocean texture.');
replace('// ABYSS: a subtle hint of deep water at the very top, rising linearly to full night at 100%\n      const abyss = isFocus ? 0 : abyssFromProgress(rawDepth);', '// Actual scroll (not the lagging creature position) guarantees white on upward return.\n      const abyss = isFocus ? 0 : abyssFromProgress((curScrollY - globeEnd) / transitionDistance);');
replace('if (!isFocus && Math.abs(abyss - lastWashAbyss) > 0.004)', 'if (!isFocus && abyss !== lastWashAbyss)');
replace('applyAbyssWash(abyss, inkMixS, rawDepth);', 'applyAbyssWash(abyss);');
between('      // 1A / 1C.', '\n      const cols = gridCols;', `      // Reuse the cached backdrop and animation loop for an exact neutral background.
      if (waterBackdropCtx && (!backdropValid || abyss !== lastBackdropDepth)) {
        const shade = Math.round(255 * (1 - abyss));
        waterBackdropCtx.fillStyle = \`rgb(\${shade}, \${shade}, \${shade})\`;
        waterBackdropCtx.fillRect(0, 0, backdropW, backdropH);
        lastBackdropDepth = abyss;
        backdropValid = true;
      }
      if (backdropValid) ctx.drawImage(waterBackdropCanvas, 0, 0, w, h);
`);
replace('          if (waveVal > densityCutoff) {', `          // Fade character density into the sampled horizon instead of a rectangular cutoff.
          const surfaceDistance = isFocus ? 100 : py - sampleSurfaceY(oc * oceanCell);
          if (surfaceBaseY > -h * 0.35 && surfaceDistance < 0) continue;
          const horizonT = Math.max(0, Math.min(1, surfaceDistance / (oceanCell * 3)));
          const horizonOpacity = horizonT * horizonT * (3 - 2 * horizonT);
          if (waveVal > densityCutoff) {
            ctx.globalAlpha = horizonOpacity;`);
replace('      // 2B. Subtle drifting', '      ctx.globalAlpha = 1;\n\n      // 2B. Subtle drifting');
replace("      window.removeEventListener('resize', handleResize);\n      window.removeEventListener('mousemove', handleMouseMove);", "      layoutObserver.disconnect();\n      window.removeEventListener('resize', handleResize);\n      window.removeEventListener('mousemove', handleMouseMove);");
between('                {/* Desktop Interactive Annual Whale', '                {/* Readable Line Groups', '                <div aria-hidden="true" className="hidden lg:block lg:col-span-5" />\n\n');
between('                  <div\n                    style={{\n                      opacity: group3CReveal,', '\n                </div>\n              </div>\n            </div>', '');
between('      {/* Mobile Usable Fallback Strip', '    </section>\n  );\n});', '');
replace('min-h-screen bg-[#F5F3EE] text-[#171717]', 'min-h-screen bg-[var(--ocean-background)] text-[#171717]');
fs.writeFileSync(file,s);
let boat=fs.readFileSync('asciiOceanLife.ts','utf8');
boat=boat.replace('const BOAT_LH = 38;', `const boatCell = (w: number) => (w < 640 ? 4.6 : w < 1024 ? 5.6 : 6.4) * 1.75;
// Give the enlarged mast room above the waterline without changing any section height.
export const boatSurfaceY = (w: number, h: number) => Math.max(h * 0.165, 18 * boatCell(w) + 16);

const BOAT_LH = 38;`);
boat=boat.replace('const want = w < 640 ? 4.6 : w < 1024 ? 5.6 : 6.4;', 'const want = boatCell(w);');
boat=boat.replace('const shipX = w * (w < 640 ? 0.66 : 0.755) + (reducedMotion ? 0 : Math.sin(time * 0.042) * (w * 0.018));', `const driftX = w * (w < 640 ? 0.66 : 0.755) + (reducedMotion ? 0 : Math.sin(time * 0.042) * (w * 0.018));
    const sideRoom = (BOAT_LH * 0.5 + 2) * CB;
    const shipX = Math.max(sideRoom, Math.min(w - sideRoom, driftX));`);
fs.writeFileSync('asciiOceanLife.ts',boat);
let html=fs.readFileSync('index.html','utf8').replace('bg-[#F5F3EE]', 'bg-white');
fs.writeFileSync('index.html',html);
