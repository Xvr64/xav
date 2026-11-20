import {
  prepareMemoryPlate,
  memoryLanding,
  syncProfilePhotoSizes,
  type MemoryPlate
} from './profileMemoryPlate';
import { sampleMemory, memoryWater } from './profileMemoryTimeline';

export function mountProfileMemories(itinerary: HTMLElement) {
  const frames = Array.from(itinerary.querySelectorAll<HTMLElement>('[data-city-slot]'));
  const apertures = frames.map(frame => frame.querySelector<HTMLElement>('.profile-city-aperture')!);
  const plates: (MemoryPlate | null)[] = frames.map(() => null);
  let alive = true;
  let active = false;
  let complete = false;
  let playing = false;
  let prepared = false;
  let bounds: DOMRect[] = [];
  let measuredW = 0;
  let measuredH = 0;

  // Bake the exact normalized landing table shared by all plates for incoming whale glyphs.
  const sites = new Uint8Array(1024 * 4);
  for (let i = 0; i < 1024; i++) {
    const site = memoryLanding((i + 0.5) / 1024);
    sites[i * 4] = Math.round(site.x * 255);
    sites[i * 4 + 1] = Math.round(site.y * 255);
    sites[i * 4 + 3] = 255;
  }
  memoryWater.landings = sites;

  function refreshBounds() {
    syncProfilePhotoSizes(itinerary);
    bounds = apertures.map(el => el.getBoundingClientRect());
    measuredW = innerWidth;
    measuredH = innerHeight;
  }

  function mark(index: number, show: boolean) {
    const phase = show ? 'photo' : 'empty';
    if (frames[index].dataset.memoryPhase === phase) return;
    if (plates[index]) plates[index]!.draw(Number(show), Number(show));
    frames[index].dataset.memoryPhase = phase;
  }

  function finish(show: boolean) {
    complete = show;
    playing = false;
    frames.forEach((_, i) => mark(i, show));
    itinerary.dataset.plates = show ? 'revealed' : 'waiting';
    delete itinerary.dataset.memoryWave;
    delete itinerary.dataset.memoryStage;
    delete itinerary.dataset.memoryCity;
    memoryWater.running = false;
    memoryWater.transferring = false;
    memoryWater.reversing = false;
    memoryWater.consumed = active && show ? 8 : 0;
    memoryWater.refresh?.();
  }

  finish(false);
  Promise.all(frames.map(async (frame, i) => {
    try {
      const plate = await prepareMemoryPlate(frame);
      if (alive) {
        plates[i] = plate;
        plate?.draw(Number(complete), Number(complete));
      }
    } catch { /* The semantic img element remains the stable accessible fallback. */ }
  })).then(() => {
    if (!alive) return;
    syncProfilePhotoSizes(itinerary);
    prepared = plates.length === 8 && plates.every(Boolean);
  });

  return {
    setActive(value: boolean) {
      if (active === value) return;
      active = value;
      memoryWater.framed = value;
      if (!playing) {
        memoryWater.consumed = active && complete ? 8 : 0;
        memoryWater.refresh?.();
      }
    },
    finish,
    begin(reverse: boolean) {
      active = true;
      memoryWater.framed = true;
      // Unsupported or still-decoding renderers resolve the accessible endpoint cleanly.
      if (!prepared || !memoryWater.refresh || !document.querySelector('[data-whale-renderer="shared-3d"]')) {
        return false;
      }
      refreshBounds();
      memoryWater.landings = sites;
      memoryWater.running = playing = true;
      memoryWater.reversing = reverse;
      memoryWater.transferring = !reverse;
      memoryWater.refresh();
      itinerary.dataset.plates = reverse ? 'restoring' : 'revealing';
      return true;
    },
    draw(time: number) {
      if (!playing) return;
      if (innerWidth !== measuredW || innerHeight !== measuredH) refreshBounds();
      const { wave, city, phase, consumed, transferring, slots } = sampleMemory(time);

      for (let i = 0; i < frames.length; i++) {
        const s = slots[i];
        const plate = plates[i];
        if (plate) {
          plate.draw(s.assembled, s.color);
        } else {
          const p =
            s.color >= 0.999
              ? 'photo'
              : s.color > 0.001
                ? 'resolving'
                : s.assembled >= 0.999
                  ? 'ascii'
                  : s.assembled > 0.001
                    ? 'forming'
                    : 'empty';
          if (frames[i].dataset.memoryPhase !== p) frames[i].dataset.memoryPhase = p;
        }
      }

      itinerary.dataset.memoryWave = wave;
      if (wave === 'hold') {
        itinerary.dataset.memoryStage = 'ascii-hold';
        delete itinerary.dataset.memoryCity;
      } else if (wave === 'wave1') {
        itinerary.dataset.memoryCity = frames[city].dataset.citySlot;
        itinerary.dataset.memoryStage = slots[city].assembled >= 0.999 ? 'ascii' : 'transfer';
      } else {
        itinerary.dataset.memoryCity = frames[city].dataset.citySlot;
        itinerary.dataset.memoryStage = 'color';
      }

      if (wave === 'wave1') {
        memoryWater.target = bounds[city];
        memoryWater.city = city;
        memoryWater.phase = phase;
      } else {
        memoryWater.city = 7;
        memoryWater.phase = 1;
      }
      memoryWater.consumed = consumed;

      if (memoryWater.transferring !== transferring) {
        memoryWater.transferring = transferring;
        memoryWater.refresh?.();
      }
    },
    destroy() {
      alive = false;
      active = false;
      memoryWater.framed = false;
      finish(false);
      frames.forEach(frame => delete frame.dataset.memoryPhase);
      delete itinerary.dataset.plates;
      memoryWater.landings = null;
    }
  };
}
