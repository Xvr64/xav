import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('journey runway regression: data-journey-runway and .journey-runway maintain overflow: visible', () => {
  const css = fs.readFileSync(path.resolve('terminal.css'), 'utf-8');
  const portfolioTsx = fs.readFileSync(path.resolve('xavier_h_ry_editorial_portfolio.tsx'), 'utf-8');

  // Verify CSS explicitly sets overflow: visible for the runway so position: sticky is not broken
  const runwayRuleMatch = css.match(/\.journey-runway[\s\S]*?\{([\s\S]*?)\}/);
  assert.ok(runwayRuleMatch, 'terminal.css should have a rule for .journey-runway');
  assert.match(
    css,
    /\.journey-runway[\s\S]*?overflow:\s*visible/,
    'terminal.css must enforce overflow: visible on .journey-runway to keep sticky stage pinned'
  );

  // Verify xavier_h_ry_editorial_portfolio.tsx data-journey-runway does NOT have overflow-hidden class
  const runwayJsxMatch = portfolioTsx.match(/data-journey-runway[\s\S]*?className=["']([^"']*)["']/);
  assert.ok(runwayJsxMatch, 'xavier_h_ry_editorial_portfolio.tsx must contain data-journey-runway');
  const runwayClasses = runwayJsxMatch[1].split(/\s+/);
  assert.ok(
    !runwayClasses.includes('overflow-hidden'),
    'data-journey-runway must NOT have overflow-hidden (it breaks position: sticky)'
  );
  assert.ok(
    !runwayClasses.includes('overflow-x-hidden'),
    'data-journey-runway must NOT have overflow-x-hidden'
  );
  assert.ok(
    !runwayClasses.includes('overflow-y-hidden'),
    'data-journey-runway must NOT have overflow-y-hidden'
  );

  // Verify sticky stage exists inside data-journey-runway
  assert.match(
    portfolioTsx,
    /<div className="sticky top-0 h-\[100svh\] w-full max-w-full overflow-hidden">[\s\S]*?<WhaleConvergence[\s\S]*?<JourneyGlobe/,
    'Sticky container with WhaleConvergence and JourneyGlobe must be present in journey runway'
  );
});

