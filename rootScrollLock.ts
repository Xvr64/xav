/**
 * The opening's hold on the page's scrolling, given back exactly once.
 *
 * The opening (CreationIntro) pins the page with `overflow: hidden` on <html> and lets go twice
 * over: first when the visitor is released as the Hero wakes, and again when its effect cleans up
 * at the end of the arrival, a few seconds later. In those seconds the page already scrolls, and
 * two hard flings on a phone reach the Globe, whose controller (cinematicScroll.ts) then owns
 * native scrolling through its own `overflow-y: hidden` on the same element. Restoring the saved
 * `overflow` a second time is a shorthand write: it clears that `overflow-y`, so the Globe would
 * be left holding the page with one of its locks gone.
 *
 * A hold therefore remembers that it has been released. The first release restores what the page
 * had; any later one changes nothing, whoever has taken the element since.
 */
export interface RootScrollHold {
  /** Give the page back. Safe to call any number of times; only the first call writes. */
  release(): void;
  readonly held: boolean;
}

type RootStyle = { overflow: string; scrollbarGutter: string };

export function holdRootScroll(style: RootStyle): RootScrollHold {
  const overflow = style.overflow;
  const gutter = style.scrollbarGutter;
  let held = true;
  // The gutter is kept so the layout does not shift by a scrollbar's width while the page is held
  style.scrollbarGutter = 'stable';
  style.overflow = 'hidden';
  return {
    release() {
      if (!held) return;
      held = false;
      style.overflow = overflow;
      style.scrollbarGutter = gutter;
    },
    get held() { return held; }
  };
}
