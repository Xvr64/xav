import React from 'react';
import { chapterShare, sectionMark } from './sections';

// ============================================================================
// THE CHAPTER LINE — the threshold every chapter of the CV is entered through
// ============================================================================
// "03 / 07" on the margin, then a rule across the measure set in the itinerary's own type:
// waves for the chapters reached, dots for those still ahead, as long as their share of the CV.
// One device between all seven chapters instead of a different flourish for each, saying
// something true (where the reader is), drawn by the scroll like every datum on the page
// (terminal.css). Plain text outside the word system and hidden from assistive technology:
// the headings already carry the structure.

const WAVE = '~'.repeat(260);
const REST = '· '.repeat(130);

export const ChapterLine: React.FC<{ sectionId: string }> = React.memo(({ sectionId }) => {
  const share = chapterShare(sectionId);
  if (!share) return null;
  return (
    <div className="chapter-line" aria-hidden="true" data-ascii-preserve>
      {/* The mark is copy (a paragraph: the whales thin behind it); the rule is water, and a
          whale passes behind it whole */}
      <p className="section-mark">{sectionMark(sectionId)}</p>
      <span className="chapter-rule">
        <span className="chapter-rule-reached" style={{ flexGrow: share.reached }}>{WAVE}</span>
        {share.ahead > 0 && <span className="chapter-rule-ahead" style={{ flexGrow: share.ahead }}>{REST}</span>}
      </span>
    </div>
  );
});
