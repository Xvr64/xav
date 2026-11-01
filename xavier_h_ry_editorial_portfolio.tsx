
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Eye, Download, X, Check } from 'lucide-react';
import { AsciiText, DecodeSoundToggle, useEditorialScroll } from './TerminalEditorial';
import { mountLanternCursor } from './lanternCursor';
import { CV_DATA } from './cvData';
import { ReadingZoneTracker } from './ReadingZoneTracker';
import { JourneyGlobe } from './JourneyGlobe';
import { AsciiWhaleBackground } from './AsciiWhaleBackground';
import { WhaleConvergence } from './WhaleConvergence';
import {
  GlobeDive,
  HeroCurrentLayer,
  LANES_EXPERIENCE,
  LANES_EXPERIENCE_NARROW,
  LANES_INTRO,
  LANES_INTRO_NARROW,
  OceanIntroduction,
  ProgressiveOceanEntry,
  WhaleStretch,
  toTitleCase
} from './OceanEntry';
import { GLOBAL_PORTFOLIO_CSS } from './portfolioStyles';

// ============================================================================
// PAGE COMPOSITION — the layers and sections live in their own modules:
//   cvData.ts (content) · abyssPalette.ts (the descent's colours) · oceanDirection.ts (shared
//   whale lanes and reading zones) · ReadingZoneTracker.tsx · AsciiWhaleBackground.tsx ·
//   JourneyGlobe.tsx · OceanEntry.tsx (cover and introduction) · portfolioStyles.ts
// ============================================================================

interface RevealBlockProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  variant?: 'section' | 'item';
}

// Layout-only wrapper; one shared controller owns all editorial scroll updates.
const RevealBlock: React.FC<RevealBlockProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);
const BioWords = AsciiText;

interface FloatingSectionHeaderProps {
  sectionId?: string;
  title: string;
  description?: string;
  /** How the header sits on the 12-column grid; each section picks its own. "sounding" is The
      Sounding's header: a Newsreader title set in from the margin columns. */
  layout?: 'left' | 'drift' | 'counter' | 'stacked' | 'sounding';
  /** A single Newsreader statement set beneath the header. */
  asideAccent?: string;
}

const FloatingSectionHeader: React.FC<FloatingSectionHeaderProps> = ({
  title,
  description,
  layout = 'left',
  asideAccent
}) => (
  <header className={`section-head section-head--${layout} ed-grid relative z-10`}>
    <h2 className="ocean-h2 text-[#171717]">
      <BioWords text={title} />
    </h2>
    {description && (
      <p className="section-dek">
        <BioWords text={description} />
      </p>
    )}
    {asideAccent && (
      <p className="section-aside">
        <AsciiText text={asideAccent} />
      </p>
    )}
  </header>
);

export default function App() {
  useEditorialScroll();
  useEffect(() => mountLanternCursor(), []);

  const [cvModalOpen, setCvModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Xavier Hery | International Business, Technology, Strategy';
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleExploreDossier = useCallback(() => {
    scrollToSection('experience');
  }, [scrollToSection]);

  const ORIGINAL_CV_PDF_URL = '/Engl_CV_Xavier_Hery.pdf';
  const ORIGINAL_CV_FILENAME = 'Engl CV Xavier Hery.pdf';

  const handleDownloadOriginalCv = useCallback(() => {
    const link = document.createElement('a');
    link.href = ORIGINAL_CV_PDF_URL;
    link.download = ORIGINAL_CV_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3500);
  }, []);

  // CV preview dialog: focus moves to its close control on open, stays inside while it is open
  // (Tab wraps, Escape closes) and returns to the control that opened it.
  const cvDialogRef = useRef<HTMLDivElement | null>(null);
  const cvCloseRef = useRef<HTMLButtonElement | null>(null);
  const cvReturnFocusRef = useRef<HTMLElement | null>(null);
  const closeCvModal = useCallback(() => setCvModalOpen(false), []);

  useEffect(() => {
    if (!cvModalOpen) return;
    cvReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cvCloseRef.current?.focus();
    return () => {
      cvReturnFocusRef.current?.focus();
    };
  }, [cvModalOpen]);

  const handleCvDialogKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setCvModalOpen(false);
      return;
    }
    if (e.key !== 'Tab' || !cvDialogRef.current) return;
    const focusable = Array.from(
      cvDialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), iframe')
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const handleCopyEmail = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CV_DATA.email).catch(() => undefined);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  }, []);

  return (
    <div className="terminal-portfolio min-h-screen w-full max-w-full bg-[var(--ocean-background)] text-[#171717] antialiased selection:bg-neutral-700 selection:text-[#EDEDED]">
      <style>{GLOBAL_PORTFOLIO_CSS}</style>

      <ReadingZoneTracker />
      <HeroCurrentLayer />
      <WhaleStretch sectionId="introduction" lanes={LANES_INTRO} narrowLanes={LANES_INTRO_NARROW} />
      <WhaleStretch sectionId="experience" lanes={LANES_EXPERIENCE} narrowLanes={LANES_EXPERIENCE_NARROW} />
      <GlobeDive />
      <AsciiWhaleBackground mode="ambient" />
      <DecodeSoundToggle />

      {downloadToast && (
        <div aria-hidden="true" className="fixed top-20 right-6 z-50 bg-[#171717]/90 backdrop-blur-md text-[#F5F3EE] border border-[#B6C5B0] px-4 py-3 shadow-lg flex items-center gap-3 font-mono text-xs">
          <Check className="w-4 h-4 text-[#B6C5B0]" />
          <span>Downloading {ORIGINAL_CV_FILENAME}</span>
        </div>
      )}
      {/* One polite live region announces what the copy and download controls just did */}
      <p className="sr-only" role="status" aria-live="polite">
        {copiedEmail ? 'Email address copied to clipboard.' : downloadToast ? `Downloading ${ORIGINAL_CV_FILENAME}.` : ''}
      </p>

      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 ocean-legible overflow-x-hidden">
        {/* SECTION 01: PROGRESSIVE OCEAN ENTRY (Hero Preserved) */}
        <ProgressiveOceanEntry
          onExploreDossier={handleExploreDossier}
          onDownloadPdf={handleDownloadOriginalCv}
        />

        {/* THE DESCENT: straight from the cover into the Globe's pinned runway. Its first stretch
            (the lead) is the convergence: the two whales circle each other and become the Earth;
            the city journey takes the rest, and the water darkens with it, reaching the deep
            ocean as the last city's dwell ends. The scroll position IS the timeline. */}
        <section id="journey" aria-label="Seven cities" className="relative">
          <div
            data-journey-runway
            data-ascii-preserve
            className="journey-runway relative w-full max-w-full overflow-hidden"
          >
            <div className="sticky top-0 h-[100svh] w-full max-w-full overflow-hidden">
              <WhaleConvergence firstCity={CV_DATA.locations[0]} />
              <JourneyGlobe locations={CV_DATA.locations} />
            </div>
            {/* The convergence's length; after the stage, which JourneyGlobe finds as the first child */}
            <div data-journey-lead aria-hidden="true" className="journey-lead absolute top-0 left-0 w-px pointer-events-none" />
          </div>
        </section>

        {/* SECTION 02: INTRODUCTION — in the deep water, once the journey has ended */}
        <OceanIntroduction />

        <div className="cv-arch mt-16 sm:mt-24 lg:mt-32 space-y-28 sm:space-y-36">
          {/* INTERNATIONAL BACKGROUND: the journey's chapter title, set after the statement */}
          <section id="global" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="global"
                layout="drift"
                title="Seven cities across Europe, the Middle East & Asia"
                description="An international chronology shaped by living across Doha, Paris, Jakarta, Moscow, Singapore, Pau, and Shanghai."
              />
            </RevealBlock>
          </section>

          {/* SECTION 03: EXPERIENCE (De-boxed, Floating Editorial Timeline) */}
          {/* A sounding log: each internship is a station sitting on its own datum line, like the
              cover's headline on the horizon, with its record hanging below in the water. */}
          <section id="experience" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="experience"
                layout="sounding"
                title="Operational & commercial internships"
                asideAccent="Translating cross-cultural adaptability into rigorous business execution and freight logistics."
              />
            </RevealBlock>

            <div className="entry-list entry-list--wide station-list">
              {CV_DATA.experiences.map((exp, idx) => (
                <RevealBlock key={exp.id} delayMs={idx * 100}>
                  <article className="exp-entry station ed-grid relative">
                    <h3 className="exp-company">
                      <BioWords text={toTitleCase(exp.company)} />
                    </h3>
                    <p className="exp-when meta">
                      <span className="exp-index" aria-hidden="true"><AsciiText text={`stn ${exp.index}`} /></span>
                      <BioWords text={exp.date} />
                    </p>
                    <div className="exp-who">
                      <p className="exp-role">
                        <BioWords text={exp.role} />
                      </p>
                      <ul className="exp-tags meta">
                        {exp.domainTag.split(/\s*\/\s*/).map((tag) => (
                          <li key={tag}>
                            <BioWords text={tag} />
                          </li>
                        ))}
                      </ul>
                    </div>
                    {exp.concisePoints && exp.concisePoints.length > 0 && (
                      <ul className="exp-what">
                        {exp.concisePoints.map((pt, i) => (
                          <li key={i} className="body-copy">
                            <BioWords text={pt} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 04: SKILLS & TECHNOLOGY (Open Typographic Landscape) */}
          <section id="skills" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="skills"
                layout="counter"
                title="Technical & creative toolset"
                description="Organized across automated workflows, media production, and enterprise productivity suites."
              />
            </RevealBlock>

            <div className="entry-list entry-list--wide">
              {CV_DATA.skills.map((category, idx) => (
                <RevealBlock key={category.id} delayMs={idx * 110}>
                  <div className="skill-band ed-grid">
                    <div className="skill-head">
                      <h3 className="ocean-h3 text-[#171717]">
                        <BioWords text={category.title} />
                      </h3>
                      <p>
                        <BioWords text={category.verbatimSummary} />
                      </p>
                    </div>
                    <div className="skill-list">
                      {category.items.map((skill) => (
                        <div key={skill.name} className="ocean-skill-item">
                          <span className="text-[#171717]">
                            <BioWords text={skill.name} />
                          </span>
                          {skill.classification ? (
                            <span className="meta">
                              <BioWords text={skill.classification} />
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 05: EDUCATION (Chronological Narrative Flow) */}
          <section id="education" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="education"
                layout="stacked"
                title="Academic chronology"
              />
            </RevealBlock>

            <div className="entry-list">
              {CV_DATA.education.map((edu, idx) => (
                <RevealBlock key={edu.id} delayMs={idx * 80}>
                  <article className="edu-entry ed-grid relative">
                    <p className="edu-when meta">
                      <BioWords text={edu.date} />
                    </p>
                    <div className="edu-body">
                      <h3 className="ocean-h3 text-[#171717]">
                        <BioWords text={edu.institution} />
                      </h3>
                      {edu.degree && (
                        <p className="edu-degree body-copy">
                          <BioWords text={edu.degree} />
                        </p>
                      )}
                      {edu.highlights && edu.highlights.length > 0 && (
                        <div className="edu-highlights">
                          {edu.highlights.map((h, hIdx) => (
                            <p key={hIdx} className="body-copy text-[#2B353B]">
                              <BioWords text={h} />
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="edu-where meta">
                      <BioWords text={edu.locationLabel} />
                    </p>
                  </article>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 06: LANGUAGES (Open Typographic Matrix) */}
          <section id="languages" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="languages"
                layout="left"
                title="Across languages"
                description="Multilingual fluency forged through living and studying in six distinct linguistic regions."
              />
            </RevealBlock>

            <div className="lang-list">
              {CV_DATA.languages.map((lang, idx) => (
                <RevealBlock key={lang.id} delayMs={idx * 60} className="lang-row ed-grid">
                  <h3 className="lang-name display">
                    <BioWords text={lang.language} />
                  </h3>
                  <p className="lang-level meta">
                    {lang.levelCode && (
                      <>
                        <BioWords text={lang.levelCode} />
                        <span aria-hidden="true"> <AsciiText text="·" /> </span>
                      </>
                    )}
                    <BioWords text={lang.levelWord} />
                  </p>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 07: PERSONAL INTERESTS (Open Vignettes) */}
          <section id="interests" data-editorial-section className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="interests"
                layout="drift"
                title="Disciplines & cultural monitoring"
                description="Athletic conditioning, music production, macroeconomic research, and luxury retail observation."
              />
            </RevealBlock>

            <div className="interest-flow ed-grid">
              {CV_DATA.interests.map((interest, idx) => (
                <RevealBlock key={interest.id} delayMs={idx * 80} className="interest">
                  <h3 className="ocean-h3 text-[#171717]">
                    <BioWords text={toTitleCase(interest.title)} />
                  </h3>
                  <ul>
                    {interest.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="body-copy text-[#2B353B]">
                        <BioWords text={b} />
                      </li>
                    ))}
                  </ul>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 08: CONTACT & DOSSIER (Direct Correspondence Suite) */}
          {/* Kept within one screen on desktop so the final, resting view holds the whole section */}
          <section id="contact" data-editorial-section className="relative pb-16 sm:pb-20">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="contact"
                layout="stacked"
                title="Direct correspondence"
                description="Open for B2B development, international logistics coordination, and strategic business inquiries."
              />
            </RevealBlock>

            <div className="contact-grid ed-grid">
              {/* The address is the last large statement of the descent */}
              <div className="contact-mail">
                <span className="meta">
                  <AsciiText text="electronic mail" />
                </span>
                <a href={CV_DATA.emailHref} className="contact-address text-[#171717]">
                  <AsciiText text={CV_DATA.email} />
                </a>
                <div className="contact-actions">
                  <button type="button" onClick={handleCopyEmail} className="text-control text-control--bare">
                    <AsciiText text={copiedEmail ? 'copied to clipboard' : 'copy address'} />
                  </button>
                </div>
              </div>

              <div className="contact-cv">
                <span className="meta">
                  <AsciiText text="curriculum vitae" />
                </span>
                <h3 className="ocean-h3 text-[#171717]">
                  <BioWords text="Original English CV PDF" />
                </h3>
                <p className="meta">
                  <BioWords text="Engl CV Xavier Hery.pdf · official document" />
                </p>
                <div className="contact-actions">
                  <button type="button" onClick={() => setCvModalOpen(true)} className="text-control" aria-haspopup="dialog">
                    <Eye className="w-4 h-4" aria-hidden="true" />
                    <AsciiText text="preview document" />
                  </button>
                  <button type="button" onClick={handleDownloadOriginalCv} className="text-control">
                    <Download className="w-4 h-4" aria-hidden="true" />
                    <AsciiText text="download pdf" />
                  </button>
                </div>
              </div>
            </div>

            <footer className="terminal-social">
              <a href={CV_DATA.linkedin} target="_blank" rel="noopener noreferrer"><AsciiText text="linkedin" /></a>
              <span aria-hidden="true"><AsciiText text="/" /></span>
              <a href={CV_DATA.emailHref}><AsciiText text="email" /></a>
            </footer>
          </section>
        </div>
      </main>

      {/* CV Modal Preview — Embeds the exact original Engl CV Xavier Hery.pdf */}
      {cvModalOpen && (
        <div
          onClick={closeCvModal}
          className="fixed inset-0 z-50 bg-[#171717]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div
            ref={cvDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-preview-title"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleCvDialogKeyDown}
            className="bg-[#F5F3EE] border border-[#171717] w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl"
          >
            <div className="px-4 sm:px-6 py-3.5 bg-[#171717] text-[#F5F3EE] flex justify-between items-center gap-3">
              <span id="cv-preview-title" className="font-mono text-xs truncate">{ORIGINAL_CV_FILENAME}</span>
              <div className="flex items-center gap-2.5">
                <a
                  href={ORIGINAL_CV_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#F5F3EE]/10 hover:bg-[#F5F3EE]/20 transition-colors text-[#F5F3EE] font-mono text-[13px]"
                >
                  Open Tab
                </a>
                <button
                  type="button"
                  onClick={handleDownloadOriginalCv}
                  className="px-3 py-1.5 bg-[#B6C5B0] hover:bg-[#9BB4B5] transition-colors text-[#171717] font-mono text-[13px] font-semibold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Download</span>
                </button>
                <button
                  ref={cvCloseRef}
                  type="button"
                  onClick={closeCvModal}
                  aria-label="Close CV preview"
                  className="p-1 text-[#F5F3EE] hover:text-[#9BB4B5] transition-colors"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#EFECE6] overflow-hidden">
              <iframe
                src={ORIGINAL_CV_PDF_URL}
                title={ORIGINAL_CV_FILENAME}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

