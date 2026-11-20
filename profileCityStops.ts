/** The name list and revealed photographs share one anchor. Further stops
 * keep the professional summary reachable when it extends below the fold. */
export function profileCityStops(top: number, end: number, viewport: number) {
  const stops = [top, top];
  const pages = Math.ceil((end - top) / Math.max(1, viewport * 0.76));
  for (let page = 1; page <= pages; page++) {
    stops.push(Math.round(top + (end - top) * page / pages));
  }
  return stops;
}
