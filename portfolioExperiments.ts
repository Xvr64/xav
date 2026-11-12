/** Local review only: no persisted preferences and no effect on the production default. */
export function parsePortfolioExperiments(search: string, development: boolean) {
  const params = new URLSearchParams(search);
  return {
    asciiGlobe: development && params.get('asciiGlobe') === '1',
    cityConstellation: development && params.get('cityConstellation') === '1'
  };
}

export const portfolioExperiments = (import.meta as { env?: { DEV?: boolean } }).env?.DEV
  ? parsePortfolioExperiments(typeof window === 'undefined' ? '' : window.location.search, true)
  : { asciiGlobe: false, cityConstellation: false };
