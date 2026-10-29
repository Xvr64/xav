
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Eye, Download, X, Menu, Check, ArrowDown } from 'lucide-react';
import { loadLandDots, type LandDots } from './glyphcssGlobe';
import { createAsciiJellyfishField, createAsciiFishingBoat, boatSurfaceY } from './asciiOceanLife';

// ============================================================================
// STRICT FACTUAL DATA SOURCE — EXTRACTED VERBATIM FROM "Engl CV Xavier Hery.pdf"
// ============================================================================

interface ExperienceItem {
  id: string;
  index: string;
  company: string;
  role: string;
  date: string;
  concisePoints: string[];
  verbatimPoints: string[];
  domainTag: string;
}

interface LocationItem {
  id: string;
  index: string;
  city: string;
  country?: string;
  period: string;
  region: string;
  coordinates: string;
  lat: number;
  lon: number;
  cvContext: string;
  documentedInstitution?: string;
  image?: string;
  imageCaption?: string;
}

interface SkillCategory {
  id: string;
  index: string;
  title: string;
  verbatimSummary: string;
  items: {
    name: string;
    classification: string;
  }[];
}

interface EducationItem {
  id: string;
  index: string;
  institution: string;
  verbatimInstitution: string;
  degree?: string;
  date: string;
  highlights?: string[];
  locationLabel: string;
}

interface LanguageItem {
  id: string;
  index: string;
  language: string;
  level: string;
  cefrOrStandard: string;
  classification: string;
  /** Short level code shown in the Languages section (omitted for native) */
  levelCode?: string;
  /** Plain-language level shown in the Languages section */
  levelWord: string;
}

interface InterestCategory {
  id: string;
  index: string;
  title: string;
  bullets: string[];
  verbatimNote: string;
  namedEntities?: string[];
}

const CV_DATA = {
  name: 'XAVIER HERY',
  rawPdfName: 'XAVIER HERY',
  positioning: 'INTERNATIONAL BUSINESS / TECHNOLOGY / STRATEGY',
  phone: '+33 7 67 20 58 22',
  phoneHref: 'tel:+33767205822',
  email: 'Heryxx44@gmail.com',
  emailHref: 'mailto:Heryxx44@gmail.com',
  linkedin: 'https://www.linkedin.com/in/xavierhry/',
  linkedinDisplay: 'linkedin.com/in/xavierhry',
  heroIntroConcise:
    'Like the whale migrating across oceans without borders, my journey has been shaped by constant movement, living across Doha, Paris, Jakarta, Moscow, Singapore, Pau, and Shanghai.',
  heroIntroSecondary:
    'Navigating shifting currents from one culture to the next forged natural adaptability and cross-cultural communication. Today, as a third-year International Business student at ESSCA, I bring that perspective to B2B development, international sea and air logistics, and project coordination.',
  verbatimProfile:
    'Third-year Bachelor student at ESSCA with an international background shaped by living across Doha, Paris, Jakarta, Moscow, Singapore, Pau, and Shanghai. Proven adaptability, strong cross-cultural communication, and practical experience in project coordination.',
  experiences: [
    {
      id: 'freshpepper',
      index: '01',
      company: 'FRESHPEPPER',
      role: 'Business Development & Operations Intern',
      date: 'April 2025',
      domainTag: 'B2B Negotiations / Commercial Quotations / Cross-Team Workflow',
      concisePoints: [
        'Client meetings and B2B negotiation follow-ups.',
        'Deal pipeline tracking and client requests.',
        'RFP documentation review, cost estimates, and commercial quotations.',
        'Coordination between sales and 3D design teams.'
      ],
      verbatimPoints: [
        'Attended client meetings and handled B2B negotiation follow-ups, tracking deal pipelines and client requests.',
        'Reviewed RFP documentation to draft accurate cost estimates and formal commercial quotations.',
        'Coordinated daily workflow between sales and 3D design teams to keep client deliverables on schedule.'
      ]
    },
    {
      id: 'bollore-logistics',
      index: '02',
      company: 'BOLLORÉ LOGISTICS',
      role: 'Logistics Operations Intern',
      date: 'July 2022',
      domainTag: 'International Air & Sea Freight / Carrier Coordination / Customs Documentation',
      concisePoints: [
        'International air and sea freight tracking.',
        'Communication between shipping agents, carriers, and warehouse staff.',
        'Documentation reviews, transport orders, and basic customs paperwork.'
      ],
      verbatimPoints: [
        'Supported operational teams on international air and sea freight files, tracking shipments from departure to destination.',
        'Monitored communication flows between shipping agents, carriers, and warehouse staff.',
        'Assisted with daily documentation reviews, verifying transport orders and basic customs paperwork.'
      ]
    }
  ] as ExperienceItem[],
  locations: [
    {
      id: 'doha',
      index: '01',
      city: 'Doha',
      country: 'Qatar',
      period: '2006–2009',
      region: 'Qatar · Middle East',
      coordinates: '25.2854° N, 51.5310° E',
      lat: 25.2854,
      lon: 51.531,
      cvContext:
        'Lived in Doha, Qatar from 2006 to 2009, establishing the early foundation of Xavier Hery’s international background and cross-cultural adaptability.',
      documentedInstitution: 'Qatar (2006–2009)'
    },
    {
      id: 'paris',
      index: '02',
      city: 'Paris',
      country: 'France',
      period: '2009–2012',
      region: 'France · Europe',
      coordinates: '48.8566° N, 2.3522° E',
      lat: 48.8566,
      lon: 2.3522,
      cvContext:
        'Lived in Paris from 2009 to 2012, one of the central European chapters shaping Xavier Hery’s adaptability and international perspective.',
      documentedInstitution: 'Paris (2009–2012)'
    },
    {
      id: 'jakarta',
      index: '03',
      city: 'Jakarta',
      country: 'Indonesia',
      period: '2012–2016',
      region: 'Southeast Asia',
      coordinates: '6.2088° S, 106.8456° E',
      lat: -6.2088,
      lon: 106.8456,
      cvContext:
        'Documented in the CV profile summary and the Education section under Lycée Français de Jakarta (2012–2016).',
      documentedInstitution: 'Lycée Français de Jakarta (2012–2016)'
    },
    {
      id: 'moscow',
      index: '04',
      city: 'Moscow',
      country: 'Russia',
      period: '2016–2018',
      region: 'Eurasia',
      coordinates: '55.7558° N, 37.6173° E',
      lat: 55.7558,
      lon: 37.6173,
      cvContext:
        'Documented in the CV profile summary and the Education section under Lycée Français Alexandre Dumas de Moscou (2016–2018).',
      documentedInstitution: 'Lycée Français Alexandre Dumas de Moscou (2016–2018)'
    },
    {
      id: 'singapore',
      index: '05',
      city: 'Singapore',
      country: 'Singapore',
      period: '2018–2023',
      region: 'Southeast Asia',
      coordinates: '1.3521° N, 103.8198° E',
      lat: 1.3521,
      lon: 103.8198,
      cvContext:
        'Documented in the CV profile summary and the Education section under International French School Singapore (2018–2023).',
      documentedInstitution: 'International French School Singapore (2018–2023)'
    },
    {
      id: 'pau',
      index: '06',
      city: 'Pau',
      country: 'France',
      period: '2023–2024',
      region: 'France · Europe',
      coordinates: '43.2951° N, 0.3708° W',
      lat: 43.2951,
      lon: -0.3708,
      cvContext:
        'Documented in the CV profile summary and the Education section under Lycée Saint-Cricq, Pau (2023–2024).',
      documentedInstitution: 'Lycée Saint-Cricq, Pau (2023–2024)'
    },
    {
      id: 'shanghai',
      index: '07',
      city: 'Shanghai',
      country: 'China',
      period: '2026',
      region: 'China · East Asia',
      coordinates: '31.2304° N, 121.4737° E',
      lat: 31.2304,
      lon: 121.4737,
      cvContext:
        'International academic mobility and study semester in Shanghai (2026) within the ESSCA Bachelor curriculum.',
      documentedInstitution: 'Shanghai, China (2026)'
    }
  ] as LocationItem[],
  skills: [
    {
      id: 'ai-tech',
      index: '01',
      title: 'AI & Tech Tools',
      verbatimSummary:
        'Prompt engineering (incl. OpenClaw, Google AI Studio, Antigravity, OpenAI Codex).',
      items: [
        { name: 'Prompt engineering', classification: 'Methodology & Workflow' },
        { name: 'OpenClaw', classification: 'AI & Tech Tool' },
        { name: 'Google AI Studio', classification: 'AI & Tech Tool' },
        { name: 'Antigravity', classification: 'AI & Tech Tool' },
        { name: 'OpenAI Codex', classification: 'AI & Tech Tool' }
      ]
    },
    {
      id: 'content-media',
      index: '02',
      title: 'Content & Media',
      verbatimSummary: 'Video editing (DaVinci Resolve, CapCut), visual content design.',
      items: [
        { name: 'Video editing', classification: 'Media Production' },
        { name: 'DaVinci Resolve', classification: 'Post-Production Software' },
        { name: 'CapCut', classification: 'Video Editing Tool' },
        { name: 'Visual content design', classification: 'Creative Direction & Media' }
      ]
    },
    {
      id: 'office-suite',
      index: '03',
      title: 'Office Suite',
      verbatimSummary: 'MS Office (Advanced Excel, PowerPoint).',
      items: [
        { name: 'MS Office', classification: 'Business Productivity Suite' },
        { name: 'Advanced Excel', classification: 'Data & Spreadsheet Modeling' },
        { name: 'PowerPoint', classification: 'Executive Presentations' }
      ]
    }
  ] as SkillCategory[],
  education: [
    {
      id: 'essca',
      index: '01',
      institution: 'ESSCA',
      verbatimInstitution: 'Bachelor in International Business - ESSCA',
      degree: 'Bachelor in International Business',
      date: '2024–2027',
      locationLabel: 'Higher Education · Shanghai (2026)',
      highlights: [
        'Core focus on international business, management, and corporate strategy.',
        'International academic mobility scheduled in Shanghai (2026).',
        'Executed multicultural business projects and case studies.'
      ]
    },
    {
      id: 'saint-cricq',
      index: '02',
      institution: 'Lycée Saint-Cricq, Pau',
      verbatimInstitution: 'Lycée Saint-Cricq (Pau)',
      date: '2023–2024',
      locationLabel: 'Pau, France'
    },
    {
      id: 'ifs-singapore',
      index: '03',
      institution: 'International French School Singapore',
      verbatimInstitution: 'International French School Singapore',
      date: '2018–2023',
      locationLabel: 'Singapore'
    },
    {
      id: 'lycee-moscou',
      index: '04',
      institution: 'Lycée Français Alexandre Dumas de Moscou',
      verbatimInstitution: 'Lycée Français Alexandre Dumas de Moscou',
      date: '2016–2018',
      locationLabel: 'Moscow'
    },
    {
      id: 'lycee-jakarta',
      index: '05',
      institution: 'Lycée Français de Jakarta',
      verbatimInstitution: 'Lycée Français de Jakarta',
      date: '2012–2016',
      locationLabel: 'Jakarta'
    }
  ] as EducationItem[],
  languages: [
    {
      id: 'fr',
      index: '01',
      language: 'French',
      level: 'Native',
      cefrOrStandard: 'Native',
      classification: 'Mother Tongue',
      levelWord: 'Native'
    },
    {
      id: 'en',
      index: '02',
      language: 'English',
      level: 'C1 (Bilingual / Fluent)',
      cefrOrStandard: 'CEFR C1',
      classification: 'Bilingual / Fluent',
      levelCode: 'C1',
      levelWord: 'Fluent'
    },
    {
      id: 'es',
      index: '03',
      language: 'Spanish',
      level: 'B2 (Intermediate)',
      cefrOrStandard: 'CEFR B2',
      classification: 'Independent / Intermediate',
      levelCode: 'B2',
      levelWord: 'Intermediate'
    },
    {
      id: 'ar',
      index: '04',
      language: 'Arabic',
      level: 'A1',
      cefrOrStandard: 'CEFR A1',
      classification: 'Foundational',
      levelCode: 'A1',
      levelWord: 'Basic'
    },
    {
      id: 'ru',
      index: '05',
      language: 'Russian',
      level: 'A1',
      cefrOrStandard: 'CEFR A1',
      classification: 'Foundational',
      levelCode: 'A1',
      levelWord: 'Basic'
    },
    {
      id: 'zh',
      index: '06',
      language: 'Mandarin Chinese',
      level: 'A1 (HSK 1)',
      cefrOrStandard: 'A1 (HSK 1)',
      classification: 'Standardized Chinese Proficiency',
      levelCode: 'HSK 1',
      levelWord: 'Beginner'
    }
  ] as LanguageItem[],
  interests: [
    {
      id: 'sports-music',
      index: '01',
      title: 'SPORTS & MUSIC',
      bullets: [
        'Calisthenics and athletic training.',
        'Bodyweight workouts and personal discipline.',
        'Music production, beatmaking, sampling, music history, and sound design.'
      ],
      verbatimNote:
        'Calisthenics & athletic training (bodyweight workouts, personal discipline). Music Production: Beatmaking, sampling, music history, and sound design.'
    },
    {
      id: 'finance-markets',
      index: '02',
      title: 'FINANCE & MARKETS',
      bullets: ['Global financial markets and macroeconomics.'],
      verbatimNote: 'Global Financial Markets & Macroeconomics'
    },
    {
      id: 'fashion-retail',
      index: '03',
      title: 'FASHION & RETAIL',
      bullets: [
        'Luxury retail positioning.',
        'Flagship concepts and brand activations across Europe and Asia.',
        'The luxury brands named in the CV: Celine, Louis Vuitton, and Hermes.'
      ],
      verbatimNote:
        'Monitoring luxury retail positioning, flagship concepts, and brand activations across Europe and Asia (Celine, Louis Vuitton, Hermes).',
      namedEntities: ['Celine', 'Louis Vuitton', 'Hermes']
    }
  ] as InterestCategory[]
};

const NAV_ITEMS = [
  { id: 'home', num: '01', label: 'Index' },
  { id: 'experience', num: '02', label: 'Experience' },
  { id: 'global', num: '03', label: 'Global' },
  { id: 'skills', num: '04', label: 'Skills' },
  { id: 'education', num: '05', label: 'Education' },
  { id: 'languages', num: '06', label: 'Languages' },
  { id: 'interests', num: '07', label: 'Interests' },
  { id: 'contact', num: '08', label: 'Contact' }
];

// ============================================================================
// STANDARDS-COMPLIANT RAW PDF 1.4 BINARY GENERATOR
// ============================================================================

function escapePdfText(str: string): string {
  return str
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/’/g, "'")
    .replace(/•/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function generateOriginalCvPdfBlob(): Blob {
  const ops: string[] = [];
  ops.push('0.96 0.953 0.933 rg');
  ops.push('0 0 595.28 841.89 re f');
  ops.push('0.09 0.09 0.09 rg');
  ops.push('0.09 0.09 0.09 RG');

  const addText = (text: string, x: number, y: number, size: number, bold = false, muted = false) => {
    if (muted) {
      ops.push('0.467 0.463 0.435 rg');
    } else {
      ops.push('0.09 0.09 0.09 rg');
    }
    ops.push('BT');
    ops.push(`/${bold ? 'F2' : 'F1'} ${size} Tf`);
    ops.push(`1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm`);
    ops.push(`(${escapePdfText(text)}) Tj`);
    ops.push('ET');
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number, width = 0.6) => {
    ops.push(`${width} w`);
    ops.push('0.09 0.09 0.09 RG');
    ops.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
  };

  addText('XAVIER HERY', 42, 785, 22, true);
  addText('+33 7 67 20 58 22  |  Heryxx44@gmail.com  |  https://www.linkedin.com/in/xavierhry/', 42, 766, 9, false, true);
  addLine(42, 754, 553, 754, 0.75);

  addText('Third-year Bachelor student at ESSCA with an international background shaped by living in Doha, Paris,', 42, 736, 9.5);
  addText('Jakarta, Moscow, Singapore, Pau, and Shanghai. Proven adaptability, strong cross-cultural communication, and', 42, 723, 9.5);
  addText('practical experience in project coordination.', 42, 710, 9.5);
  addLine(42, 696, 553, 696, 0.5);

  // Left Column
  addText('SKILLS', 42, 676, 11, true);
  addLine(42, 671, 206, 671, 0.4);
  addText('- AI & Tech Tools: Prompt engineering', 42, 655, 9, true);
  addText('  (incl. OpenClaw, Google AI Studio,', 42, 643, 8.5);
  addText('  Antigravity, OpenAI Codex).', 42, 632, 8.5);

  addText('LANGUAGES', 42, 512, 11, true);
  addLine(42, 507, 206, 507, 0.4);
  addText('- French: Native', 42, 491, 8.8);
  addText('- English: C1 (Bilingual / Fluent)', 42, 477, 8.8);

  // Right Column
  addText('WORK EXPERIENCE', 238, 676, 11, true);
  addLine(238, 671, 553, 671, 0.4);
  addText('Business Development & Operations Intern - FRESHPEPPER', 238, 654, 9.8, true);
  addText('April 2025', 238, 641, 8.5, false, true);

  const contentStream = ops.join('\n');
  const encoder = new TextEncoder();
  const streamByteLength = encoder.encode(contentStream).length;

  const objects: string[] = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 6 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n`,
    `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n`,
    `6 0 obj\n<< /Length ${streamByteLength} >>\nstream\n${contentStream}\nendstream\nendobj\n`
  ];

  let pdfHeader = '%PDF-1.4\n';
  const offsets: number[] = [];
  let currentByteOffset = encoder.encode(pdfHeader).length;

  let body = '';
  for (const obj of objects) {
    offsets.push(currentByteOffset);
    body += obj;
    currentByteOffset += encoder.encode(obj).length;
  }

  const xrefOffset = currentByteOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([encoder.encode(pdfHeader + body + xref + trailer)], { type: 'application/pdf' });
}

// ============================================================================
// UI COMPONENTS (RevealBlock, ScrambleText, HeroAsciiCanvas, TiltCard, JourneyGlobe, AsciiWhaleBackground)
// ============================================================================

interface RevealBlockProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  variant?: 'section' | 'item';
}

const RevealBlock: React.FC<RevealBlockProps> = ({
  children,
  delayMs = 0,
  className = '',
  variant = 'item'
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true);
      return;
    }

    const isSection = variant === 'section';
    // For section introductions:
    // rootMargin bottom of -28% ensures the section content remains 100% visually hidden
    // while in the lower 28% of the viewport. It triggers strictly when the section enters
    // the central / lower-middle zone (rect.top <= 72% vh).
    //
    // For individual items inside an already active section:
    // rootMargin bottom of -15% allows items to reveal fluidly as the visitor scrolls through the section content.
    const rootMargin = isSection ? '0px 0px -28% 0px' : '0px 0px -15% 0px';
    const threshold = isSection ? 0.08 : 0.04;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          } else if (entry.boundingClientRect.top > 0) {
            // Element has moved below the reveal zone (user scrolled up past the section)
            // Reset to hidden so the previous section retains complete visual focus
            setVisible(false);
          }
          // Note: if entry.boundingClientRect.top <= 0, the element is scrolled ABOVE the viewport.
          // We intentionally do NOT hide it, ensuring smooth document continuity as the user scrolls downward.
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <div
      ref={ref}
      data-revealed={visible ? 'true' : 'false'}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <span className={className}>{text}</span>
);

const BioWords: React.FC<{ text: string }> = ({ text }) => <>{text}</>;

// TideWord: a word that drifts between the regular and italic cuts of Instrument Serif
// (like a changing current). Staying within ONE typeface keeps the size, x-height and
// width constant, so the word never grows, shrinks or shifts while it animates.
const TIDE_STATES: readonly { family: string; style: 'normal' | 'italic'; weight: number }[] = [
  { family: 'var(--font-hero)', style: 'normal', weight: 400 }, // Instrument Serif Regular
  { family: 'var(--font-hero)', style: 'italic', weight: 400 }, // Instrument Serif Italic
  { family: 'var(--font-hero)', style: 'normal', weight: 400 }, // Instrument Serif Regular
  { family: 'var(--font-hero)', style: 'italic', weight: 400 }  // Instrument Serif Italic
];
const DEFAULT_TIDE_CYCLE_SECONDS = 7; // 1.75s per typeface state, ~0.4s soft-focus dissolve between states

const TideWord: React.FC<{
  text: string;
  offset?: number;
  className?: string;
  cycleSeconds?: number;
}> = ({
  text,
  offset = 0,
  className = '',
  cycleSeconds = DEFAULT_TIDE_CYCLE_SECONDS
}) => {
  const quarter = cycleSeconds / TIDE_STATES.length;
  return (
    <span className={`tide-word ${className}`}>
      <span className="sr-only">{text}</span>
      {TIDE_STATES.map((state, i) => {
        const phase =
          (((quarter / 2 + offset - i * quarter) % cycleSeconds) + cycleSeconds) %
          cycleSeconds;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="tide-layer"
            style={{
              fontFamily: state.family,
              fontStyle: state.style,
              fontWeight: state.weight,
              animationDuration: `${cycleSeconds}s`,
              animationDelay: `-${phase.toFixed(2)}s`
            }}
          >
            {text}
          </span>
        );
      })}
    </span>
  );
};

// 3D Simplex Noise & Curl-Fluid Flow Field adapted from muraleph/glyphwork (glyphwork/flowfield.py)
const SIMPLEX_GRAD3: readonly [number, number, number][] = [
  [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
  [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
  [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];

function createGlyphworkSimplex3D(seed = 42) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = perm[i] % 12;
  }

  const F3 = 1 / 3;
  const G3 = 1 / 6;

  return function noise3d(xin: number, yin: number, zin: number): number {
    const skew = (xin + yin + zin) * F3;
    const i = Math.floor(xin + skew);
    const j = Math.floor(yin + skew);
    const k = Math.floor(zin + skew);
    const unskew = (i + j + k) * G3;

    const x0 = xin - (i - unskew);
    const y0 = yin - (j - unskew);
    const z0 = zin - (k - unskew);

    let i1 = 0, j1 = 0, k1 = 0;
    let i2 = 0, j2 = 0, k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
      } else if (x0 >= z0) {
        i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
      } else {
        i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
      }
    } else if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }

    const x1 = x0 - i1 + G3;
    const y1 = y0 - j1 + G3;
    const z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3;
    const y2 = y0 - j2 + 2 * G3;
    const z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3;
    const y3 = y0 - 1 + 3 * G3;
    const z3 = z0 - 1 + 3 * G3;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;

    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      t0 *= t0;
      const g = SIMPLEX_GRAD3[permMod12[ii + perm[jj + perm[kk]]]];
      n0 = t0 * t0 * (g[0] * x0 + g[1] * y0 + g[2] * z0);
    }

    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      t1 *= t1;
      const g = SIMPLEX_GRAD3[permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]]];
      n1 = t1 * t1 * (g[0] * x1 + g[1] * y1 + g[2] * z1);
    }

    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      t2 *= t2;
      const g = SIMPLEX_GRAD3[permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]]];
      n2 = t2 * t2 * (g[0] * x2 + g[1] * y2 + g[2] * z2);
    }

    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      t3 *= t3;
      const g = SIMPLEX_GRAD3[permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]]];
      n3 = t3 * t3 * (g[0] * x3 + g[1] * y3 + g[2] * z3);
    }

    return 32 * (n0 + n1 + n2 + n3);
  };
}

const HERO_SIMPLEX_NOISE = createGlyphworkSimplex3D(73);
const HERO_FLOW_CHARS = ['.', '·', ':', '+', '*', '#'] as const;
const HERO_FLOW_THRESHOLDS = [0.04, 0.12, 0.23, 0.37, 0.52, 0.67] as const;

interface MigrationWaypoint {
  id: string;
  season: string;
  label: string;
  nx: number;
  ny: number;
  placement: 'top' | 'bottom';
}

const WHALE_MIGRATION_WAYPOINTS: readonly MigrationWaypoint[] = [
  {
    id: 'summer',
    season: 'Summer',
    label: 'Summer · Polar',
    nx: 0.18,
    ny: 0.22,
    placement: 'top'
  },
  {
    id: 'autumn',
    season: 'Autumn',
    label: 'Autumn',
    nx: 0.65,
    ny: 0.26,
    placement: 'top'
  },
  {
    id: 'winter',
    season: 'Winter',
    label: 'Winter · Tropics',
    nx: 0.83,
    ny: 0.74,
    placement: 'bottom'
  },
  {
    id: 'spring',
    season: 'Spring',
    label: 'Spring',
    nx: 0.38,
    ny: 0.72,
    placement: 'bottom'
  }
];

// Evaluates the closed annual whale migration loop in normalized [0..1] chart coordinates
// u in [0, 1): 0.00 = Summer (Polar North-West) -> 0.25 = Autumn Transit -> 0.50 = Winter (Tropical South-East) -> 0.75 = Spring Return
function evalMigrationLoopPoint(u: number): {
  nx: number;
  ny: number;
  tx: number;
  ty: number;
} {
  const angle = u * Math.PI * 2;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  // Tilted oceanic figure-oval spanning from high-latitude feeding grounds (top-left)
  // down to warm equatorial breeding waters (bottom-right) and returning along deep currents
  const nx = 0.5 + 0.34 * (-cosA) + 0.05 * Math.sin(angle * 2);
  const ny = 0.49 + 0.25 * (-cosA) - 0.21 * sinA + 0.03 * Math.cos(angle * 2);

  // Analytic derivative with respect to angle for unit tangent vector
  const dNx = 0.34 * sinA + 0.1 * Math.cos(angle * 2);
  const dNy = 0.25 * sinA - 0.21 * cosA - 0.06 * Math.sin(angle * 2);
  const len = Math.hypot(dNx, dNy) || 1;

  return {
    nx,
    ny,
    tx: dNx / len,
    ty: dNy / len
  };
}

const HeroAsciiCanvas: React.FC<{ isInteractive?: boolean }> = React.memo(({ isInteractive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    targetX: number;
    targetY: number;
    smoothX: number;
    smoothY: number;
    active: boolean;
    strength: number;
  }>({
    targetX: 0.5,
    targetY: 0.5,
    smoothX: 0.5,
    smoothY: 0.5,
    active: false,
    strength: 0
  });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let flowTime = 2.4;
    let prevTimestamp = performance.now();
    let disposed = false;

    // Reusable cell buffers (zero per-frame allocations, eliminates random flickering)
    let bufCols = 0;
    let bufRows = 0;
    let accumBuf = new Float32Array(0);
    let routeMaskBuf = new Float32Array(0);
    let smoothBuf = new Float32Array(0);
    let charIdxBuf = new Int8Array(0);

    // Pre-sampled closed migration loop Lut (160 samples around the 12-month cycle)
    const LOOP_SAMPLES = 160;
    const loopNx = new Float32Array(LOOP_SAMPLES);
    const loopNy = new Float32Array(LOOP_SAMPLES);
    const loopTx = new Float32Array(LOOP_SAMPLES);
    const loopTy = new Float32Array(LOOP_SAMPLES);
    for (let i = 0; i < LOOP_SAMPLES; i++) {
      const pt = evalMigrationLoopPoint(i / LOOP_SAMPLES);
      loopNx[i] = pt.nx;
      loopNy[i] = pt.ny;
      loopTx[i] = pt.tx;
      loopTy[i] = pt.ty;
    }

    // Deterministic stratified seeds for background oceanic curl-field streamlines
    const STREAM_COLS = 10;
    const STREAM_ROWS = 6;
    const STREAM_COUNT = STREAM_COLS * STREAM_ROWS;
    const seedOffsets = new Float32Array(STREAM_COUNT * 3);
    let rng = 1337;
    for (let i = 0; i < STREAM_COUNT; i++) {
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const jx = ((rng & 0xffff) / 0xffff - 0.5) * 0.68;
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const jy = ((rng & 0xffff) / 0xffff - 0.5) * 0.68;
      rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
      const phase = ((rng & 0xffff) / 0xffff) * Math.PI * 2;
      seedOffsets[i * 3] = jx;
      seedOffsets[i * 3 + 1] = jy;
      seedOffsets[i * 3 + 2] = phase;
    }

    // Offscreen static layers + glyph sprite atlas (zero ctx.font / fillText / measureText on DOM canvas per frame)
    const heroUnderlayCanvas = document.createElement('canvas');
    const heroOverlayCanvas = document.createElement('canvas');
    const heroGlyphAtlas = document.createElement('canvas');
    const GLYPH_TILE_W = 12;
    const GLYPH_TILE_H = 16;
    let glyphTilePxW = GLYPH_TILE_W;
    let glyphTilePxH = GLYPH_TILE_H;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let isInViewport = true;
    let loopRunning = false;

    const rebuildStaticLayers = () => {
      const width = canvasWidth;
      const height = canvasHeight;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pw = Math.max(1, Math.round(width * dpr));
      const ph = Math.max(1, Math.round(height * dpr));

      // 1. Glyph sprite atlas: 6 flow chars × 3 oceanic color tiers
      glyphTilePxW = Math.round(GLYPH_TILE_W * dpr);
      glyphTilePxH = Math.round(GLYPH_TILE_H * dpr);
      heroGlyphAtlas.width = HERO_FLOW_CHARS.length * glyphTilePxW;
      heroGlyphAtlas.height = 3 * glyphTilePxH;
      const gCtx = heroGlyphAtlas.getContext('2d');
      if (gCtx) {
        gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        gCtx.clearRect(0, 0, HERO_FLOW_CHARS.length * GLYPH_TILE_W, 3 * GLYPH_TILE_H);
        gCtx.font = '600 10.5px "JetBrains Mono", monospace';
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        const tierColors = ['rgb(15, 30, 42)', 'rgb(42, 66, 82)', 'rgb(74, 98, 112)'];
        for (let tier = 0; tier < 3; tier++) {
          gCtx.fillStyle = tierColors[tier];
          const cy = tier * GLYPH_TILE_H + GLYPH_TILE_H * 0.5;
          for (let c = 0; c < HERO_FLOW_CHARS.length; c++) {
            gCtx.fillText(HERO_FLOW_CHARS[c], c * GLYPH_TILE_W + GLYPH_TILE_W * 0.5, cy);
          }
        }
      }

      // 2. Static hydrographic coordinate grid + latitude parallels underlay
      heroUnderlayCanvas.width = pw;
      heroUnderlayCanvas.height = ph;
      const uCtx = heroUnderlayCanvas.getContext('2d');
      if (uCtx) {
        uCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        uCtx.clearRect(0, 0, width, height);
        uCtx.strokeStyle = 'rgba(23, 23, 23, 0.035)';
        uCtx.lineWidth = 1;
        const gridStep = 32;
        uCtx.beginPath();
        for (let x = gridStep; x < width; x += gridStep) {
          uCtx.moveTo(x, 0);
          uCtx.lineTo(x, height);
        }
        for (let y = gridStep; y < height; y += gridStep) {
          uCtx.moveTo(0, y);
          uCtx.lineTo(width, y);
        }
        uCtx.stroke();

        uCtx.save();
        uCtx.setLineDash([2, 5]);
        uCtx.strokeStyle = 'rgba(23, 23, 23, 0.08)';
        const latBands = [
          { yFrac: 0.22, label: '60°N POLAR' },
          { yFrac: 0.74, label: '15°N TROPICS' }
        ];
        uCtx.font = '500 7.5px "JetBrains Mono", monospace';
        uCtx.textAlign = 'left';
        uCtx.textBaseline = 'bottom';
        uCtx.fillStyle = 'rgba(45, 65, 75, 0.4)';
        for (const band of latBands) {
          const by = Math.round(height * band.yFrac) + 0.5;
          uCtx.beginPath();
          uCtx.moveTo(6, by);
          uCtx.lineTo(width - 6, by);
          uCtx.stroke();
          uCtx.fillText(band.label, 8, by - 2);
        }
        uCtx.restore();
      }

      // 3. Static directional chevrons + seasonal waypoint anchors & pills overlay
      heroOverlayCanvas.width = pw;
      heroOverlayCanvas.height = ph;
      const oCtx = heroOverlayCanvas.getContext('2d');
      if (oCtx) {
        oCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        oCtx.clearRect(0, 0, width, height);

        const arrowPhases = [0.13, 0.38, 0.63, 0.88];
        for (const aPhase of arrowPhases) {
          const pt = evalMigrationLoopPoint(aPhase);
          const ax = pt.nx * width;
          const ay = pt.ny * height;
          const angle = Math.atan2(pt.ty * height, pt.tx * width);
          oCtx.save();
          oCtx.translate(ax, ay);
          oCtx.rotate(angle);
          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.38)';
          oCtx.lineWidth = 1.1;
          oCtx.beginPath();
          oCtx.moveTo(-3, -2.5);
          oCtx.lineTo(2.5, 0);
          oCtx.lineTo(-3, 2.5);
          oCtx.stroke();
          oCtx.restore();
        }

        oCtx.font = '500 9px "Tenor Sans", sans-serif';
        oCtx.textAlign = 'center';
        oCtx.textBaseline = 'middle';
        for (const wp of WHALE_MIGRATION_WAYPOINTS) {
          const wx = wp.nx * width;
          const wy = wp.ny * height;

          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.35)';
          oCtx.lineWidth = 1;
          oCtx.beginPath();
          oCtx.arc(wx, wy, 3.5, 0, Math.PI * 2);
          oCtx.stroke();

          oCtx.fillStyle = '#171717';
          oCtx.beginPath();
          oCtx.arc(wx, wy, 1.8, 0, Math.PI * 2);
          oCtx.fill();

          const textMetrics = oCtx.measureText(wp.label);
          const padX = 5;
          const pillW = textMetrics.width + padX * 2;
          const pillH = 14;
          const pillX = Math.max(5, Math.min(width - pillW - 5, wx - pillW * 0.5));
          const pillY = wp.placement === 'top' ? wy - pillH - 4 : wy + 5;

          oCtx.fillStyle = 'rgba(255, 255, 255, 0.34)';
          oCtx.beginPath();
          if (oCtx.roundRect) {
            oCtx.roundRect(pillX, pillY, pillW, pillH, 2.5);
          } else {
            oCtx.rect(pillX, pillY, pillW, pillH);
          }
          oCtx.fill();
          oCtx.strokeStyle = 'rgba(23, 23, 23, 0.12)';
          oCtx.lineWidth = 0.75;
          oCtx.stroke();

          oCtx.fillStyle = '#171717';
          oCtx.fillText(wp.label, pillX + pillW * 0.5, pillY + pillH * 0.5 + 0.5);
        }
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(canvasWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvasHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildStaticLayers();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const resizeObs =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;
    if (resizeObs) resizeObs.observe(canvas);
    document.fonts?.ready
      .then(() => {
        if (!disposed) {
          rebuildStaticLayers();
          if (prefersReducedMotion || !loopRunning) renderFrame(performance.now(), true);
        }
      })
      .catch(() => undefined);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (isInteractive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // Divergence-free CURL_FLUID streamfunction adapted from glyphwork/flowfield.py
    const sampleStreamPotential = (nx: number, ny: number, t: number): number => {
      const oct1 = HERO_SIMPLEX_NOISE(nx * 1.25 - t * 0.1, ny * 1.65, t * 0.14) * 0.72;
      const oct2 = HERO_SIMPLEX_NOISE(nx * 2.55 - t * 0.17, ny * 3.1 + 4.2, t * 0.22) * 0.24;
      const drift = ny * 0.52 + Math.sin(ny * Math.PI * 1.4 - t * 0.18) * 0.08;

      let cursorPotential = 0;
      const m = mouseRef.current;
      if (m.strength > 0.005) {
        const dx = nx - m.smoothX;
        const dy = (ny - m.smoothY) * 0.65;
        const d2 = dx * dx + dy * dy;
        cursorPotential = m.strength * 0.16 * Math.exp(-d2 / 0.045);
      }

      return oct1 + oct2 + drift + cursorPotential;
    };

    const sampleCurlVector = (nx: number, ny: number, t: number): [number, number] => {
      const eps = 0.006;
      const dPsiDx =
        (sampleStreamPotential(nx + eps, ny, t) - sampleStreamPotential(nx - eps, ny, t)) /
        (2 * eps);
      const dPsiDy =
        (sampleStreamPotential(nx, ny + eps, t) - sampleStreamPotential(nx, ny - eps, t)) /
        (2 * eps);
      const vx = dPsiDy;
      const vy = -dPsiDx * 0.68;
      const mag = Math.hypot(vx, vy) || 1;
      const speed = 0.55 + 0.45 * Math.min(1.6, mag);
      return [(vx / mag) * speed, (vy / mag) * speed];
    };

    // Sub-cell bilinear density splat into accumulation buffer (and optional migration corridor mask)
    const splatBilinear = (
      gx: number,
      gy: number,
      energy: number,
      cols: number,
      rows: number,
      isRouteCorridor = false
    ) => {
      const c0 = Math.floor(gx);
      const r0 = Math.floor(gy);
      if (c0 < -1 || c0 >= cols || r0 < -1 || r0 >= rows) return;
      const fx = gx - c0;
      const fy = gy - r0;

      const w00 = (1 - fx) * (1 - fy) * energy;
      const w10 = fx * (1 - fy) * energy;
      const w01 = (1 - fx) * fy * energy;
      const w11 = fx * fy * energy;

      if (c0 >= 0 && r0 >= 0) {
        const i = r0 * cols + c0;
        accumBuf[i] += w00;
        if (isRouteCorridor) routeMaskBuf[i] += w00;
      }
      if (c0 + 1 < cols && c0 + 1 >= 0 && r0 >= 0) {
        const i = r0 * cols + (c0 + 1);
        accumBuf[i] += w10;
        if (isRouteCorridor) routeMaskBuf[i] += w10;
      }
      if (c0 >= 0 && r0 + 1 < rows && r0 + 1 >= 0) {
        const i = (r0 + 1) * cols + c0;
        accumBuf[i] += w01;
        if (isRouteCorridor) routeMaskBuf[i] += w01;
      }
      if (c0 + 1 < cols && c0 + 1 >= 0 && r0 + 1 < rows && r0 + 1 >= 0) {
        const i = (r0 + 1) * cols + (c0 + 1);
        accumBuf[i] += w11;
        if (isRouteCorridor) routeMaskBuf[i] += w11;
      }
    };

    const renderFrame = (now: number, initialWarmup = false) => {
      loopRunning = false;
      const dt = Math.min(0.05, Math.max(0.001, (now - prevTimestamp) / 1000));
      prevTimestamp = now;

      const width = canvasWidth;
      const height = canvasHeight;
      const isVisible = width > 0 && height > 0;

      if (!prefersReducedMotion && !initialWarmup && isVisible && isInViewport) {
        flowTime += dt * 0.42;
      }

      const m = mouseRef.current;
      m.smoothX += (m.targetX - m.smoothX) * 0.08;
      m.smoothY += (m.targetY - m.smoothY) * 0.08;
      m.strength += ((m.active ? 1 : 0) - m.strength) * 0.07;

      if (isVisible && (isInViewport || initialWarmup)) {
        // Transparent background so the ocean & whale canvas remains visible behind the corridor
        ctx.clearRect(0, 0, width, height);

        // Blit static hydrographic grid & latitude parallels in 1 call
        if (heroUnderlayCanvas.width > 0) {
          ctx.drawImage(heroUnderlayCanvas, 0, 0, width, height);
        }

        const cellW = 7.6;
        const cellH = 10.8;
        const cols = Math.max(8, Math.floor(width / cellW));
        const rows = Math.max(6, Math.floor(height / cellH));
        const totalCells = cols * rows;

        if (cols !== bufCols || rows !== bufRows) {
          bufCols = cols;
          bufRows = rows;
          accumBuf = new Float32Array(totalCells);
          routeMaskBuf = new Float32Array(totalCells);
          smoothBuf = new Float32Array(totalCells);
          charIdxBuf = new Int8Array(totalCells).fill(-1);
        } else {
          accumBuf.fill(0);
          routeMaskBuf.fill(0);
        }

        // 1. Ambient curl-field oceanic streamlines (soft background water movement)
        const stepsPerCurve = 42;
        const stepCells = 0.68;

        for (let sIdx = 0; sIdx < STREAM_COUNT; sIdx++) {
          const sCol = sIdx % STREAM_COLS;
          const sRow = Math.floor(sIdx / STREAM_COLS);
          const jx = seedOffsets[sIdx * 3];
          const jy = seedOffsets[sIdx * 3 + 1];
          const phase = seedOffsets[sIdx * 3 + 2];

          const baseNx = -0.12 + ((sCol + 0.5 + jx) / STREAM_COLS) * 1.16;
          const baseNy = 0.04 + ((sRow + 0.5 + jy) / STREAM_ROWS) * 0.92;

          let gx = baseNx * cols;
          let gy = baseNy * rows;

          const layerWeight = sIdx % 3 === 0 ? 0.19 : sIdx % 3 === 1 ? 0.14 : 0.1;

          for (let step = 0; step < stepsPerCurve; step++) {
            const u = step / (stepsPerCurve - 1);
            const taper = Math.sin(Math.PI * u);
            const wave = 0.5 + 0.5 * Math.sin(step * 0.2 - flowTime * 1.8 + phase);
            const pulse = 0.35 + 0.65 * wave;

            splatBilinear(gx - 0.5, gy - 0.5, taper * pulse * layerWeight, cols, rows, false);

            const nx = gx / cols;
            const ny = gy / rows;
            const [vx1, vy1] = sampleCurlVector(nx, ny, flowTime);
            const midGx = gx + vx1 * stepCells * 0.5;
            const midGy = gy + vy1 * stepCells * 0.5;
            const [vx2, vy2] = sampleCurlVector(midGx / cols, midGy / rows, flowTime);

            gx += vx2 * stepCells;
            gy += vy2 * stepCells;
          }
        }

        // 2. Primary Annual Whale Migration Corridor (high-density ASCII current loop + directional pulses)
        // A whale pod position (`podPhase`) completes one full annual cycle every ~14 seconds
        const podPhase = (flowTime * 0.068) % 1;

        for (let i = 0; i < LOOP_SAMPLES; i++) {
          const u = i / LOOP_SAMPLES;
          const nx = loopNx[i];
          const ny = loopNy[i];
          const tx = loopTx[i];
          const ty = loopTy[i];
          // Normal vector perpendicular to the migration path
          const px = -ty;
          const py = tx;

          // Subtle organic curl breathing along the corridor
          const noiseDisp = HERO_SIMPLEX_NOISE(nx * 3.2, ny * 3.2, flowTime * 0.25) * 0.012;
          const cx = (nx + px * noiseDisp) * cols - 0.5;
          const cy = (ny + py * noiseDisp) * rows - 0.5;

          // Directional traveling wave packets moving forward along the annual loop
          const waveAlong = 0.5 + 0.5 * Math.sin((u * 6 - flowTime * 0.55) * Math.PI * 2);

          // Distance behind the migrating whale pod for a luminous hydrographic wake
          let dPod = u - podPhase;
          if (dPod < 0) dPod += 1;
          // Wake is strongest right at the pod (dPod ~ 0.92..1.0 or 0.0) and trails behind
          const distBehind = 1 - dPod;
          const podWake = Math.exp(-(distBehind * distBehind) / 0.018);

          const coreEnergy = 0.36 + 0.26 * waveAlong + 0.55 * podWake;

          // Splat core spine of the migration corridor + flanking current filaments
          splatBilinear(cx, cy, coreEnergy, cols, rows, true);
          splatBilinear(
            cx + px * 0.85,
            cy + py * 0.65,
            coreEnergy * 0.52,
            cols,
            rows,
            true
          );
          splatBilinear(
            cx - px * 0.85,
            cy - py * 0.65,
            coreEnergy * 0.52,
            cols,
            rows,
            true
          );
        }

        // 3. Render density-mapped ASCII characters (. · : + * #) via pre-baked sprite atlas
        const offsetX = (width - cols * cellW) * 0.5;
        const offsetY = (height - rows * cellH) * 0.5;
        const lerpFactor = initialWarmup || prefersReducedMotion ? 1.0 : 0.22;
        const hyst = 0.014;

        for (let r = 0; r < rows; r++) {
          const py = offsetY + r * cellH + cellH * 0.5 - GLYPH_TILE_H * 0.5;
          for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const target = 1 - Math.exp(-accumBuf[idx] * 1.65);
            const val = smoothBuf[idx] + (target - smoothBuf[idx]) * lerpFactor;
            smoothBuf[idx] = val;

            let cIdx = charIdxBuf[idx];
            if (val < HERO_FLOW_THRESHOLDS[0] - (cIdx >= 0 ? hyst : 0)) {
              cIdx = -1;
            } else {
              let desired = 0;
              for (let t = HERO_FLOW_THRESHOLDS.length - 1; t >= 0; t--) {
                if (val >= HERO_FLOW_THRESHOLDS[t]) {
                  desired = t;
                  break;
                }
              }
              if (cIdx < 0) {
                cIdx = desired;
              } else if (desired > cIdx && val >= HERO_FLOW_THRESHOLDS[desired] + hyst) {
                cIdx = desired;
              } else if (desired < cIdx && val < HERO_FLOW_THRESHOLDS[cIdx] - hyst) {
                cIdx = desired;
              }
            }
            charIdxBuf[idx] = cIdx;

            if (cIdx < 0) continue;

            const px = offsetX + c * cellW + cellW * 0.5 - GLYPH_TILE_W * 0.5;
            const normAlpha = Math.min(1, Math.max(0, (val - 0.03) / 0.72));
            const isCorridor = routeMaskBuf[idx] > 0.12;

            let tierRow: number;
            let a: number;
            if (cIdx >= 4 || isCorridor) {
              tierRow = 0;
              a = isCorridor ? Math.min(1, 0.72 + normAlpha * 0.28) : 0.78 + normAlpha * 0.2;
            } else if (cIdx >= 2) {
              tierRow = 1;
              a = 0.44 + normAlpha * 0.36;
            } else {
              tierRow = 2;
              a = 0.2 + normAlpha * 0.28;
            }

            ctx.globalAlpha = a;
            ctx.drawImage(
              heroGlyphAtlas,
              cIdx * glyphTilePxW,
              tierRow * glyphTilePxH,
              glyphTilePxW,
              glyphTilePxH,
              px,
              py,
              GLYPH_TILE_W,
              GLYPH_TILE_H
            );
          }
        }
        ctx.globalAlpha = 1;

        // 4 & 5. Blit static directional chevrons + seasonal waypoint anchors & pills in 1 call
        if (heroOverlayCanvas.width > 0) {
          ctx.drawImage(heroOverlayCanvas, 0, 0, width, height);
        }

        // 6. Draw Live Migrating Whale Pod Beacon traveling along the annual route
        const podPt = evalMigrationLoopPoint(podPhase);
        const podX = podPt.nx * width;
        const podY = podPt.ny * height;
        const pulseRadius = 5 + 3 * (0.5 + 0.5 * Math.sin(flowTime * 4.2));

        ctx.strokeStyle = 'rgba(182, 197, 176, 0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(podX, podY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#171717';
        ctx.beginPath();
        ctx.arc(podX, podY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#B6C5B0';
        ctx.beginPath();
        ctx.arc(podX, podY, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion && !initialWarmup && isVisible && isInViewport) {
        loopRunning = true;
        animFrameRef.current = requestAnimationFrame((ts) => renderFrame(ts, false));
      }
    };

    const startLoopIfNeeded = () => {
      if (!prefersReducedMotion && !loopRunning && isInViewport && canvasWidth > 0 && canvasHeight > 0) {
        loopRunning = true;
        prevTimestamp = performance.now();
        animFrameRef.current = requestAnimationFrame((ts) => renderFrame(ts, false));
      }
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                isInViewport = entry.isIntersecting;
              }
              if (isInViewport) startLoopIfNeeded();
            },
            { rootMargin: '120px 0px 120px 0px', threshold: 0 }
          )
        : null;
    if (io) io.observe(canvas);

    // Render initial settled state immediately
    renderFrame(performance.now(), true);
    startLoopIfNeeded();

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      if (resizeObs) resizeObs.disconnect();
      if (io) io.disconnect();
      if (isInteractive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [isInteractive]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
});

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', intensity = 5.5 }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    setRotate({ x: -normY * intensity, y: normX * intensity });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(${
          isHovered ? 1.006 : 1
        }, ${isHovered ? 1.006 : 1}, 1)`,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 120ms ease-out' : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: glare.opacity,
          background: `radial-gradient(circle 380px at ${glare.x}% ${glare.y}%, rgba(182, 197, 176, 0.38), rgba(23, 23, 23, 0.03) 45%, transparent 75%)`
        }}
      >
        <div
          className="w-full h-full opacity-25"
          style={{ backgroundImage: 'radial-gradient(#171717 0.75px, transparent 0.75px)', backgroundSize: '12px 12px' }}
        />
      </div>
      {children}
    </div>
  );
};

// ============================================================================
// ABYSS PALETTE — one shared table for the scroll-driven descent (Stage 5)
// ============================================================================
// Every original dark text colour / hairline / paper panel gets its own CSS variable whose
// light value is EXACTLY the original (so the surface looks unchanged) and whose dark value
// reads on night water. The whale canvas interpolates them from the same page progress that
// drives the dark water after the Globe section — no independent CSS transitions.
type AbyssRGB = [number, number, number];
const ABYSS_TEXT: { hex: string; light: AbyssRGB; dark: AbyssRGB }[] = [
  { hex: '171717', light: [23, 23, 23], dark: [230, 236, 232] },
  { hex: '162633', light: [22, 38, 51], dark: [222, 232, 234] },
  { hex: '1F2428', light: [31, 36, 40], dark: [226, 232, 229] },
  { hex: '2B353B', light: [43, 53, 59], dark: [212, 222, 219] },
  { hex: '1F3B57', light: [31, 59, 87], dark: [178, 204, 212] },
  { hex: '3E4C52', light: [62, 76, 82], dark: [180, 198, 192] },
  { hex: '3E5666', light: [62, 86, 102], dark: [176, 196, 200] },
  { hex: '49606E', light: [73, 96, 110], dark: [170, 190, 194] },
  { hex: '52595E', light: [82, 89, 94], dark: [176, 194, 188] },
  { hex: '77766F', light: [119, 118, 111], dark: [162, 180, 174] }
];
const ABYSS_TEXT_ALPHA_VARIANTS = [
  'text-[#171717]/85',
  'text-[#171717]/90',
  'text-[#52595E]/40',
  'text-[#52595E]/50',
  'text-[#52595E]/70',
  'text-[#52595E]/80',
  'text-[#52595E]/90'
];
const ABYSS_RULE_ALPHAS = [10, 12, 15, 20];
const ABYSS_FILLS: { token: string; name: string; light: number[]; dark: number[] }[] = [
  { token: 'bg-[#F5F3EE]', name: 'p1', light: [255, 255, 255, 0.28], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#F5F3EE]/90', name: 'p2', light: [255, 255, 255, 0.26], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#EFECE6]', name: 'p3', light: [255, 255, 255, 0.22], dark: [255, 255, 255, 0.05] },
  { token: 'bg-[#EFECE6]/50', name: 'p4', light: [255, 255, 255, 0.18], dark: [255, 255, 255, 0.04] },
  { token: 'bg-[#EFECE6]/90', name: 'p5', light: [255, 255, 255, 0.26], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#EFECE6]/95', name: 'p6', light: [255, 255, 255, 0.28], dark: [255, 255, 255, 0.06] },
  { token: 'bg-[#E4EAEB]', name: 'p7', light: [255, 255, 255, 0.34], dark: [255, 255, 255, 0.1] },
  { token: 'bg-[#1F3B57]/15', name: 'a1', light: [31, 59, 87, 0.15], dark: [178, 204, 212, 0.2] },
  { token: 'bg-[#1F3B57]/45', name: 'a2', light: [31, 59, 87, 0.45], dark: [178, 204, 212, 0.55] },
  { token: 'bg-[#1F3B57]/60', name: 'a3', light: [31, 59, 87, 0.6], dark: [200, 220, 226, 0.75] },
  { token: 'bg-[#162633]', name: 'a4', light: [22, 38, 51, 1], dark: [222, 232, 234, 1] }
];
const lerpN = (a: number, b: number, t: number) => a + (b - a) * t;

// Geometry is owned by JourneyGlobe's existing resize/scroll sequence.
const globeScrollGeometry = { start: Infinity, travel: 1 };
const globeScrollProgress = () => Math.max(0, Math.min(1,
  (window.scrollY - globeScrollGeometry.start) / globeScrollGeometry.travel));
/** Progressive descent across the complete pinned city sequence. */
const abyssFromProgress = (progress: number) => {
  const t = Math.max(0, Math.min(1, progress));
  return t ** 1.5;
};
/** Switch ink near the neutral background's equal-contrast midpoint. */
const inkMixFromAbyss = (abyss: number) => {
  const t = Math.max(0, Math.min(1, (abyss - 0.53) / 0.02));
  return t * t * (3 - 2 * t);
};

function applyAbyssPalette(t: number) {
  const root = document.documentElement.style;
  for (const c of ABYSS_TEXT) {
    root.setProperty(
      `--ink-${c.hex}`,
      `rgb(${Math.round(lerpN(c.light[0], c.dark[0], t))}, ${Math.round(lerpN(c.light[1], c.dark[1], t))}, ${Math.round(lerpN(c.light[2], c.dark[2], t))})`
    );
  }
  for (const a of ABYSS_RULE_ALPHAS) {
    const al = a / 100;
    root.setProperty(
      `--rule-${a}`,
      `rgba(${Math.round(lerpN(23, 214, t))}, ${Math.round(lerpN(23, 228, t))}, ${Math.round(lerpN(23, 222, t))}, ${lerpN(al, al * 1.1, t).toFixed(3)})`
    );
  }
  for (const f of ABYSS_FILLS) {
    root.setProperty(
      `--fill-${f.name}`,
      `rgba(${Math.round(lerpN(f.light[0], f.dark[0], t))}, ${Math.round(lerpN(f.light[1], f.dark[1], t))}, ${Math.round(lerpN(f.light[2], f.dark[2], t))}, ${lerpN(f.light[3], f.dark[3], t).toFixed(3)})`
    );
  }
  root.setProperty('--glass-bg', `rgba(255, 255, 255, ${lerpN(0.28, 0.06, t).toFixed(3)})`);
  root.setProperty('--glass-chip-bg', `rgba(255, 255, 255, ${lerpN(0.2, 0.04, t).toFixed(3)})`);
  root.setProperty(
    '--glass-border',
    `rgba(${Math.round(lerpN(0, 255, t))}, ${Math.round(lerpN(0, 255, t))}, ${Math.round(lerpN(0, 255, t))}, ${lerpN(0.1, 0.18, t).toFixed(3)})`
  );
}

/**
 * Text washes & halos track the WATER colour continuously (no light panel cut out of dark
 * water): a touch lighter than the water while text is dark, a touch darker once it is pale.
 */
function applyAbyssWash(abyssLevel: number) {
  const shade = Math.round(255 * (1 - abyssLevel));
  const root = document.documentElement.style;
  root.setProperty('--ocean-background', `rgb(${shade}, ${shade}, ${shade})`);
  root.setProperty('--abyss-wash', `${shade}, ${shade}, ${shade}`);
  root.setProperty('--abyss-halo', `rgba(${shade}, ${shade}, ${shade}, 0.82)`);
}

function buildAbyssCss(): string {
  const scope = '.ocean-legible';
  const rules: string[] = [];
  const both = (token: string) => `${scope}[class~="${token}"], ${scope} [class~="${token}"]`;
  rules.push(`:root {
    ${ABYSS_TEXT.map((c) => `--ink-${c.hex}: rgb(${c.light.join(', ')});`).join('\n    ')}
    ${ABYSS_RULE_ALPHAS.map((a) => `--rule-${a}: rgba(23, 23, 23, ${a / 100});`).join('\n    ')}
    ${ABYSS_FILLS.map((f) => `--fill-${f.name}: rgba(${f.light.join(', ')});`).join('\n    ')}
    --ocean-background: #FFFFFF;
    --abyss-halo: rgba(255, 255, 255, 0.85);
    --abyss-wash: 255, 255, 255;
    --glass-bg: rgba(255, 255, 255, 0.28);
    --glass-chip-bg: rgba(255, 255, 255, 0.20);
    --glass-border: rgba(0, 0, 0, 0.10);
  }`);
  rules.push(`html, body { background-color: var(--ocean-background); }`);
  rules.push(`.glass-panel { background-color: var(--glass-bg); border: 1px solid var(--glass-border); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }`);
  rules.push(`.glass-chip { background-color: var(--glass-chip-bg); border: 1px solid var(--glass-border); }`);
  rules.push(`.glass-rule { border-color: var(--glass-border) !important; }`);
  rules.push(`${scope} { color: var(--ink-171717); }`);
  for (const c of ABYSS_TEXT) rules.push(`${both(`text-[#${c.hex}]`)} { color: var(--ink-${c.hex}) !important; }`);
  for (const token of ABYSS_TEXT_ALPHA_VARIANTS) {
    const hex = token.slice(7, 13);
    const pct = token.split('/')[1];
    rules.push(`${both(token)} { color: color-mix(in srgb, var(--ink-${hex}) ${pct}%, transparent) !important; }`);
  }
  for (const a of ABYSS_RULE_ALPHAS) rules.push(`${both(`border-[#171717]/${a}`)} { border-color: var(--rule-${a}) !important; }`);
  for (const f of ABYSS_FILLS) rules.push(`${both(f.token)} { background-color: var(--fill-${f.name}) !important; }`);
  // Sage buttons keep their dark label on every water depth
  rules.push(
    `${both('bg-[#B6C5B0]')}, ${scope} [class~="bg-[#B6C5B0]"] * { color: rgb(23, 23, 23) !important; text-shadow: none; }`
  );
  return rules.join('\n');
}

interface JourneyGlobeProps {
  locations: LocationItem[];
}

/**
 * Journey timeline shared by the camera, routes and overlays: alternating DWELLS (camera
 * rests on a city) and LEGS (camera travels to the next city). A leg's share of the scroll
 * grows gently with the years spent in the city it leaves, parsed from the existing `period`.
 */
type JourneySeg = { kind: 'dwell' | 'leg'; i: number; start: number; end: number };
function buildJourneyTimeline(locations: LocationItem[]): JourneySeg[] {
  const yearsIn = (loc: LocationItem): number => {
    const ys = (loc.period.match(/\d{4}/g) || []).map(Number);
    return ys.length >= 2 ? Math.max(1, ys[1] - ys[0]) : 1;
  };
  const raw: { kind: 'dwell' | 'leg'; i: number; w: number }[] = [];
  locations.forEach((loc, i) => {
    raw.push({ kind: 'dwell', i, w: 0.8 });
    if (i < locations.length - 1) raw.push({ kind: 'leg', i, w: 1 + yearsIn(loc) * 0.25 });
  });
  const total = raw.reduce((a, s) => a + s.w, 0);
  let acc = 0;
  return raw.map((s) => {
    const seg = { kind: s.kind, i: s.i, start: acc / total, end: (acc + s.w) / total };
    acc += s.w;
    return seg;
  });
}

// ---- Spherical geometry (unit vectors; no longitude wrap-around issues) -----
type Vec3 = [number, number, number];
const GEO_RAD = Math.PI / 180;
const lonLatToVec = (lon: number, lat: number): Vec3 => [
  Math.cos(lat * GEO_RAD) * Math.cos(lon * GEO_RAD),
  Math.cos(lat * GEO_RAD) * Math.sin(lon * GEO_RAD),
  Math.sin(lat * GEO_RAD)
];
const vecDot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vecNormalize = (v: Vec3): Vec3 => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
/** Great-circle interpolation between two unit vectors (always the short way round) */
const vecSlerp = (a: Vec3, b: Vec3, t: number): Vec3 => {
  const omega = Math.acos(Math.max(-1, Math.min(1, vecDot(a, b))));
  if (omega < 1e-6) return a;
  const s = Math.sin(omega);
  const k1 = Math.sin((1 - t) * omega) / s;
  const k2 = Math.sin(t * omega) / s;
  return vecNormalize([k1 * a[0] + k2 * b[0], k1 * a[1] + k2 * b[1], k1 * a[2] + k2 * b[2]]);
};

/** Canvas label placement per city (keeps Paris/Pau and Singapore/Jakarta apart) */
const JOURNEY_LABEL_OFFSETS: Record<string, { dx: number; dy: number; align: CanvasTextAlign }> = {
  doha: { dx: 13, dy: 17, align: 'left' },
  paris: { dx: 13, dy: -11, align: 'left' },
  jakarta: { dx: 13, dy: 18, align: 'left' },
  moscow: { dx: 13, dy: -11, align: 'left' },
  singapore: { dx: -13, dy: -11, align: 'right' },
  pau: { dx: -13, dy: 17, align: 'right' },
  shanghai: { dx: 13, dy: -11, align: 'left' }
};

/**
 * JourneyGlobe — a clean orthographic globe drawn on one transparent canvas.
 *
 * A single scroll-progress value p ∈ [0, 1] (the pinned runway around the stage) is the
 * only source of truth. It deterministically yields the camera (great-circle position +
 * zoom), the route drawing, the destination markers, the active city, the dates, the
 * description and the timeline. Rendering happens on demand (one frame per scroll /
 * resize change) — no timers, no autoplay, nothing moves once scrolling stops.
 */
const JourneyGlobe: React.FC<JourneyGlobeProps> = React.memo(({ locations }) => {
  const [activeId, setActiveId] = useState<string>(() => locations[0]?.id || 'doha');
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const goToCityRef = useRef<(id: string) => void>((id) => setActiveId(id));
  const requestRenderRef = useRef<() => void>(() => {});
  const segs = useMemo(() => buildJourneyTimeline(locations), [locations]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;
    const domCtx = canvas.getContext('2d', { alpha: true });
    if (!domCtx) return;

    // Offscreen drawing buffer disconnected from Document so font/text ops never trigger Blink style recalcs
    const offCanvas = document.createElement('canvas');
    const ctx = offCanvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      !!window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let disposed = false;

    // Pre-measured city label widths (zero ctx.measureText calls during scroll)
    const activeLabelWidths = new Float32Array(locations.length);
    const inactiveLabelWidths = new Float32Array(locations.length);
    const measureCityLabels = () => {
      ctx.save();
      ctx.font = '14px "Tenor Sans", sans-serif';
      for (let i = 0; i < locations.length; i++) {
        activeLabelWidths[i] = ctx.measureText(locations[i].city.toUpperCase()).width;
      }
      ctx.font = '11.5px "JetBrains Mono", monospace';
      for (let i = 0; i < locations.length; i++) {
        inactiveLabelWidths[i] = ctx.measureText(locations[i].city).width;
      }
      ctx.restore();
    };
    measureCityLabels();

    // ---- Static geometry -----------------------------------------------------
    const cityVecs = locations.map((l) => lonLatToVec(l.lon, l.lat));
    const legCount = locations.length - 1;
    const ROUTE_SAMPLES = 96;
    const routes: Vec3[][] = [];
    const legAngleDeg: number[] = [];
    for (let i = 0; i < legCount; i++) {
      const pts: Vec3[] = [];
      for (let k = 0; k <= ROUTE_SAMPLES; k++) pts.push(vecSlerp(cityVecs[i], cityVecs[i + 1], k / ROUTE_SAMPLES));
      routes.push(pts);
      legAngleDeg.push(Math.acos(Math.max(-1, Math.min(1, vecDot(cityVecs[i], cityVecs[i + 1])))) / GEO_RAD);
    }
    // Faint graticule every 30°
    const graticule: Vec3[][] = [];
    for (let lon = -180; lon < 180; lon += 30) {
      const line: Vec3[] = [];
      for (let lat = -80; lat <= 80; lat += 4) line.push(lonLatToVec(lon, lat));
      graticule.push(line);
    }
    for (let lat = -60; lat <= 60; lat += 30) {
      const line: Vec3[] = [];
      for (let lon = -180; lon <= 180; lon += 4) line.push(lonLatToVec(lon, lat));
      graticule.push(line);
    }
    const overviewVec = vecNormalize(
      cityVecs.reduce<Vec3>((acc, v) => [acc[0] + v[0], acc[1] + v[1], acc[2] + v[2]], [0, 0, 0])
    );

    let land: LandDots | null = null;
    let dotBuckets: [Float32Array, Float32Array, Float32Array, Float32Array] | null = null;
    const DOT_BUCKET_ALPHAS = [0.13, 0.34, 0.56, 0.78] as const;
    loadLandDots()
      .then((dots) => {
        if (disposed) return;
        land = dots;
        const maxPerBand = Math.max(64, Math.ceil(dots.xyz.length / 3));
        dotBuckets = [
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3),
          new Float32Array(maxPerBand * 3)
        ];
        requestRender();
      })
      .catch(() => {
        /* the globe still renders (sphere, graticule, route, markers) without land dots */
      });

    // ---- Journey state from the single progress value -----------------------
    type JourneyState = {
      p: number;
      routeFrac: number[];
      reveal: number[];
      active: number;
      cam: Vec3;
      zoom: number;
      tracing: number; // index of the leg currently being drawn, or -1
    };
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const stateAt = (p: number): JourneyState => {
      const pc = Math.max(0, Math.min(1, p));
      let seg = segs[segs.length - 1];
      for (const s of segs) {
        if (pc <= s.end) {
          seg = s;
          break;
        }
      }
      const local = seg.end > seg.start ? Math.max(0, Math.min(1, (pc - seg.start) / (seg.end - seg.start))) : 1;
      const routeFrac = routes.map((_, j) => {
        if (seg.kind === 'dwell') return j < seg.i ? 1 : 0;
        if (j < seg.i) return 1;
        if (j > seg.i) return 0;
        return Math.min(1, local * 1.25); // the route draws slightly ahead of the camera
      });
      const reveal = locations.map((_, k) =>
        k === 0 ? 1 : Math.max(0, Math.min(1, (routeFrac[k - 1] - 0.9) / 0.1))
      );
      if (seg.kind === 'dwell') {
        return { p: pc, routeFrac, reveal, active: seg.i, cam: cityVecs[seg.i], zoom: 1.08, tracing: -1 };
      }
      const pull = Math.sin(Math.PI * local) * Math.min(1, legAngleDeg[seg.i] / 80);
      return {
        p: pc,
        routeFrac,
        reveal,
        active: local < 0.55 ? seg.i : seg.i + 1,
        cam: vecSlerp(cityVecs[seg.i], cityVecs[seg.i + 1], smooth(local)),
        zoom: 1.08 - 0.24 * pull, // pull back on long legs so both ends stay in frame
        tracing: routeFrac[seg.i] < 1 ? seg.i : -1
      };
    };
    const reducedState = (): JourneyState => ({
      p: 1,
      routeFrac: routes.map(() => 1),
      reveal: locations.map(() => 1),
      active: Math.max(0, locations.findIndex((l) => l.id === activeIdRef.current)),
      cam: overviewVec,
      zoom: 0.92,
      tracing: -1
    });

    // ---- Cached geometry (zero forced layout / getComputedStyle during scroll) ----
    const runway = stage.closest('[data-journey-runway]') as HTMLElement | null;
    const pinned = runway?.firstElementChild as HTMLElement | null;
    let runwayDocTop = 0;
    let runwayTravel = 1;
    let stickyTop = 0;
    let stageDocLeft = 0;
    let cachedDocScrollable = 1;
    let globeInView = true;

    // ---- Canvas sizing ---------------------------------------------------------
    let W = 0;
    let H = 0;
    let dpr = 1;
    const resize = () => {
      const sy = window.scrollY;
      const sx = window.scrollX;
      const rect = stage.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      stageDocLeft = rect.left + sx;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pw = Math.max(1, Math.round(W * dpr));
      const ph = Math.max(1, Math.round(H * dpr));
      canvas.width = pw;
      canvas.height = ph;
      offCanvas.width = pw;
      offCanvas.height = ph;
      if (runway && pinned) {
        const rr = runway.getBoundingClientRect();
        const pr = pinned.getBoundingClientRect();
        runwayDocTop = rr.top + sy;
        runwayTravel = Math.max(1, rr.height - pr.height);
        stickyTop = parseFloat(getComputedStyle(pinned).top) || 0;
        globeScrollGeometry.start = runwayDocTop - stickyTop;
        globeScrollGeometry.travel = runwayTravel;
      }
      cachedDocScrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const progressGeometry = () => {
      if (!runway || !pinned || runwayTravel <= 1) return null;
      return { top: runwayDocTop - window.scrollY, stickyTop, travel: runwayTravel };
    };
    const measureProgress = (): number => {
      return globeScrollProgress();
    };

    const drawOrderBuf = locations.map((_, k) => k);

    // ---- Drawing -----------------------------------------------------------------
    const draw = (st: JourneyState) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const mobile = W < 768;
      const cx = mobile ? W * 0.5 : W * 0.64;
      const cy = mobile ? H * 0.34 : H * 0.47;
      const baseR = mobile ? Math.min(W * 0.4, H * 0.26) : Math.min(W * 0.27, H * 0.39);
      const R = baseR * st.zoom;

      // Camera basis (orthographic): view direction + local east/north on screen
      const view = st.cam;
      let east: Vec3 = [-view[1], view[0], 0];
      if (Math.hypot(east[0], east[1]) < 1e-6) east = [1, 0, 0];
      east = vecNormalize(east);
      const north: Vec3 = [
        view[1] * east[2] - view[2] * east[1],
        view[2] * east[0] - view[0] * east[2],
        view[0] * east[1] - view[1] * east[0]
      ];
      const px = (v: Vec3) => cx + R * vecDot(v, east);
      const py = (v: Vec3) => cy - R * vecDot(v, north);

      // Keep globe labels legible on the same descent as the surrounding page.
      const nt = abyssFromProgress(measureProgress());
      const mc = (l: number[], d: number[]) =>
        `rgba(${Math.round(lerpN(l[0], d[0], nt))}, ${Math.round(lerpN(l[1], d[1], nt))}, ${Math.round(lerpN(l[2], d[2], nt))}, ${lerpN(l[3] ?? 1, d[3] ?? 1, nt).toFixed(3)})`;

      // Sphere: soft paper disc (separates the globe from the whales) + hairline limb
      const ocean = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      ocean.addColorStop(0, mc([249, 248, 245, 0.95], [150, 172, 170, 0.6]));
      ocean.addColorStop(1, mc([231, 235, 236, 0.95], [112, 134, 132, 0.66]));
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = ocean;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = mc([31, 59, 87, 0.22], [200, 218, 216, 0.32]);
      ctx.stroke();

      // Graticule (front hemisphere only, batched into 1 stroke call)
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = mc([31, 59, 87, 0.08], [16, 34, 30, 0.12]);
      ctx.beginPath();
      for (const line of graticule) {
        let pen = false;
        for (const v of line) {
          if (vecDot(v, view) > 0) {
            if (pen) ctx.lineTo(px(v), py(v));
            else ctx.moveTo(px(v), py(v));
            pen = true;
          } else pen = false;
        }
      }
      ctx.stroke();

      // Land: fine dot-matrix batched into 4 alpha buckets per relief band (<=12 fill calls instead of ~2,000)
      if (land && dotBuckets) {
        const { xyz, bands } = land;
        const ex = east[0], ey = east[1], ez = east[2];
        const nx = north[0], ny = north[1], nz = north[2];
        const vx = view[0], vy = view[1], vz = view[2];
        const dotScale = Math.max(0.75, Math.min(1.6, R / 300));
        const bandColors = [
          mc([86, 99, 109], [36, 60, 54]),
          mc([60, 72, 82], [22, 44, 38]),
          mc([38, 49, 58], [10, 26, 22])
        ];
        const bCounts = [0, 0, 0, 0];
        for (let b = 0; b < 3; b++) {
          ctx.fillStyle = bandColors[b];
          bCounts[0] = 0;
          bCounts[1] = 0;
          bCounts[2] = 0;
          bCounts[3] = 0;
          for (let d = bands[b]; d < bands[b + 1]; d++) {
            const o = d * 3;
            const x = xyz[o], y = xyz[o + 1], z = xyz[o + 2];
            const depth = x * vx + y * vy + z * vz;
            if (depth <= 0.14) continue;
            const sx = cx + R * (x * ex + y * ey + z * ez);
            const sy = cy - R * (x * nx + y * ny + z * nz);
            const s = (0.75 + depth * 1.0) * dotScale;
            const limb = Math.min(1, (depth - 0.14) / 0.3);
            const alpha = (0.2 + depth * 0.65) * limb;
            const tIdx = Math.min(3, (alpha * 4.5) | 0);
            const pos = bCounts[tIdx] * 3;
            const arr = dotBuckets[tIdx];
            arr[pos] = sx - s * 0.5;
            arr[pos + 1] = sy - s * 0.5;
            arr[pos + 2] = s;
            bCounts[tIdx]++;
          }
          for (let t = 0; t < 4; t++) {
            const cnt = bCounts[t];
            if (cnt === 0) continue;
            ctx.globalAlpha = DOT_BUCKET_ALPHAS[t];
            ctx.beginPath();
            const arr = dotBuckets[t];
            for (let m = 0; m < cnt; m++) {
              const p = m * 3;
              const s = arr[p + 2];
              ctx.rect(arr[p], arr[p + 1], s, s);
            }
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      // Routes: completed legs a quiet hairline, the current leg slightly stronger
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      let head: { x: number; y: number } | null = null;
      for (let j = 0; j < routes.length; j++) {
        const f = st.routeFrac[j];
        if (f <= 0) continue;
        const pts = routes[j];
        const end = f * ROUTE_SAMPLES;
        const whole = Math.floor(end);
        ctx.beginPath();
        let pen = false;
        let last: { x: number; y: number } | null = null;
        for (let k = 0; k <= whole; k++) {
          const v = pts[k];
          if (vecDot(v, view) > 0) {
            const x = px(v), y = py(v);
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
            last = { x, y };
          } else pen = false;
        }
        const frac = end - whole;
        if (frac > 0 && whole < ROUTE_SAMPLES) {
          const v = vecSlerp(pts[whole], pts[whole + 1], frac);
          if (vecDot(v, view) > 0 && pen) {
            const x = px(v), y = py(v);
            ctx.lineTo(x, y);
            last = { x, y };
          }
        }
        const isCurrent = j === st.tracing;
        ctx.strokeStyle = isCurrent
          ? mc([22, 38, 51, 0.85], [6, 20, 16, 0.9])
          : mc([31, 59, 87, 0.55], [14, 38, 32, 0.6]);
        ctx.lineWidth = isCurrent ? 1.8 : 1.3;
        ctx.stroke();
        if (isCurrent) head = last;
      }
      if (head) {
        ctx.beginPath();
        ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = mc([22, 38, 51], [6, 20, 16]);
        ctx.fill();
      }

      // Destination markers: future = faint ring, reached = solid, active = solid + ring
      const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];
      for (let i = 0; i < locations.length; i++) drawOrderBuf[i] = i;
      drawOrderBuf.sort((a, b) => (a === st.active ? 1 : b === st.active ? -1 : 0));
      for (let oi = 0; oi < drawOrderBuf.length; oi++) {
        const k = drawOrderBuf[oi];
        const v = cityVecs[k];
        const depth = vecDot(v, view);
        if (depth <= 0.02) continue;
        const x = px(v);
        const y = py(v);
        const rv = st.reveal[k];
        const isActive = k === st.active && rv > 0.5;
        if (rv <= 0.01) {
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.strokeStyle = mc([31, 59, 87, 0.35], [14, 38, 32, 0.45]);
          ctx.lineWidth = 1;
          ctx.stroke();
          continue;
        }
        if (isActive) {
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.strokeStyle = mc([22, 38, 51, 0.45], [6, 20, 16, 0.55]);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.globalAlpha = 0.35 + 0.65 * rv;
        ctx.beginPath();
        ctx.arc(x, y, isActive ? 4.5 : 3.4, 0, Math.PI * 2);
        ctx.fillStyle = mc([22, 38, 51], [6, 20, 16]);
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = mc([247, 246, 242, 0.95], [200, 218, 216, 0.9]);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Label (reached cities only), with collision avoidance — active wins
        if (rv < 0.5) continue;
        const off = JOURNEY_LABEL_OFFSETS[locations[k].id] || { dx: 13, dy: -11, align: 'left' as CanvasTextAlign };
        ctx.font = isActive ? '14px "Tenor Sans", sans-serif' : '11.5px "JetBrains Mono", monospace';
        const label = isActive ? locations[k].city.toUpperCase() : locations[k].city;
        const tw = isActive ? activeLabelWidths[k] : inactiveLabelWidths[k];
        let align: CanvasTextAlign = off.align;
        if (align === 'left' && x + off.dx + tw > W - 6) align = 'right';
        else if (align === 'right' && x + off.dx - tw < 6) align = 'left';
        const dx = align === off.align ? off.dx : -off.dx;
        const lx = x + dx;
        const ly = y + off.dy;
        const box = {
          x0: align === 'right' ? lx - tw - 3 : lx - 3,
          x1: align === 'right' ? lx + 3 : lx + tw + 3,
          y0: ly - 14,
          y1: ly + 6
        };
        if (!isActive && placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) continue;
        placed.push(box);
        ctx.textAlign = align;
        ctx.textBaseline = 'alphabetic';
        ctx.lineWidth = 4;
        ctx.strokeStyle = mc([245, 243, 238, 0.92], [168, 190, 188, 0.88]);
        ctx.strokeText(label, lx, ly);
        ctx.fillStyle = isActive ? mc([22, 38, 51], [4, 16, 13]) : mc([43, 53, 59], [14, 32, 28]);
        ctx.fillText(label, lx, ly);
      }

      // Single 1:1 device-pixel blit to DOM canvas (zero DOM style/font access)
      domCtx.setTransform(1, 0, 0, 1, 0, 0);
      domCtx.clearRect(0, 0, canvas.width, canvas.height);
      domCtx.drawImage(offCanvas, 0, 0);
    };

    // ---- Apply one state everywhere (canvas + imperative DOM + React milestone) ----
    const cityStopEls: HTMLElement[][] = locations.map((loc) =>
      Array.from(stage.querySelectorAll<HTMLElement>(`[data-journey-city="${loc.id}"]`))
    );
    const lastCityOpacities = new Float32Array(locations.length).fill(-1);
    let lastActive = Math.max(0, locations.findIndex((l) => l.id === activeIdRef.current));

    const apply = (st: JourneyState) => {
      draw(st);
      if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${st.p.toFixed(4)})`;
      for (let idx = 0; idx < cityStopEls.length; idx++) {
        const op = 0.4 + st.reveal[idx] * 0.6;
        if (Math.abs(op - lastCityOpacities[idx]) > 0.008) {
          lastCityOpacities[idx] = op;
          const opStr = op.toFixed(3);
          const els = cityStopEls[idx];
          for (let j = 0; j < els.length; j++) els[j].style.opacity = opStr;
        }
      }
      if (!prefersReduced && st.active !== lastActive) {
        lastActive = st.active;
        setActiveId(locations[st.active].id);
      }
    };

    let raf = 0;
    const frame = () => {
      raf = 0;
      apply(prefersReduced ? reducedState() : stateAt(measureProgress()));
    };
    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      if (globeInView && !raf) raf = requestAnimationFrame(frame);
    };
    requestRenderRef.current = requestRender;

    const globeIo =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) {
                globeInView = entry.isIntersecting;
              }
              if (globeInView) {
                resize();
                requestRender();
              }
            },
            { rootMargin: '260px 0px 260px 0px', threshold: 0 }
          )
        : null;
    if (globeIo) globeIo.observe(runway || stage);

    // Travel to a city = scroll the page to the middle of that city's dwell
    goToCityRef.current = (id: string) => {
      const idx = locations.findIndex((l) => l.id === id);
      if (idx < 0) return;
      if (prefersReduced) {
        setActiveId(id);
        return;
      }
      const dwell = segs.find((s) => s.kind === 'dwell' && s.i === idx);
      const g = progressGeometry();
      if (!dwell || !g) return;
      const p = (dwell.start + dwell.end) / 2;
      const targetTop = g.stickyTop - p * g.travel;
      window.scrollTo({ top: window.scrollY + (g.top - targetTop), behavior: 'smooth' });
    };

    const onResize = () => {
      resize();
      requestRender();
    };
    resize();
    requestRender();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    // Labels use the editorial web fonts: re-measure & redraw once they are ready
    document.fonts?.ready
      .then(() => {
        if (!disposed) {
          measureCityLabels();
          resize();
          requestRender();
        }
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      if (globeIo) globeIo.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      requestRenderRef.current = () => {};
      goToCityRef.current = (id) => setActiveId(id);
    };
  }, [locations, segs]);

  // Reduced motion: the active city changes by selection only — redraw the static view
  useEffect(() => {
    requestRenderRef.current();
  }, [activeId]);

  const activeIdx = Math.max(0, locations.findIndex((l) => l.id === activeId));

  return (
    <div ref={stageRef} className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full block" />

      {/* Subtle water-matched veil softens whale glyphs directly behind the destination caption */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            'radial-gradient(ellipse 34% 42% at 18% 50%, rgba(var(--abyss-wash), 0.42) 0%, rgba(var(--abyss-wash), 0.18) 62%, rgba(var(--abyss-wash), 0) 100%)'
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] md:hidden"
        style={{
          background:
            'linear-gradient(0deg, rgba(var(--abyss-wash), 0.52) 0%, rgba(var(--abyss-wash), 0.28) 65%, rgba(var(--abyss-wash), 0) 100%)'
        }}
      />

      {/* Current destination — all 7 captions pre-mounted in a grid stack (zero DOM childList mutations on city change) */}
      <div
        className="grid items-center absolute left-5 right-5 bottom-24 md:right-auto md:left-[6vw] md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-[min(28vw,440px)]"
        aria-live="polite"
      >
        {locations.map((city, cIdx) => {
          const isCityActive = cIdx === activeIdx;
          return (
            <div
              key={city.id}
              aria-hidden={!isCityActive}
              style={{
                visibility: isCityActive ? 'visible' : 'hidden',
                pointerEvents: isCityActive ? 'auto' : 'none'
              }}
              className={`col-start-1 row-start-1 ${isCityActive ? 'globe-caption-in' : 'opacity-0'}`}
            >
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#3E4C52]">
                <BioWords text={`${String(cIdx + 1).padStart(2, '0')} / ${String(locations.length).padStart(2, '0')}`} />
              </p>
              <h3 className="mt-2 font-arch text-[38px] md:text-[54px] lg:text-[62px] leading-[1.02] tracking-[-0.02em] text-[#162633]">
                <BioWords text={city.city} />
              </h3>
              {city.country && city.country !== city.city && (
                <p className="mt-2.5 font-mono text-xs md:text-[13px] uppercase tracking-[0.16em] text-[#3E4C52]">
                  <BioWords text={city.country} />
                </p>
              )}
              <p className="mt-3 font-mono text-lg md:text-[22px] leading-none tracking-[0.06em] text-[#1F3B57]">
                <BioWords text={city.period} />
              </p>
            </div>
          );
        })}
      </div>


    </div>
  );
});

interface AsciiWhaleBackgroundProps {
  mode: 'ambient' | 'focus' | 'off';
}

const AsciiWhaleBackground: React.FC<AsciiWhaleBackgroundProps> = React.memo(({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0.5, y: 0.5, active: false });
  const scrollMotionRef = useRef<{
    targetScrollY: number;
    smoothScrollY: number;
    prevSmoothScrollY: number;
    velocity: number;
    direction: 1 | -1; // 1 = down (vers le bas), -1 = up (vers le haut)
    dirBlend: number;  // continuous -1..+1 vertical orientation blend (zero 1-frame snap)
    activity: number;  // smooth 0..1 scroll activity envelope
    idleSide: 1 | -1;  // horizontal orientation when idle
  }>({
    targetScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    smoothScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    prevSmoothScrollY: typeof window !== 'undefined' ? window.scrollY : 0,
    velocity: 0,
    direction: 1,
    dirBlend: 1,
    activity: 0,
    idleSide: 1
  });

  useEffect(() => {
    if (mode === 'off') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let time = 0;
    let lastFrameTime = performance.now();

    const cellSize = 10;
    const oceanCell = 16;
    const isFocus = mode === 'focus';
    const masterAlpha = isFocus ? 0.96 : 0.32;

    // Ordered density glyphs for the mosaic ASCII tiles & generative ocean surface
    const GLYPHS = ['.', ':', '-', '=', '+', '*', 'x', '#', '%', '8', '@', 'M', 'W'];
    const NUM_GLYPHS = GLYPHS.length;
    const OCEAN_GLYPHS = ['·', '.', ':', '-', '~', '=', '+', '*', '#', '@'];
    const NUM_OCEAN_GLYPHS = OCEAN_GLYPHS.length;

    // ------------------------------------------------------------------------
    // 1. PRE-BAKED SPRITE ATLAS FOR WHALE MOSAIC TILES, HALO & OCEAN SHADER GLYPHS
    // ------------------------------------------------------------------------
    // Rows 0..4: Oceanic-integrated whale mosaic tiles
    // In ambient mode, use translucent paper-slate wash tones (never pitch-black blocks)
    // so dark website text floating above is always 100% crisp and readable.
    const atlasScale = Math.min(window.devicePixelRatio || 1, 2);
    const tilePx = cellSize * atlasScale;
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = NUM_GLYPHS * tilePx;
    // Rows 0..9: legacy whale, halo & ocean tiers. Rows 10..14: whale deep-blue palette.
    // Rows 15..17: fish school ink (glyph only). Row 18: open-mouth interior (baleen).
    // Rows 19..21: abyss ocean tiers — pale teal / blue-grey / forest-green glyphs for dark water.
    atlasCanvas.height = 22 * tilePx;
    const aCtx = atlasCanvas.getContext('2d');

    if (aCtx) {
      aCtx.scale(atlasScale, atlasScale);
      aCtx.font = 'bold 8.5px "JetBrains Mono", monospace';
      aCtx.textAlign = 'center';
      aCtx.textBaseline = 'middle';

      const tilePad = 1.1;
      const tileSize = cellSize - tilePad;

      // Restrained oceanic-editorial palette
      // Focus mode: deep midnight contrast
      // Ambient mode: soft luminous aquatic slate wash (guarantees zero dark-on-dark text clashes)
      const styles = isFocus
        ? [
            { r: 182, g: 198, b: 198, a: masterAlpha * 0.4, lightText: false },  // Ventral sea-light
            { r: 112, g: 132, b: 142, a: masterAlpha * 0.54, lightText: false }, // Blue-gray
            { r: 60, g: 80, b: 94, a: masterAlpha * 0.68, lightText: true },     // Slate midtone
            { r: 34, g: 50, b: 64, a: masterAlpha * 0.76, lightText: true },     // Midnight blue-slate
            { r: 18, g: 26, b: 33, a: masterAlpha * 0.9, lightText: true }       // Abyssal dorsal
          ]
        : [
            { r: 210, g: 220, b: 222, a: masterAlpha * 0.35, lightText: false }, // Soft sea-mist
            { r: 188, g: 200, b: 205, a: masterAlpha * 0.48, lightText: false }, // Blue-gray wash
            { r: 162, g: 178, b: 184, a: masterAlpha * 0.60, lightText: false }, // Oceanic slate tint
            { r: 140, g: 156, b: 164, a: masterAlpha * 0.70, lightText: false }, // Deeper slate tint
            { r: 118, g: 136, b: 144, a: masterAlpha * 0.80, lightText: false }  // Muted dorsal tone (never pitch black)
          ];

      for (let sIdx = 0; sIdx < styles.length; sIdx++) {
        const st = styles[sIdx];
        const py = sIdx * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(${st.r}, ${st.g}, ${st.b}, ${st.a.toFixed(3)})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);

          if (st.lightText) {
            aCtx.fillStyle = `rgba(242, 245, 245, ${Math.min(1, st.a * 0.96).toFixed(3)})`;
          } else {
            aCtx.fillStyle = isFocus
              ? `rgba(20, 32, 42, ${Math.min(1, st.a * 1.18).toFixed(3)})`
              : `rgba(32, 48, 56, ${Math.min(0.68, st.a * 1.05).toFixed(3)})`;
          }
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Row 5: Halo border stamps (0: '.', 1: ':', 2: '+')
      const haloChars = ['.', ':', '+'];
      const haloAlphas = isFocus
        ? [masterAlpha * 0.16, masterAlpha * 0.26, masterAlpha * 0.38]
        : [masterAlpha * 0.12, masterAlpha * 0.20, masterAlpha * 0.28];
      const pyHalo = 5 * cellSize;
      for (let hIdx = 0; hIdx < 3; hIdx++) {
        const px = hIdx * cellSize;
        const ha = haloAlphas[hIdx];
        if (hIdx >= 1) {
          aCtx.fillStyle = `rgba(138, 156, 162, ${(ha * 0.38).toFixed(3)})`;
          aCtx.fillRect(px + 1.5, pyHalo + 1.5, cellSize - 3, cellSize - 3);
        }
        aCtx.fillStyle = `rgba(34, 52, 62, ${(ha * 0.85).toFixed(3)})`;
        aCtx.fillText(haloChars[hIdx], px + cellSize * 0.5, pyHalo + cellSize * 0.5 + 0.5);
      }

      // Rows 6..9: Pure typographic ocean shader characters (living typographic water)
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const oceanTiers = [
        { row: 6, r: 78, g: 122, b: 128, baseA: isFocus ? 0.52 : 0.24 }, // Muted turquoise sunbeam crest
        { row: 7, r: 54, g: 78, b: 94, baseA: isFocus ? 0.46 : 0.20 },   // Desaturated blue-gray current
        { row: 8, r: 38, g: 58, b: 70, baseA: isFocus ? 0.48 : 0.18 },   // Soft blue-slate swell (never dark black)
        { row: 9, r: 68, g: 82, b: 88, baseA: isFocus ? 0.26 : 0.12 }    // Restrained deep-dossier current
      ];
      for (let tIdx = 0; tIdx < oceanTiers.length; tIdx++) {
        const tier = oceanTiers[tIdx];
        const py = tier.row * cellSize;
        for (let gIdx = 0; gIdx < NUM_OCEAN_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          const densityAlpha = tier.baseA * (0.42 + (gIdx / (NUM_OCEAN_GLYPHS - 1)) * 0.58);
          aCtx.fillStyle = `rgba(${tier.r}, ${tier.g}, ${tier.b}, ${densityAlpha.toFixed(3)})`;
          aCtx.fillText(OCEAN_GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Rows 10..14: WHALES — deep ocean-blue palette (ventral → dorsal), shared by both whales.
      // Tile fills stop at a mid-tone slate blue so that dark page text crossing the whale keeps
      // roughly 5:1 contrast; the dark navy glyphs carry the anatomy and make the silhouette read
      // instantly against the off-white paper.
      aCtx.font = 'bold 8.5px "JetBrains Mono", monospace';
      const mainWhaleStyles = [
        { fill: [176, 192, 204], fillA: 0.5, ink: [34, 56, 78], inkA: 0.58 },  // Ventral sea-light
        { fill: [138, 160, 178], fillA: 0.56, ink: [28, 48, 70], inkA: 0.7 },  // Blue-grey flank
        { fill: [100, 126, 150], fillA: 0.6, ink: [20, 40, 62], inkA: 0.82 },  // Slate blue
        { fill: [72, 100, 128], fillA: 0.62, ink: [14, 32, 54], inkA: 0.88 },  // Deep slate navy
        { fill: [52, 78, 104], fillA: 0.64, ink: [10, 26, 46], inkA: 0.92 }    // Dorsal navy
      ];
      for (let sIdx = 0; sIdx < mainWhaleStyles.length; sIdx++) {
        const st = mainWhaleStyles[sIdx];
        const py = (10 + sIdx) * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(${st.fill[0]}, ${st.fill[1]}, ${st.fill[2]}, ${st.fillA})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
          aCtx.fillStyle = `rgba(${st.ink[0]}, ${st.ink[1]}, ${st.ink[2]}, ${st.inkA})`;
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Rows 15..17: FISH SCHOOL — bold ocean-blue ink on a faint blue-grey wash, so a school
      // stands out clearly from the paler ocean texture while staying lighter than the whale.
      aCtx.font = 'bold 9.5px "JetBrains Mono", monospace';
      const fishInks = [
        { c: [30, 54, 80], a: 0.66, wash: 0.1 },
        { c: [20, 42, 68], a: 0.86, wash: 0.18 },
        { c: [12, 32, 56], a: 1.0, wash: 0.26 }
      ];
      for (let tIdx = 0; tIdx < fishInks.length; tIdx++) {
        const ink = fishInks[tIdx];
        const py = (15 + tIdx) * cellSize;
        for (let gIdx = 0; gIdx < NUM_GLYPHS; gIdx++) {
          const px = gIdx * cellSize;
          aCtx.fillStyle = `rgba(140, 164, 184, ${ink.wash})`;
          aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
          aCtx.fillStyle = `rgba(${ink.c[0]}, ${ink.c[1]}, ${ink.c[2]}, ${ink.a})`;
          aCtx.fillText(GLYPHS[gIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }

      // Row 18: OPEN MOUTH INTERIOR — deep navy cavity with pale baleen-like fringe strokes
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const BALEEN = ['|', '!', ':', "'"];
      for (let bIdx = 0; bIdx < BALEEN.length; bIdx++) {
        const px = bIdx * cellSize;
        const py = 18 * cellSize;
        aCtx.fillStyle = 'rgba(20, 34, 52, 0.86)';
        aCtx.fillRect(px + tilePad * 0.5, py + tilePad * 0.5, tileSize, tileSize);
        aCtx.fillStyle = 'rgba(176, 194, 208, 0.78)';
        aCtx.fillText(BALEEN[bIdx], px + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
      }

      // Rows 19..21: ABYSS OCEAN — pale, desaturated glyphs that read on near-black water
      aCtx.font = '500 9px "JetBrains Mono", monospace';
      const abyssTiers = [
        { row: 19, r: 122, g: 166, b: 156, baseA: 0.34 }, // Desaturated teal crest
        { row: 20, r: 146, g: 164, b: 172, baseA: 0.28 }, // Muted blue-grey current
        { row: 21, r: 88, g: 130, b: 108, baseA: 0.36 }   // Deep forest-green swell
      ];
      for (const tier of abyssTiers) {
        const py = tier.row * cellSize;
        for (let gIdx = 0; gIdx < NUM_OCEAN_GLYPHS; gIdx++) {
          const densityAlpha = tier.baseA * (0.42 + (gIdx / (NUM_OCEAN_GLYPHS - 1)) * 0.58);
          aCtx.fillStyle = `rgba(${tier.r}, ${tier.g}, ${tier.b}, ${densityAlpha.toFixed(3)})`;
          aCtx.fillText(OCEAN_GLYPHS[gIdx], gIdx * cellSize + cellSize * 0.5, py + cellSize * 0.5 + 0.5);
        }
      }
    }

    // Offscreen static dot-grid canvas + quarter-res atmospheric water backdrop canvas
    const bgGridCanvas = document.createElement('canvas');
    const waterBackdropCanvas = document.createElement('canvas');
    const waterBackdropCtx = waterBackdropCanvas.getContext('2d');
    let backdropW = 0;
    let backdropH = 0;
    let lastBackdropDepth = -999;
    let backdropValid = false;

    // Pre-allocated Reusable Grid Buffers (zero GC allocations during animation!)
    let gridCols = 0;
    let gridRows = 0;
    let oceanCols = 0;
    let oceanRows = 0;
    let zBuf = new Float32Array(0);
    let lumBuf = new Float32Array(0);
    let toneBuf = new Float32Array(0);
    let occBuf = new Uint8Array(0);
    let haloBuf = new Uint8Array(0);
    // Fish school density raster (same cell grid as the whale) + list of touched cells
    let fishBuf = new Float32Array(0);
    let fishTouched = new Int32Array(0);

    // Pre-allocated 1D separable harmonic tables for the generative ocean shader (zero trig in inner loop)
    let colSin1 = new Float32Array(0);
    let colCos1 = new Float32Array(0);
    let colSin2 = new Float32Array(0);
    let colCos2 = new Float32Array(0);
    let colLight = new Float32Array(0);
    let rowSin1 = new Float32Array(0);
    let rowCos1 = new Float32Array(0);
    let rowSin2 = new Float32Array(0);
    let rowCos2 = new Float32Array(0);
    let rowDepth = new Float32Array(0);
    // Depth descent (Stage 5): finer third harmonic that emerges with depth + reading-column profile
    let colSin3 = new Float32Array(0);
    let colCos3 = new Float32Array(0);
    let rowSin3 = new Float32Array(0);
    let rowCos3 = new Float32Array(0);
    let colReading = new Float32Array(0);
    // Cached viewport & scrollable document geometry (updated on resize / ResizeObserver, zero layout reads in RAF)
    let viewW = typeof window !== 'undefined' ? window.innerWidth : 1440;
    let viewH = typeof window !== 'undefined' ? window.innerHeight : 900;
    let docScrollable = 1;
    let lastInkMix = -1;
    let lastWashAbyss = -1;

    // Precomputed LUT for Humpback Whale Body Half-Width (256 samples)
    const LUT_SIZE = 256;
    const BODY_WIDTH_LUT = new Float32Array(LUT_SIZE);
    for (let i = 0; i < LUT_SIZE; i++) {
      const u = i / (LUT_SIZE - 1);
      if (u < 0.18) {
        const t = u / 0.18;
        BODY_WIDTH_LUT[i] = 0.185 * Math.pow(Math.sin(t * Math.PI * 0.5), 0.58);
      } else if (u < 0.36) {
        const t = (u - 0.18) / 0.18;
        BODY_WIDTH_LUT[i] = 0.185 + 0.025 * Math.sin(t * Math.PI);
      } else if (u < 0.84) {
        const t = (u - 0.36) / 0.48;
        BODY_WIDTH_LUT[i] = 0.022 + 0.163 * Math.pow(Math.cos(t * Math.PI * 0.5), 1.45);
      } else {
        const t = (u - 0.84) / 0.16;
        BODY_WIDTH_LUT[i] = 0.022 * (1 - t * 0.65);
      }
    }
    const getBodyHalfWidthFast = (u: number): number => {
      const idx = Math.max(0, Math.min(LUT_SIZE - 1, (u * (LUT_SIZE - 1)) | 0));
      return BODY_WIDTH_LUT[idx];
    };

    interface WakeParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      maxAge: number;
      size: number;
      kind: 'vortex' | 'bubble';
    }
    const wakeParticles: WakeParticle[] = [];

    interface WhaleAgent {
      x: number;
      y: number;
      heading: number;
      turnRate: number;
      baseSpeed: number;
      scale: number;
      swimCycle: number;
      CycleSpeed: number;
      finCycle: number;
      smoothSwimRate: number;
      smoothWaveAmp: number;
      spineX: Float32Array;
      spineY: Float32Array;
      spineAngle: Float32Array;
      initialized: boolean;
    }

    const SPINE_NODES = 64;
    const createWhaleAgent = (scale: number, cycleOffset: number): WhaleAgent => ({
      x: 0,
      y: 0,
      heading: Math.PI * 0.5,
      turnRate: 0,
      baseSpeed: 1.55 * scale,
      scale,
      swimCycle: cycleOffset,
      CycleSpeed: 0.055 / Math.pow(scale, 0.35),
      finCycle: cycleOffset * 0.7,
      smoothSwimRate: 0.16,
      smoothWaveAmp: 0.024,
      spineX: new Float32Array(SPINE_NODES),
      spineY: new Float32Array(SPINE_NODES),
      spineAngle: new Float32Array(SPINE_NODES),
      initialized: false
    });

    const whales: WhaleAgent[] = [
      createWhaleAgent(1.0, 0),
      createWhaleAgent(0.58, 3.4)
    ];

    // Lightweight drifting ambient ASCII points (precomputed relative offsets)
    const ambientDots = Array.from({ length: 85 }, (_, idx) => ({
      nx: ((idx * 41 + 13) % 100) / 100,
      ny: ((idx * 67 + 29) % 100) / 100,
      speedX: ((idx % 2 === 0 ? 1 : -1) * (0.002 + (idx % 3) * 0.001)),
      glyphIdx: idx % 3 // 0: '.', 1: ':', 2: '+'
    }));
    let ambientOffsetY = 0;

    // Pre-allocated 1D Ocean Surface Wave LUT (12px horizontal spacing, zero inner-loop trig)
    const SURF_STEP = 12;
    let surfaceLut = new Float32Array(0);
    let surfaceLutLen = 0;

    // Anatomical ASCII jellyfish (3 species, 3 parallax depth planes) and the ASCII fishing boat.
    // Both are rendered by this component's single RAF loop through pre-baked glyph atlases
    // (see asciiOceanLife.ts) — no extra loop, no per-glyph fillText, no shadowBlur.
    const jellyfishField = createAsciiJellyfishField(atlasScale);
    const fishingBoat = createAsciiFishingBoat(atlasScale);
    let oceanLifeDisposed = false;
    // Re-bake glyph atlases once the web font is ready (first bake may use the fallback face)
    if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (oceanLifeDisposed) return;
        jellyfishField.rebake();
        fishingBoat.rebake();
      });
    }
    (window as unknown as Record<string, unknown>).__oceanLife = {
      jellyfish: jellyfishField.stats,
      boat: fishingBoat.state,
      fishNow: fishingBoat.forceFishing
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewW = w;
      viewH = h;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      gridCols = Math.ceil(w / cellSize);
      gridRows = Math.ceil(h / cellSize);
      oceanCols = Math.ceil(w / oceanCell);
      oceanRows = Math.ceil(h / oceanCell);

      const total = gridCols * gridRows;
      zBuf = new Float32Array(total).fill(-999);
      lumBuf = new Float32Array(total);
      toneBuf = new Float32Array(total);
      occBuf = new Uint8Array(total);
      haloBuf = new Uint8Array(total);
      fishBuf = new Float32Array(total);
      fishTouched = new Int32Array(total);

      colSin1 = new Float32Array(oceanCols);
      colCos1 = new Float32Array(oceanCols);
      colSin2 = new Float32Array(oceanCols);
      colCos2 = new Float32Array(oceanCols);
      colLight = new Float32Array(oceanCols);
      rowSin1 = new Float32Array(oceanRows);
      rowCos1 = new Float32Array(oceanRows);
      rowSin2 = new Float32Array(oceanRows);
      rowCos2 = new Float32Array(oceanRows);
      rowDepth = new Float32Array(oceanRows);
      colSin3 = new Float32Array(oceanCols);
      colCos3 = new Float32Array(oceanCols);
      rowSin3 = new Float32Array(oceanRows);
      rowCos3 = new Float32Array(oceanRows);
      // Reading-column profile: the central text column stays calmer, margins carry the texture
      colReading = new Float32Array(oceanCols);
      for (let oc = 0; oc < oceanCols; oc++) {
        const nx = oc / Math.max(1, oceanCols);
        const t = Math.max(0, Math.min(1, (Math.abs(nx - 0.46) - 0.16) / 0.24));
        colReading[oc] = 0.7 + 0.3 * (t * t * (3 - 2 * t));
      }
      docScrollable = Math.max(1, document.documentElement.scrollHeight - h);
      surfaceLutLen = Math.ceil(w / SURF_STEP) + 3;
      surfaceLut = new Float32Array(surfaceLutLen);

      // Pre-render subtle hydrographic dot matrix once on resize
      bgGridCanvas.width = w * dpr;
      bgGridCanvas.height = h * dpr;
      const bgCtx = bgGridCanvas.getContext('2d');
      if (bgCtx) {
        bgCtx.scale(dpr, dpr);
        bgCtx.fillStyle = isFocus ? 'rgba(22, 38, 51, 0.09)' : 'rgba(22, 38, 51, 0.042)';
        for (let r = 0; r < gridRows; r += 2) {
          const py = r * cellSize + cellSize * 0.5;
          for (let c = 0; c < gridCols; c += 2) {
            const px = c * cellSize + cellSize * 0.5;
            bgCtx.fillRect(px - 0.5, py - 0.5, 1, 1);
          }
        }
      }
      backdropW = Math.max(64, Math.ceil(w * 0.25));
      backdropH = Math.max(64, Math.ceil(h * 0.25));
      waterBackdropCanvas.width = backdropW;
      waterBackdropCanvas.height = backdropH;
      backdropValid = false;
    };

    handleResize();
    const layoutObserver = new ResizeObserver(handleResize);
    layoutObserver.observe(document.documentElement);
    const globeSection = document.getElementById('global');
    if (globeSection) layoutObserver.observe(globeSection);
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / Math.max(1, viewW);
      mouseRef.current.y = e.clientY / Math.max(1, viewH);
      mouseRef.current.active = true;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleScrollChange = () => {
      const currentY = window.scrollY;
      const dy = currentY - scrollMotionRef.current.targetScrollY;
      scrollMotionRef.current.targetScrollY = currentY;
      if (Math.abs(dy) > 0.25) {
        scrollMotionRef.current.direction = dy > 0 ? 1 : -1;
      }
    };

    const handleWheelDir = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 0.5) {
        scrollMotionRef.current.direction = e.deltaY > 0 ? 1 : -1;
      }
    };

    window.addEventListener('scroll', handleScrollChange, { passive: true });
    window.addEventListener('wheel', handleWheelDir, { passive: true });

    // ------------------------------------------------------------------------
    // AUTONOMOUS SWIMMING (main whale only)
    // ------------------------------------------------------------------------
    // Whenever the visitor is not scrolling, the main whale keeps swimming:
    // phases chain into one another with no idle gap —
    //   wander   → glides toward a random waypoint (most common), with gentle
    //              speed variation and an occasional brief pause
    //   cruise   → crosses the screen and leaves beyond the edge it faces
    //   offscreen→ short moment out of sight, then re-enters from the opposite side
    //   return   → swims back into view, then continues exploring
    //   drift    → brief slow glide
    // `weight` blends steering & speed between the existing scroll/idle controller
    // (0) and the autonomous controller (1). Scrolling drives `weight` to 0 within
    // ~250ms; autonomy resumes ~0.6s after scrolling stops.
    type AutoPhase = 'rest' | 'wander' | 'cruise' | 'offscreen' | 'return' | 'drift';
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    const auto = {
      phase: 'rest' as AutoPhase,
      weight: 0,
      idleSeconds: 0,
      phaseTime: 0,
      phaseDuration: 0,
      dir: 1 as 1 | -1,
      targetXFrac: 0.5,
      targetYFrac: 0.5,
      targetSpeed: 0,
      curSpeed: 0,
      speedPhase: Math.random() * 10,
      pauseAt: -1,
      pauseLeft: 0,
      driftAngle: 0,
      // Lane anchor offsets: captured when scrolling takes over so the scroll lane target
      // starts where the whale actually is and relaxes back gradually (no sliding jump).
      offX: 0,
      offY: 0
    };

    const handBackToScroll = (wh: WhaleAgent, laneX: number, laneY: number) => {
      auto.offX = wh.x - laneX;
      auto.offY = wh.y - laneY;
      auto.phase = 'rest';
      auto.pauseAt = -1;
      auto.pauseLeft = 0;
    };

    const getMinUnderwaterYFrac = (h: number, clearancePx = 110): number => {
      if (isFocus || h <= 0) return 0.18;
      const curSurfY = boatSurfaceY(viewW, h) - scrollMotionRef.current.smoothScrollY * 0.34;
      return Math.min(0.56, Math.max(0.18, (curSurfY + clearancePx) / h));
    };

    const startNextPhase = (wh: WhaleAgent, w: number, h: number) => {
      auto.phaseTime = 0;
      auto.pauseAt = -1;
      auto.pauseLeft = 0;
      const facing: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
      const minYFrac = getMinUnderwaterYFrac(h, Math.min(w, h) * 0.18);
      const r = Math.random();

      if (r < 0.24 && feed.state !== 'school') {
        // Cross the screen and leave through the edge the whale already faces
        // (never while a school is waiting — the encounter takes priority)
        auto.phase = 'cruise';
        auto.dir = facing;
        auto.targetYFrac = rand(Math.max(0.2, minYFrac), 0.82);
        auto.targetSpeed = rand(1.7, 2.5) * wh.scale;
      } else if (r < 0.32) {
        // Brief, slow glide
        auto.phase = 'drift';
        auto.phaseDuration = rand(1.4, 2.4);
        auto.targetSpeed = rand(0.25, 0.45) * wh.scale;
        auto.driftAngle = rand(-0.14, 0.14);
      } else {
        // Explore toward a waypoint, usually ahead so turns stay wide and natural
        auto.phase = 'wander';
        const xNow = wh.x / Math.max(1, w);
        const ahead = Math.random() < 0.78 ? facing : ((-facing) as 1 | -1);
        const lo = ahead > 0 ? Math.min(0.88, xNow + 0.22) : 0.12;
        const hi = ahead > 0 ? 0.88 : Math.max(0.12, xNow - 0.22);
        auto.targetXFrac = lo < hi ? rand(lo, hi) : rand(0.15, 0.85);
        auto.targetYFrac = rand(minYFrac, 0.84);
        auto.targetSpeed = rand(1.2, 2.2) * wh.scale;
        auto.phaseDuration = rand(7, 12); // safety timeout
        auto.pauseAt = Math.random() < 0.15 ? rand(1.5, 3.5) : -1;
      }
    };

    const placeWhaleOffscreen = (wh: WhaleAgent, w: number, h: number, segLen: number) => {
      // Whale is fully out of view here: re-seed the straight spine just outside the entry edge
      const headX = auto.dir > 0 ? -cellSize * 4 : w + cellSize * 4;
      const headY = h * auto.targetYFrac;
      const heading = auto.dir > 0 ? 0 : Math.PI;
      wh.x = headX;
      wh.y = headY;
      wh.heading = heading;
      wh.turnRate = 0;
      for (let k = 0; k < SPINE_NODES; k++) {
        wh.spineX[k] = headX - Math.cos(heading) * k * segLen;
        wh.spineY[k] = headY;
        wh.spineAngle[k] = heading;
      }
    };

    /**
     * Advances the autonomous phase machine and returns the steering contribution.
     * Returns null when the autonomous controller has no say this frame.
     */
    const stepAutonomy = (
      wh: WhaleAgent,
      w: number,
      h: number,
      bodyLenPx: number,
      segLen: number,
      dt: number,
      laneX: number,
      laneY: number
    ): { angle: number; speed: number } | null => {
      const sm = scrollMotionRef.current;
      const scrolling = sm.activity > 0.08;

      // Lane anchor offsets relax back to the real lane gently without rigid sideways yanks
      const relax = Math.exp(-dt / (scrolling ? 1.6 : 4.5));
      auto.offX *= relax;
      auto.offY *= relax;

      if (prefersReducedMotion) {
        auto.weight = 0;
        return null;
      }

      if (scrolling) {
        auto.idleSeconds = 0;
        if (auto.phase !== 'rest') handBackToScroll(wh, laneX, laneY);
        auto.weight = Math.max(0, auto.weight - dt * 4);
        auto.curSpeed *= Math.exp(-dt * 6);
        return auto.weight > 0.001 ? { angle: wh.heading, speed: auto.curSpeed } : null;
      }

      auto.idleSeconds += dt;
      auto.phaseTime += dt;
      auto.speedPhase += dt;

      if (auto.phase === 'rest' && auto.idleSeconds > 0.6) {
        startNextPhase(wh, w, h);
      }

      let angle = wh.heading;
      let speed = 0;
      // Organic speed breathing so cruising never feels mechanical
      const breathe = 1 + Math.sin(auto.speedPhase * 0.7) * 0.12 + Math.sin(auto.speedPhase * 0.23 + 1.3) * 0.08;

      if (auto.phase === 'wander') {
        if (auto.pauseAt > 0 && auto.phaseTime >= auto.pauseAt) {
          auto.pauseLeft = rand(0.9, 1.6);
          auto.pauseAt = -1;
        }
        const pausing = auto.pauseLeft > 0;
        if (pausing) auto.pauseLeft -= dt;

        const tx = w * auto.targetXFrac;
        const ty = h * auto.targetYFrac;
        const dx = tx - wh.x;
        const dy = ty - wh.y;
        const meander = Math.sin(time * 0.41 + auto.targetYFrac * 7) * 0.08;
        // Keep the body mostly horizontal: compress steep climbs/dives
        const rawAngle = Math.atan2(dy * 0.75, dx);
        angle = rawAngle + meander;
        speed = (pausing ? 0.22 * wh.scale : auto.targetSpeed) * breathe;

        const dist = Math.hypot(dx, dy);
        if (dist < Math.min(w, h) * 0.09 || auto.phaseTime > auto.phaseDuration) {
          startNextPhase(wh, w, h);
        }
      } else if (auto.phase === 'cruise' || auto.phase === 'return') {
        const dyErr = Math.max(-0.35, Math.min(0.35, ((h * auto.targetYFrac - wh.y) / h) * 1.4));
        const meander = Math.sin(time * 0.33 + auto.targetYFrac * 9) * 0.05;
        const pitch = dyErr + meander;
        angle = auto.dir > 0 ? pitch : Math.PI - pitch;
        speed = auto.targetSpeed * breathe;

        if (auto.phase === 'cruise') {
          // Fully past the exit edge (tail included)?
          const tailX = wh.spineX[SPINE_NODES - 1];
          const margin = bodyLenPx * 0.25;
          const exited = auto.dir > 0 ? tailX > w + margin : tailX < -margin;
          if (exited) {
            auto.phase = 'offscreen';
            auto.phaseTime = 0;
            auto.phaseDuration = rand(0.8, 2.2);
          }
        } else {
          // Back in view and clear of the entry edge: keep exploring
          const inside = auto.dir > 0 ? wh.x > w * 0.24 : wh.x < w * 0.76;
          if (inside) startNextPhase(wh, w, h);
        }
      } else if (auto.phase === 'offscreen') {
        speed = auto.curSpeed;
        if (auto.phaseTime >= auto.phaseDuration) {
          // Re-enter from the opposite side, continuing the same heading below the waterline
          auto.targetYFrac = rand(Math.max(0.24, getMinUnderwaterYFrac(h, bodyLenPx * 0.28)), 0.78);
          auto.targetSpeed = rand(1.5, 2.2) * wh.scale;
          auto.curSpeed = auto.targetSpeed;
          placeWhaleOffscreen(wh, w, h, segLen);
          auto.phase = 'return';
          auto.phaseTime = 0;
        }
        angle = wh.heading;
      } else if (auto.phase === 'drift') {
        const facing: 1 | -1 = Math.cos(wh.heading) >= 0 ? 1 : -1;
        angle = facing > 0 ? auto.driftAngle : Math.PI - auto.driftAngle;
        speed = auto.targetSpeed;
        if (auto.phaseTime >= auto.phaseDuration) startNextPhase(wh, w, h);
      }

      // Blend weight: ~1.2s ease in after scrolling stops
      const targetWeight = auto.phase === 'rest' ? 0 : 1;
      auto.weight += (targetWeight - auto.weight) * Math.min(1, dt * 1.7);
      if (auto.phase !== 'rest' && auto.weight > 0.995) auto.weight = 1;
      // Speed eases so departures, pauses and arrivals never jerk
      auto.curSpeed += (speed - auto.curSpeed) * Math.min(1, dt * 1.1);

      return auto.weight > 0.001 ? { angle, speed: auto.curSpeed } : null;
    };

    // ------------------------------------------------------------------------
    // FEEDING ENCOUNTER (main whale) — works while scrolling or idle
    // ------------------------------------------------------------------------
    // Every ~8–15s of browsing a small school of ASCII fish appears AHEAD of the
    // main whale's current trajectory. While scrolling, the scroll-linked whale
    // holds its screen band and "swims" against the scroll, so the fish drift with
    // the scrolled water toward its mouth; they also ease sideways toward the
    // whale's path. The whale's steering is only *biased* toward the school (never
    // overridden while scrolling). Within reach the jaws part briefly, nearby fish
    // are drawn in and vanish. If the encounter can't complete (direction reversed,
    // school scrolled away, timeout), the fish scatter and fade.
    interface FeedFish {
      ox: number; // home offset inside the elongated school
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      phase: number;
      face: 1 | -1; // facing, with hysteresis
      tier: 0 | 1 | 2; // depth: 0 far, 1 mid, 2 near (ink weight)
      state: 'swim' | 'eaten' | 'scatter';
      t: number;
    }
    // Depth weight per tier: far fish contribute faint ink, near fish denser ink
    const FISH_TIER_WEIGHT = [0.72, 0.9, 1.0];
    const feed = {
      state: 'idle' as 'idle' | 'school' | 'scatter',
      // First encounter: within ~3–6s of arrival, even while scrolling
      timer: prefersReducedMotion ? Infinity : rand(3, 5),
      firstDone: false,
      isFirst: false, // the current encounter is the first one (prioritised)
      // Later encounters: only after ~10s without scrolling, plus a small random delay
      idleForFeed: 0,
      extraDelay: rand(0.5, 4),
      age: 0,
      cx: 0,
      cy: 0,
      swimDir: 1 as 1 | -1,
      fish: [] as FeedFish[],
      mouthOpen: 0,
      gulp: 0, // throat pouch fullness after swallowing (0..1), deflates slowly
      eatenCount: 0,
      doneDelay: 0,
      lungeSeen: false,
      leaveTimer: 0
    };
    let mainBodyLen = 300;
    let lastSmoothScrollY = scrollMotionRef.current.smoothScrollY;
    // Deep-water silhouette (Stage 5): one distant manta ray at a time, only in deeper water
    const mantaRay = {
      active: false,
      wait: rand(6, 12),
      dir: 1 as 1 | -1,
      x: 0,
      baseY: 0,
      span: 100,
      speed: 0.7,
      phase: 0
    };

    // Approximate gaussian for natural school density (dense core, sparse edges)
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const spawnSchool = (headX: number, headY: number, hx: number, hy: number, w: number, h: number, scrolling: boolean) => {
      feed.isFirst = !feed.firstDone;
      // The first school appears closer and more centred on the whale's path so it is reached quickly
      const ahead = mainBodyLen * (feed.isFirst ? rand(0.75, 1.05) : rand(1.0, 1.55));
      const side = (feed.isFirst ? rand(-0.1, 0.1) : rand(-0.2, 0.2)) * mainBodyLen;
      let cx = headX + hx * ahead - hy * side;
      let cy = headY + hy * ahead + hx * side;
      // While scrolling the school may start just beyond the edge and drift into view with the water
      const edgeAllowance = feed.isFirst ? 0.1 : 0.22;
      cx = Math.max(w * 0.12, Math.min(w * 0.88, cx));
      cy = scrolling
        ? Math.max(-h * edgeAllowance, Math.min(h * (1 + edgeAllowance), cy))
        : Math.max(h * 0.16, Math.min(h * 0.84, cy));
      feed.cx = cx;
      feed.cy = cy;
      feed.swimDir = Math.random() < 0.5 ? 1 : -1;
      feed.age = 0;
      feed.eatenCount = 0;
      feed.doneDelay = 0;
      feed.lungeSeen = false;
      feed.leaveTimer = 0;

      // Large bait school: elongated along the swimming direction, dense core
      const count = Math.round(rand(46, 72) * (w < 640 ? 0.6 : 1));
      const spanX = rand(70, 105);
      const spanY = rand(22, 34);
      feed.fish = [];
      for (let i = 0; i < count; i++) {
        const ox = gauss() * spanX;
        const oy = gauss() * spanY + ox * rand(-0.08, 0.08);
        const tierRoll = Math.random();
        const tier: 0 | 1 | 2 = tierRoll < 0.34 ? 0 : tierRoll < 0.78 ? 1 : 2;
        feed.fish.push({
          ox,
          oy,
          x: cx + ox,
          y: cy + oy,
          vx: feed.swimDir * rand(0.7, 1.1),
          vy: rand(-0.15, 0.15),
          alpha: 0,
          phase: Math.random() * Math.PI * 2,
          face: feed.swimDir,
          tier,
          state: 'swim',
          t: 0
        });
      }
      feed.state = 'school';
    };

    const scatterSchool = () => {
      for (const f of feed.fish) {
        if (f.state !== 'swim') continue;
        const ang = Math.atan2(f.y - feed.cy, f.x - feed.cx) + rand(-0.4, 0.4);
        const sp = rand(1.6, 2.6);
        f.vx = Math.cos(ang) * sp;
        f.vy = Math.sin(ang) * sp * 0.6;
        f.state = 'scatter';
        f.t = rand(-0.4, 0); // staggered fade so the school thins out progressively
      }
      feed.state = 'scatter';
    };

    const updateWhaleKinematics = (
      wh: WhaleAgent,
      w: number,
      h: number,
      bodyLenPx: number,
      idx: number,
      dtScale: number,
      entryCalm: number,
      rawDepth: number
    ) => {
      const segLen = bodyLenPx / (SPINE_NODES - 1);
      const sm = scrollMotionRef.current;

      if (!wh.initialized) {
        // Opening screen placement: calm distant presence in open water, safely below the surface waterline
        wh.x = idx === 0 ? w * 0.64 : w * 0.24;
        wh.y = idx === 0 ? h * 0.70 : h * 0.36;
        wh.heading = idx === 0 ? -0.08 : 0.14;
        for (let k = 0; k < SPINE_NODES; k++) {
          wh.spineX[k] = wh.x - Math.cos(wh.heading) * k * segLen;
          wh.spineY[k] = wh.y - Math.sin(wh.heading) * k * segLen;
          wh.spineAngle[k] = wh.heading;
        }
        wh.initialized = true;
      }

      const scrollSpeedPx = Math.abs(sm.velocity);
      const motionScale = prefersReducedMotion ? 0.22 : 1.0;

      // Understated, slow fluid swimming on the opening screen; smooth organic acceleration during scroll (zero frantic thrashing)
      const baseIdleSwim = 0.14 + (1 - entryCalm) * 0.05;
      const targetSwimRate =
        (baseIdleSwim + sm.activity * Math.min(0.76, 0.26 + scrollSpeedPx * 0.028)) * motionScale;
      wh.smoothSwimRate += (targetSwimRate - wh.smoothSwimRate) * Math.min(1, 0.16 * dtScale);
      const swimStep = wh.smoothSwimRate * dtScale;
      wh.swimCycle += wh.CycleSpeed * swimStep;
      wh.finCycle += wh.CycleSpeed * 0.56 * swimStep;

      const sProg = rawDepth;
      const rawLaneCenterX =
        idx === 0
          ? w * (0.58 - (1 - entryCalm) * 0.06) + Math.sin(sProg * Math.PI * 2.4 + time * 0.1) * (w * 0.22)
          : w * (0.26 + (1 - entryCalm) * 0.08) + Math.cos(sProg * Math.PI * 2.0 + 1.2 + time * 0.085) * (w * 0.2);

      // On the opening screen (entryCalm ~ 1), keep Whale 0 in the lower water column and Whale 1 comfortably below the surface waterline
      const entryScreenY = idx === 0 ? h * 0.70 : h * 0.36;
      const dossierScreenY =
        idx === 0
          ? h * (0.3 + sProg * 0.42)
          : h * (0.24 + (1 - sProg * 0.5) * 0.46);
      const rawScrollLinkedScreenY =
        entryScreenY * entryCalm + dossierScreenY * (1 - entryCalm);

      // Autonomous controller (main whale only) — blended through `autoW`
      const autoStep =
        idx === 0
          ? stepAutonomy(wh, w, h, bodyLenPx, segLen, dtScale / 60, rawLaneCenterX, rawScrollLinkedScreenY)
          : null;
      const autoW = autoStep ? auto.weight : 0;

      // Feeding bias: a soft pull toward the school, only when it lies ahead and within reach.
      // While scrolling it is capped low so the scroll direction always dominates.
      let feedPull = 0;
      let feedDirX = 0;
      let feedDirY = 0;
      if (idx === 0 && feed.state === 'school') {
        const fdx = feed.cx - wh.x;
        const fdy = feed.cy - wh.y;
        const fd = Math.hypot(fdx, fdy);
        if (fd > 1) {
          feedDirX = fdx / fd;
          feedDirY = fdy / fd;
          const aheadDot = feedDirX * Math.cos(wh.heading) + feedDirY * Math.sin(wh.heading);
          const prox = Math.max(0, 1 - fd / (bodyLenPx * (feed.isFirst ? 3.0 : 2.2)));
          const scrollingNow = sm.activity > 0.08;
          if (!scrollingNow || aheadDot > -0.15) {
            // The first encounter is prioritised (stronger bias), scroll still dominates
            feedPull = (scrollingNow ? (feed.isFirst ? 0.45 : 0.3) : feed.isFirst ? 0.9 : 0.8) * prox;
          }
        }
      }

      const laneCenterX =
        rawLaneCenterX +
        (idx === 0 ? auto.offX : 0) +
        (feedPull > 0 ? (feed.cx - rawLaneCenterX) * feedPull * 0.6 : 0);
      const scrollLinkedScreenY = rawScrollLinkedScreenY + (idx === 0 ? auto.offY : 0);

      if (autoStep) {
        // Tail beat follows cruising speed
        const cruiseBeat = autoW * Math.min(1.4, autoStep.speed * 0.5) * dtScale * motionScale;
        wh.swimCycle += wh.CycleSpeed * cruiseBeat;
        wh.finCycle += wh.CycleSpeed * 0.56 * cruiseBeat;
      }

      const cosCurr = Math.cos(wh.heading);
      const horizontalError = Math.max(-0.35, Math.min(0.35, ((laneCenterX - wh.x) / Math.max(300, w)) * 1.1));
      const downH = Math.PI * 0.5 - horizontalError;
      const upH = -Math.PI * 0.5 + horizontalError;
      const downW = (sm.dirBlend + 1) * 0.5;
      const upW = 1 - downW;
      const bridgeX = (cosCurr >= 0 ? 1 : -1) * (1 - Math.abs(sm.dirBlend)) * 0.45;
      const verticalScrollHeading = Math.atan2(
        downW * Math.sin(downH) + upW * Math.sin(upH),
        downW * Math.cos(downH) + upW * Math.cos(upH) + bridgeX
      );

      const idleHorizontalHeading =
        cosCurr >= 0
          ? Math.sin(time * 0.28 + idx) * 0.11
          : Math.PI - Math.sin(time * 0.28 + idx) * 0.11;

      const activeWeight = Math.pow(sm.activity, 0.65);
      let targetVecX =
        (1 - activeWeight) * Math.cos(idleHorizontalHeading) +
        activeWeight * Math.cos(verticalScrollHeading);
      let targetVecY =
        (1 - activeWeight) * Math.sin(idleHorizontalHeading) +
        activeWeight * Math.sin(verticalScrollHeading);
      if (autoStep) {
        targetVecX = targetVecX * (1 - autoW) + Math.cos(autoStep.angle) * autoW;
        targetVecY = targetVecY * (1 - autoW) + Math.sin(autoStep.angle) * autoW;
      }
      if (feedPull > 0.001) {
        targetVecX = targetVecX * (1 - feedPull) + feedDirX * feedPull;
        targetVecY = targetVecY * (1 - feedPull) + feedDirY * feedPull;
      }
      const desiredAngle = Math.atan2(targetVecY, targetVecX);

      let angleDiff = desiredAngle - wh.heading;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

      // Smooth critically-damped reorientation without abrupt snaps
      const maxTurn = (0.056 + sm.activity * 0.092 - autoW * 0.024) * dtScale;
      const targetTurn = Math.max(-maxTurn, Math.min(maxTurn, angleDiff * (0.13 + sm.activity * 0.16) * dtScale));
      wh.turnRate += (targetTurn - wh.turnRate) * Math.min(1, 0.26 * dtScale);

      const headYawWave = Math.sin(wh.swimCycle) * (0.0018 + sm.activity * 0.0024 + autoW * 0.0015) * dtScale * motionScale;
      wh.heading += wh.turnRate + headYawWave;

      const pivotBoostPx = Math.abs(angleDiff) * sm.activity * 2.1 * wh.scale;
      const idleDriftPx = (0.13 + (1 - entryCalm) * 0.05) * wh.scale * motionScale;
      const scrollSwimPx = Math.min(8.5, scrollSpeedPx * 0.38 + pivotBoostPx) * wh.scale;
      let stepPx = (idleDriftPx * (1 - sm.activity * 0.5) + scrollSwimPx) * dtScale;
      if (autoStep) {
        stepPx = stepPx * (1 - autoW) + autoStep.speed * dtScale * autoW;
      }

      wh.x += Math.cos(wh.heading) * stepPx;
      wh.y += Math.sin(wh.heading) * stepPx;

      wh.spineX[0] = wh.x;
      wh.spineY[0] = wh.y;
      wh.spineAngle[0] = wh.heading;

      const alignRate = Math.min(0.54, (0.15 + sm.activity * 0.18) * dtScale);
      const targetWaveAmp = (0.022 + sm.activity * 0.036 + autoW * 0.022) * motionScale;
      wh.smoothWaveAmp += (targetWaveAmp - wh.smoothWaveAmp) * Math.min(1, 0.14 * dtScale);
      const waveAmp = wh.smoothWaveAmp;

      for (let k = 1; k < SPINE_NODES; k++) {
        const u = k / (SPINE_NODES - 1);
        const dx = wh.spineX[k - 1] - wh.spineX[k];
        const dy = wh.spineY[k - 1] - wh.spineY[k];
        let segAngle = Math.atan2(dy, dx);

        let alignDiff = wh.spineAngle[k - 1] - segAngle;
        while (alignDiff > Math.PI) alignDiff -= Math.PI * 2;
        while (alignDiff < -Math.PI) alignDiff += Math.PI * 2;
        segAngle += alignDiff * alignRate;

        const waveEnvelope = u < 0.22 ? u * 0.15 : 0.033 + Math.pow((u - 0.22) / 0.78, 1.75) * 0.44;
        const muscularWave = Math.sin(wh.swimCycle - u * 4.8) * waveEnvelope * waveAmp;
        segAngle += muscularWave;

        let diff = segAngle - wh.spineAngle[k - 1];
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const maxBend = 0.12;
        if (diff > maxBend) segAngle = wh.spineAngle[k - 1] + maxBend;
        if (diff < -maxBend) segAngle = wh.spineAngle[k - 1] - maxBend;

        wh.spineAngle[k] = segAngle;
        wh.spineX[k] = wh.spineX[k - 1] - Math.cos(segAngle) * segLen;
        wh.spineY[k] = wh.spineY[k - 1] - Math.sin(segAngle) * segLen;
      }

      // Lane springs yield entirely to the autonomous controller while it is in charge, clamped for graceful drift
      const springScale = 1 - autoW;
      const maxPullY = 4.6 * dtScale;
      const maxPullX = 3.0 * dtScale;
      const rawPullY = (scrollLinkedScreenY - wh.y) * Math.min(1, 0.032 * dtScale) * springScale;
      const rawPullX = (laneCenterX - wh.x) * Math.min(1, 0.018 * dtScale) * springScale;
      const pullY = Math.max(-maxPullY, Math.min(maxPullY, rawPullY));
      const pullX = Math.max(-maxPullX, Math.min(maxPullX, rawPullX));

      wh.x += pullX;
      wh.y += pullY;
      for (let k = 0; k < SPINE_NODES; k++) {
        wh.spineX[k] += pullX;
        wh.spineY[k] += pullY;
      }

      // Soft underwater ceiling beneath the ocean surface waterline so whales never breach into the air
      if (!isFocus) {
        const curSurfY = boatSurfaceY(w, h) - sm.smoothScrollY * 0.34;
        const minWhaleY = curSurfY + bodyLenPx * 0.25;
        if (wh.y < minWhaleY) {
          const pushDown = (minWhaleY - wh.y) * Math.min(1, 0.18 * dtScale);
          wh.y += pushDown;
          for (let k = 0; k < SPINE_NODES; k++) {
            wh.spineY[k] += pushDown;
          }
          if (Math.sin(wh.heading) < 0) {
            wh.heading += (Math.cos(wh.heading) >= 0 ? 1 : -1) * 0.025 * dtScale;
          }
        }
      }
    };

    // Fast linear interpolation along the 1D ocean surface wave LUT
    const sampleSurfaceY = (x: number): number => {
      if (surfaceLutLen === 0) return -999;
      const fx = Math.max(0, Math.min(surfaceLutLen - 1.001, x / SURF_STEP));
      const i0 = fx | 0;
      const frac = fx - i0;
      return surfaceLut[i0] + (surfaceLut[i0 + 1] - surfaceLut[i0]) * frac;
    };

    const populateSurfaceLut = (w: number, surfaceBaseY: number) => {
      const need = Math.ceil(w / SURF_STEP) + 3;
      if (surfaceLut.length < need) {
        surfaceLut = new Float32Array(need);
      }
      surfaceLutLen = need;
      const waveAmp = prefersReducedMotion ? 0.18 : 1.0;
      for (let i = 0; i < need; i++) {
        const x = i * SURF_STEP;
        surfaceLut[i] =
          surfaceBaseY +
          (Math.sin(x * 0.0046 + time * 0.52) * 3.1 +
            Math.sin(x * 0.0112 - time * 0.78 + 1.3) * 1.35 +
            Math.sin(x * 0.026 + time * 1.16) * 0.45) *
            waveAmp;
      }
    };

    // ------------------------------------------------------------------------
    // ASCII OCEAN SURFACE WATERLINE & MINIMALIST TERMINAL ART SHIP
    // ------------------------------------------------------------------------
    // Renders the ocean surface: clear horizontal ASCII wave waterline boundary,
    // warm bright surface sky world, and a refined terminal ASCII ship floating on the surface.
    const renderSurfaceBoundaryAndShip = (w: number, h: number, surfaceBaseY: number) => {
      if (isFocus || surfaceBaseY < -h * 0.35 || surfaceLutLen < 2) return;

      // A sparse three-row band follows the same sampled surface as the hull.
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
          ctx.fillStyle = `rgba(38, 70, 86, ${((0.16 - row * 0.035) * breath).toFixed(3)})`;
          ctx.fillText(waveChars[(i + row * 2) % waveChars.length], wx, wy);
        }
      }
      ctx.restore();

      // 3. ASCII fishing boat: pre-composed mosaic hull/deck/wheelhouse, animated gantry,
      //    line or net, catch, foam and reflection — anchored to the sampled waterline
      fishingBoat.render(ctx, w, h, time, surfaceBaseY, prefersReducedMotion, sampleSurfaceY);
    };

    // ------------------------------------------------------------------------
    // ASCII BIOLUMINESCENT JELLYFISH (anatomical, multi-species — see asciiOceanLife.ts)
    // ------------------------------------------------------------------------
    // Each creature is evaluated per character cell as a translucent bell with radial canals,
    // gonads / segmented stomach, luminous scalloped margin, oral arms and trailing tentacles.
    // Far & mid planes draw behind the whales, the foreground plane in front of them.
    const renderJellyfishPlanes = (
      w: number,
      h: number,
      rawDepth: number,
      abyss: number,
      surfaceBaseY: number,
      minTier: number,
      maxTier: number
    ) => {
      if (isFocus) return;
      jellyfishField.render(
        ctx,
        w,
        h,
        time,
        scrollMotionRef.current.smoothScrollY,
        rawDepth,
        abyss,
        surfaceBaseY,
        prefersReducedMotion,
        minTier,
        maxTier
      );
    };

    // Dirty bounding box of occupied cells from previous frame
    let prevMinC = 0;
    let prevMaxC = 0;
    let prevMinR = 0;
    let prevMaxR = 0;

    const render = (now: number) => {
      const rawDt = (now - lastFrameTime) * 0.001;
      lastFrameTime = now;
      const dt = Math.max(0.004, Math.min(0.033, rawDt || 0.0166));
      const dtScale = dt * 60;

      time += prefersReducedMotion ? dt * 0.15 : dt;

      const sm = scrollMotionRef.current;
      const curScrollY = window.scrollY;
      sm.targetScrollY = curScrollY;

      const w = viewW;
      const h = viewH;

      sm.prevSmoothScrollY = sm.smoothScrollY;
      const scrollDiff = sm.targetScrollY - sm.smoothScrollY;
      if (prefersReducedMotion) {
        sm.smoothScrollY = sm.targetScrollY;
      } else {
        const alphaY = 1 - Math.exp(-dt * 16);
        sm.smoothScrollY += scrollDiff * alphaY;
      }

      // Smooth frame-rate-independent scroll speed (px per 60Hz frame), eliminating wheel-notch surges & 1-frame snaps
      const frameScrollStep = (sm.smoothScrollY - sm.prevSmoothScrollY) / Math.max(0.25, dtScale);
      sm.velocity += (frameScrollStep - sm.velocity) * (1 - Math.exp(-dt * 18));

      const speedMag = Math.abs(sm.velocity);
      if (speedMag > 0.18) {
        sm.direction = sm.velocity > 0 ? 1 : -1;
        const targetAct = Math.min(1, 0.35 + speedMag * 0.048);
        const actRate = targetAct > sm.activity ? 8.5 : 3.2;
        sm.activity += (targetAct - sm.activity) * (1 - Math.exp(-dt * actRate));
      } else {
        sm.activity *= Math.exp(-dt * 3.0);
        if (sm.activity < 0.004) sm.activity = 0;
      }
      sm.dirBlend += (sm.direction - sm.dirBlend) * (1 - Math.exp(-dt * 9.0));

      ctx.clearRect(0, 0, w, h);

      // Continuous ocean immersion factor: 1.0 on the entry screen, easing smoothly into restrained ambient currents in CV sections
      const scrollViewports = h > 0 ? sm.smoothScrollY / h : 0;
      const entryCalm = Math.max(0, Math.min(1, 1 - scrollViewports / 1.85));

      // Preserve overall page progress for creature movement and ocean texture.
      const rawDepth = Math.max(0, Math.min(1, sm.smoothScrollY / docScrollable));
      const depth = rawDepth;
      // Linear scroll-driven surface waterline: clearly visible near top at scroll=0, recedes immediately on scroll
      const surfaceBaseY = isFocus ? -999 : boatSurfaceY(w, h) - sm.smoothScrollY * 0.34;
      if (!isFocus && surfaceBaseY > -h * 0.35) {
        populateSurfaceLut(w, surfaceBaseY);
      }
      // Actual scroll (not the lagging creature position) guarantees white on upward return.
      const abyss = isFocus ? 0 : abyssFromProgress(globeScrollProgress());
      const oceanPresence = isFocus ? 0.88 : 0.4 + depth * 0.46;
      const surfaceLight = isFocus ? 0.6 : (1 - depth) * (1 - abyss);

      // Text, rules and panels follow the same value (the ink flips where the water is mid-tone)
      const inkMixS = isFocus ? 0 : inkMixFromAbyss(abyss);
      const inkEndpoint =
        (inkMixS === 0 && lastInkMix !== 0) || (inkMixS === 1 && lastInkMix !== 1);
      if (Math.abs(inkMixS - lastInkMix) > 0.015 || inkEndpoint) {
        lastInkMix = inkMixS;
        applyAbyssPalette(inkMixS);
      }
      if (!isFocus && abyss !== lastWashAbyss) {
        lastWashAbyss = abyss;
        applyAbyssWash(abyss);
      }

      // Reuse the cached backdrop and animation loop for an exact neutral background.
      if (waterBackdropCtx && (!backdropValid || abyss !== lastBackdropDepth)) {
        const shade = Math.round(255 * (1 - abyss));
        waterBackdropCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`;
        waterBackdropCtx.fillRect(0, 0, backdropW, backdropH);
        lastBackdropDepth = abyss;
        backdropValid = true;
      }
      if (backdropValid) ctx.drawImage(waterBackdropCanvas, 0, 0, w, h);

      const cols = gridCols;
      const rows = gridRows;

      // 1B. Draw pre-rendered static hydrographic dot grid in 1 drawImage call
      ctx.drawImage(bgGridCanvas, 0, 0, w, h);

      // 2. Generative ASCII Ocean Shader (Separable Harmonics: 0 inner-loop trig calls, 0 random flicker)
      const oCols = oceanCols;
      const oRows = oceanRows;
      const descentShift = sm.smoothScrollY * 0.0024;
      const tSlow = time * 0.42;
      const mxOffset = mouseRef.current.active ? (mouseRef.current.x - 0.5) * 0.35 : 0;

      for (let oc = 0; oc < oCols; oc++) {
        const nx = oc / Math.max(1, oCols);
        const a1 = nx * 5.2 + tSlow + mxOffset;
        const a2 = nx * 2.7 - tSlow * 0.68;
        const a3 = nx * 13.5 + tSlow * 0.37;
        colSin1[oc] = Math.sin(a1);
        colCos1[oc] = Math.cos(a1);
        colSin2[oc] = Math.sin(a2);
        colCos2[oc] = Math.cos(a2);
        colSin3[oc] = Math.sin(a3);
        colCos3[oc] = Math.cos(a3);
        // Volumetric light shaft bands across horizontal span
        const shaft = Math.sin(nx * 9.5 - time * 0.19) * 0.5 + 0.5;
        colLight[oc] = shaft * shaft;
      }

      for (let or = 0; or < oRows; or++) {
        const ny = or / Math.max(1, oRows);
        const worldY = ny + descentShift;
        const b1 = worldY * 4.4 - tSlow * 0.52;
        const b2 = worldY * 7.8 + tSlow * 0.31;
        const b3 = worldY * 15.5 - tSlow * 0.23;
        rowSin1[or] = Math.sin(b1);
        rowCos1[or] = Math.cos(b1);
        rowSin2[or] = Math.sin(b2);
        rowCos2[or] = Math.cos(b2);
        rowSin3[or] = Math.sin(b3);
        rowCos3[or] = Math.cos(b3);
        // Surface light attenuation with depth (screen row) and with page depth
        rowDepth[or] = Math.max(0.12, 1 - ny * 0.78) * (0.35 + 0.65 * surfaceLight);
      }

      // Density rises with depth; the finer third harmonic adds intricacy deeper down
      const densityCutoff = 0.62 - oceanPresence * 0.34;
      const invSpan = 1 / Math.max(0.15, 1 - densityCutoff);
      const fineAmt = depth * 0.16;
      const inDossier = entryCalm <= 0.2;
      // Light crests belong to the surface; deeper water turns slate
      const crestThreshold = 0.38 + depth * 0.5;

      const minOceanRow =
        !isFocus && surfaceBaseY > 0 ? Math.max(0, Math.floor((surfaceBaseY - 4) / oceanCell)) : 0;
      for (let or = minOceanRow; or < oRows; or++) {
        const rs1 = rowSin1[or];
        const rc1 = rowCos1[or];
        const rs2 = rowSin2[or];
        const rc2 = rowCos2[or];
        const rs3 = rowSin3[or];
        const rc3 = rowCos3[or];
        const depthLight = rowDepth[or];
        const ny = or / Math.max(1, oRows);
        const py = or * oceanCell;

        // Gentle calm clearing around center of initial screen so conceptual typography breathes effortlessly
        const dyCenter = ny - 0.47;
        const centerRowFactor = entryCalm > 0.2 ? dyCenter * dyCenter : 1;

        for (let oc = 0; oc < oCols; oc++) {
          // sin(a1 + b1) = sin(a1)cos(b1) + cos(a1)sin(b1)
          const swellPrimary = colSin1[oc] * rc1 + colCos1[oc] * rs1;
          // cos(a2 - b2) = cos(a2)cos(b2) + sin(a2)sin(b2)
          const currentStream = colCos2[oc] * rc2 + colSin2[oc] * rs2;
          const sunbeam = colLight[oc] * depthLight;

          let waveVal = swellPrimary * 0.34 + currentStream * 0.24 + sunbeam * 0.32 + 0.36;
          if (fineAmt > 0.002) {
            // sin(a3 + b3): fine ripples that only emerge at depth
            waveVal += (colSin3[oc] * rc3 + colCos3[oc] * rs3) * fineAmt;
          }

          if (entryCalm > 0.2) {
            const dxCenter = oc / Math.max(1, oCols) - 0.5;
            const distSq = dxCenter * dxCenter * 0.9 + centerRowFactor * 2.2;
            if (distSq < 0.14) {
              waveVal *= 0.58 + (distSq / 0.14) * 0.42;
            }
          } else if (inDossier) {
            // CV sections: keep the reading column calmer than the margins
            waveVal *= colReading[oc];
          }

          // Fade character density into the sampled horizon instead of a rectangular cutoff.
          const surfaceDistance = isFocus ? 100 : py - sampleSurfaceY(oc * oceanCell);
          if (surfaceBaseY > -h * 0.35 && surfaceDistance < 0) continue;
          const horizonT = Math.max(0, Math.min(1, surfaceDistance / (oceanCell * 3)));
          const horizonOpacity = horizonT * horizonT * (3 - 2 * horizonT);
          if (waveVal > densityCutoff) {
            ctx.globalAlpha = horizonOpacity;
            const norm = Math.min(0.999, (waveVal - densityCutoff) * invSpan);
            const gIdx = (norm * NUM_OCEAN_GLYPHS) | 0;

            let oceanRow = 9;
            if (entryCalm > 0.12 || isFocus || depth > 0.08) {
              if (sunbeam > crestThreshold && ny < 0.62) {
                oceanRow = 6; // Filtered muted-turquoise light crest (surface)
              } else if (norm > 0.56 - depth * 0.2) {
                oceanRow = 8; // Deep blue-slate swell (more frequent deeper)
              } else {
                oceanRow = 7; // Desaturated blue-gray current
              }
            }
            if (abyss > 0.004) {
              // Stable per-cell dither: cells progressively swap to the pale abyss tiers
              const hsh = ((((oc * 73856093) ^ (or * 19349663)) >>> 0) % 1024) / 1024;
              if (hsh < abyss) oceanRow = oceanRow === 6 ? 19 : oceanRow === 8 ? 21 : 20;
            }

            ctx.drawImage(
              atlasCanvas,
              gIdx * tilePx,
              oceanRow * tilePx,
              tilePx,
              tilePx,
              oc * oceanCell,
              py,
              cellSize,
              cellSize
            );
          }
        }
      }

      ctx.globalAlpha = 1;

      // 2B. Subtle drifting deep-water particles (restrained count, zero flicker)
      ambientOffsetY = (ambientOffsetY - sm.velocity * 0.00038 * dtScale + 10) % 1;
      const dotLimit = prefersReducedMotion ? 24 : 48;
      for (let i = 0; i < dotLimit; i++) {
        const d = ambientDots[i];
        const cx = (((d.nx + time * d.speedX * 0.65 + 10) % 1) * cols) | 0;
        const cy = (((d.ny + ambientOffsetY + 10) % 1) * rows) | 0;
        const inAbyss = abyss > 0.004 && ((i * 37) % 100) / 100 < abyss;
        ctx.drawImage(
          atlasCanvas,
          (inAbyss ? d.glyphIdx + 1 : d.glyphIdx) * tilePx,
          (inAbyss ? 20 : 5) * tilePx,
          tilePx,
          tilePx,
          cx * cellSize,
          cy * cellSize,
          cellSize,
          cellSize
        );
      }

      // 2C. DEEP-WATER SILHOUETTE (Stage 5): a distant manta ray glides past now and then,
      // only once the visitor has descended, drawn in the faintest halo glyphs ('.' ':')
      const rayVis = isFocus || prefersReducedMotion ? 0 : Math.max(0, Math.min(1, (depth - 0.35) / 0.25));
      if (!mantaRay.active) {
        mantaRay.wait -= dt;
        if (mantaRay.wait <= 0 && rayVis > 0.25) {
          mantaRay.active = true;
          mantaRay.dir = Math.random() < 0.5 ? 1 : -1;
          mantaRay.span = Math.min(w, h) * rand(0.11, 0.15);
          mantaRay.x = mantaRay.dir > 0 ? -mantaRay.span * 2.2 : w + mantaRay.span * 2.2;
          mantaRay.baseY = h * (Math.random() < 0.5 ? rand(0.16, 0.3) : rand(0.68, 0.82));
          mantaRay.speed = rand(0.55, 0.85);
          mantaRay.phase = Math.random() * 6.28;
        }
      }
      if (mantaRay.active) {
        mantaRay.x += mantaRay.dir * mantaRay.speed * dtScale;
        const S = mantaRay.span;
        const L = S * 0.85;
        const rx = mantaRay.x;
        const ry = mantaRay.baseY + Math.sin(time * 0.35 + mantaRay.phase) * h * 0.02;
        const flap = 0.82 + 0.18 * Math.sin(time * 1.4 + mantaRay.phase);
        const offscreen = mantaRay.dir > 0 ? rx - L * 2 > w : rx + L * 2 < 0;
        if (offscreen) {
          mantaRay.active = false;
          mantaRay.wait = rand(16, 32);
        } else if (rayVis > 0.01) {
          ctx.globalAlpha = 0.55 * rayVis;
          const c0 = Math.max(0, ((rx - L * 2) / cellSize) | 0);
          const c1 = Math.min(cols - 1, ((rx + L * 1.2) / cellSize) | 0);
          const r0 = Math.max(0, ((ry - S) / cellSize) | 0);
          const r1 = Math.min(rows - 1, ((ry + S) / cellSize) | 0);
          for (let rr = r0; rr <= r1; rr++) {
            const l = (rr * cellSize + cellSize * 0.5 - ry) / S;
            for (let cc = c0; cc <= c1; cc++) {
              const f = ((cc * cellSize + cellSize * 0.5 - rx) * mantaRay.dir) / L; // -1 tail … 1 head
              let stamp = -1;
              if (f > -0.9 && f < 1) {
                // Diamond-like wing planform with a rounded leading edge
                const hs = Math.pow(Math.max(0, 1 - Math.abs(f - 0.12) / 0.92), 0.75) * flap;
                const al = Math.abs(l);
                if (al < hs) stamp = al < hs * 0.55 ? 1 : 0;
              } else if (f <= -0.9 && f > -1.7 && Math.abs(l) < 0.035) {
                stamp = 0; // thin tail
              }
              if (stamp >= 0) {
                // Dark halo glyphs in light water, pale teal glyphs ('.' ':') in the abyss
                if (abyss > 0.5) {
                  ctx.drawImage(atlasCanvas, (stamp + 1) * tilePx, 19 * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
                } else {
                  ctx.drawImage(atlasCanvas, stamp * tilePx, 5 * tilePx, tilePx, tilePx, cc * cellSize, rr * cellSize, cellSize, cellSize);
                }
              }
            }
          }
          ctx.globalAlpha = 1;
        }
      }

      // 2D. DEEP-OCEAN BIOLUMINESCENT JELLYFISH — Far & Mid depth planes (behind the whales)
      renderJellyfishPlanes(w, h, rawDepth, abyss, surfaceBaseY, 0, 1);

      // 3. Clear only the dirty bounding box in our pre-allocated buffers
      for (let r = prevMinR; r <= prevMaxR; r++) {
        const rowOffset = r * cols;
        for (let c = prevMinC; c <= prevMaxC; c++) {
          const idx = rowOffset + c;
          zBuf[idx] = -999;
          occBuf[idx] = 0;
          haloBuf[idx] = 0;
        }
      }

      let curMinC = cols - 1;
      let curMaxC = 0;
      let curMinR = rows - 1;
      let curMaxR = 0;
      let currentWhaleLayer = 1;

      // Fast squared-distance splat into pre-allocated buffers
      const splatPoint = (
        wx: number,
        wy: number,
        zHeight: number,
        shade: number,
        tone: number,
        radiusPx: number
      ) => {
        const reach = radiusPx + cellSize * 0.52;
        const reachSq = reach * reach;
        const minC = Math.max(1, ((wx - reach) / cellSize) | 0);
        const maxC = Math.min(cols - 2, ((wx + reach) / cellSize) | 0);
        const minR = Math.max(1, ((wy - reach) / cellSize) | 0);
        const maxR = Math.min(rows - 2, ((wy + reach) / cellSize) | 0);

        if (minC < curMinC) curMinC = minC;
        if (maxC > curMaxC) curMaxC = maxC;
        if (minR < curMinR) curMinR = minR;
        if (maxR > curMaxR) curMaxR = maxR;

        for (let rr = minR; rr <= maxR; rr++) {
          const dy = rr * cellSize + cellSize * 0.5 - wy;
          const dySq = dy * dy;
          const rowOff = rr * cols;
          for (let cc = minC; cc <= maxC; cc++) {
            const dx = cc * cellSize + cellSize * 0.5 - wx;
            if (dx * dx + dySq <= reachSq) {
              const idx = rowOff + cc;
              if (zHeight > zBuf[idx]) {
                zBuf[idx] = zHeight;
                lumBuf[idx] = shade;
                toneBuf[idx] = tone;
                occBuf[idx] = currentWhaleLayer;
              }
            }
          }
        }
      };

      // 4. Update & Rasterize Each Whale (distant understated scale on entry screen, natural presence in depth)
      const entryDistanceScale = 1 - entryCalm * 0.16;
      for (let wIdx = 0; wIdx < whales.length; wIdx++) {
        currentWhaleLayer = wIdx + 1;
        const wh = whales[wIdx];
        // Whales grow slightly more present as the visitor descends (up to +10%)
        const baseLen =
          Math.min(w, h) * (isFocus ? 0.66 : 0.58 * entryDistanceScale) * wh.scale * (1 + depth * 0.1);
        if (wIdx === 0) mainBodyLen = baseLen;

        updateWhaleKinematics(wh, w, h, baseLen, wIdx, dtScale, entryCalm, rawDepth);

        const rollAngle = Math.max(-0.52, Math.min(0.52, wh.turnRate * 26 + Math.sin(wh.finCycle) * 0.14));
        const sinRoll = Math.sin(rollAngle);
        const cosRoll = Math.cos(rollAngle);

        const sampleSpine = (u: number) => {
          const f = u * (SPINE_NODES - 1);
          const i0 = f | 0;
          const i1 = i0 < SPINE_NODES - 1 ? i0 + 1 : i0;
          const frac = f - i0;
          const sx = wh.spineX[i0] + (wh.spineX[i1] - wh.spineX[i0]) * frac;
          const sy = wh.spineY[i0] + (wh.spineY[i1] - wh.spineY[i0]) * frac;

          let da = wh.spineAngle[i1] - wh.spineAngle[i0];
          while (da > Math.PI) da -= Math.PI * 2;
          while (da < -Math.PI) da += Math.PI * 2;
          const ang = wh.spineAngle[i0] + da * frac;
          const cosA = Math.cos(ang);
          const sinA = Math.sin(ang);

          return {
            x: sx,
            y: sy,
            ang,
            tx: cosA,
            ty: sinA,
            nx: -sinA,
            ny: cosA
          };
        };

        const lightDirX = -0.55;
        const lightDirY = -0.65;
        const lightDirZ = 0.52;

        // A. MAIN BODY
        const uBodySteps = 78;
        for (let iu = 0; iu <= uBodySteps; iu++) {
          const u = iu / uBodySteps;
          const sp = sampleSpine(u);
          let halfW = getBodyHalfWidthFast(u) * baseLen;
          const verticalWave = Math.cos(wh.swimCycle - u * 4.5) * (0.04 + u * 0.08) * baseLen;

          // FEEDING ANATOMY (main whale): jaws swing apart from the tip, throat pleats balloon
          const mouthAmt = wIdx === 0 ? feed.mouthOpen : 0;
          if (wIdx === 0 && (mouthAmt > 0.01 || feed.gulp > 0.01)) {
            const throat = Math.exp(-((u - 0.27) * (u - 0.27)) / 0.012);
            halfW *= 1 + (mouthAmt * 0.22 + feed.gulp * 0.32) * throat;
          }
          const JAW_LEN = 0.24;
          const jawT = mouthAmt > 0.01 && u < JAW_LEN ? Math.pow(1 - u / JAW_LEN, 1.15) : 0;
          // Half-distance between the parted jaws at this station
          const gapePx = jawT * mouthAmt * baseLen * 0.085;
          if (gapePx > 0) halfW = Math.max(halfW, baseLen * 0.03); // jaws keep some thickness at the tip

          const latSteps = Math.max(6, Math.ceil((halfW * 2) / (cellSize * 0.58)));
          for (let il = 0; il <= latSteps; il++) {
            const localY = (il / latSteps) * 2 - 1;
            const localZ = Math.sqrt(Math.max(0, 1 - localY * localY));

            const rolledLat = localY * cosRoll - localZ * sinRoll * 0.35;
            const rolledZ = localY * sinRoll + localZ * cosRoll;

            // Each half of the head becomes a jaw, displaced outward by the gape
            const jawOffset = gapePx > 0 ? (localY >= 0 ? 1 : -1) * gapePx : 0;

            const wx = sp.x + sp.nx * (rolledLat * halfW + jawOffset);
            const wy = sp.y + sp.ny * (rolledLat * halfW + jawOffset) - verticalWave * 0.25;

            const worldNX = sp.nx * rolledLat;
            const worldNY = sp.ny * rolledLat;
            const worldNZ = Math.max(0.1, rolledZ);
            const diffuse = Math.max(0, worldNX * lightDirX + worldNY * lightDirY + worldNZ * lightDirZ);

            let anatomyShade = 0.68;
            let tone = 0.55;

            if (u < 0.16) {
              const isJawEdge = Math.abs(localY) > 0.72;
              anatomyShade = isJawEdge ? 0.32 : 0.78;
              tone = isJawEdge ? 0.2 : 0.75;
            } else if (u > 0.15 && u < 0.19 && Math.abs(localY) < 0.18) {
              anatomyShade = 0.95;
              tone = 0.95;
            } else if (u > 0.58 && u < 0.70 && Math.abs(localY) < 0.22) {
              anatomyShade = 0.94;
              tone = 0.92;
            } else if (Math.abs(localY) < 0.24) {
              anatomyShade = 0.84;
              tone = 0.85;
            } else if (localY * sinRoll > 0.25 && u > 0.12 && u < 0.52) {
              const pleat = Math.sin(localY * 26) * 0.5 + 0.5;
              anatomyShade = 0.25 + pleat * 0.35;
              tone = 0.18;
            }

            // Pale lip line along the inner edge of each parted jaw
            if (gapePx > cellSize * 0.2 && Math.abs(localY) < 0.28) {
              anatomyShade = 0.16;
              tone = 0.12;
            }

            const caustic = Math.sin(wx * 0.045 + time * 2.8) * Math.cos(wy * 0.045 - time * 2.2) * 0.11;
            const finalShade = Math.max(
              0.08,
              Math.min(0.98, anatomyShade * 0.65 + (1 - diffuse) * 0.42 + caustic)
            );

            splatPoint(
              wx,
              wy,
              10 + rolledZ * 3 + (1 - wIdx) * 5,
              finalShade,
              tone,
              cellSize * 0.42
            );
          }

          // Open-mouth interior between the jaws: deep navy cavity with baleen fringe (tone flag 2)
          if (gapePx > cellSize * 0.3) {
            const inner = gapePx * 0.9;
            const cavSteps = Math.max(2, Math.ceil((inner * 2) / (cellSize * 0.55)));
            for (let ic = 0; ic <= cavSteps; ic++) {
              const off = (ic / cavSteps) * 2 * inner - inner;
              splatPoint(
                sp.x + sp.nx * off,
                sp.y + sp.ny * off - verticalWave * 0.25,
                8.5,
                0.97,
                2,
                cellSize * 0.4
              );
            }
          }
        }

        // B. LONG SCALLOPED PECTORAL FINS
        const finRootSp = sampleSpine(0.26);
        const finLength = baseLen * 0.36;
        const finSpanSteps = 34;

        for (const side of [-1, 1]) {
          const strokeBase = Math.sin(wh.finCycle + (side === 1 ? 0 : 0.15));
          const turnExtend = 1 + side * wh.turnRate * 14;
          const bankForeshorten = Math.max(0.45, Math.min(1.18, 1 + side * sinRoll * 0.38));

          const rootOffset = getBodyHalfWidthFast(0.26) * baseLen * 0.82;
          const rootX = finRootSp.x + finRootSp.nx * side * rootOffset;
          const rootY = finRootSp.y + finRootSp.ny * side * rootOffset;

          for (let is = 0; is <= finSpanSteps; is++) {
            const s = is / finSpanSteps;
            const dynamicSweep =
              0.52 + strokeBase * 0.24 + Math.pow(s, 1.5) * (0.28 - Math.cos(wh.finCycle) * 0.18);

            const finAng = finRootSp.ang + side * (Math.PI * 0.5 + dynamicSweep);
            const dist = s * finLength * bankForeshorten * Math.max(0.7, Math.min(1.25, turnExtend));

            const tipCurveBack = s * s * baseLen * 0.08;
            const cosFA = Math.cos(finAng);
            const sinFA = Math.sin(finAng);
            const fCenterX = rootX + cosFA * dist - finRootSp.tx * tipCurveBack;
            const fCenterY = rootY + sinFA * dist - finRootSp.ty * tipCurveBack;

            const tubercleBump = Math.sin(s * Math.PI * 8.5) * 0.08 * (1 - s * 0.4);
            const chordWidth =
              baseLen * 0.088 * Math.sin(Math.pow(s, 0.42) * Math.PI) * (1 + tubercleBump);

            const chordSteps = Math.max(4, Math.ceil(chordWidth / (cellSize * 0.52)));
            const fPerpX = -sinFA * side;
            const fPerpY = cosFA * side;

            for (let ic = 0; ic <= chordSteps; ic++) {
              const cNorm = ic / chordSteps;
              const offset = (cNorm - 0.35) * chordWidth;
              const wx = fCenterX - fPerpX * offset;
              const wy = fCenterY - fPerpY * offset;

              const isLeadingOrTip = cNorm < 0.32 || s > 0.76;
              const finShade = isLeadingOrTip
                ? 0.18 + cNorm * 0.25
                : 0.62 + Math.sin(s * 6 + cNorm * 4) * 0.15;
              const finTone = isLeadingOrTip ? 0.12 : 0.65;

              const finZ = 9.5 + Math.sin(wh.finCycle - s) * 1.5 + (1 - wIdx) * 5;
              splatPoint(wx, wy, finZ, finShade, finTone, cellSize * 0.38);
            }
          }
        }

        // C. BUTTERFLY TAIL FLUKES
        const flukeRootSp = sampleSpine(0.92);
        const flukeSpan = baseLen * 0.29;
        const flukeSteps = 28;

        const flukeWhipAngle = Math.cos(wh.swimCycle - 4.8) * 0.32;
        const flukeScale3D = 0.88 + 0.18 * Math.sin(wh.swimCycle - 4.2);

        for (const side of [-1, 1]) {
          for (let is = 0; is <= flukeSteps; is++) {
            const s = is / flukeSteps;
            const sweepBack = Math.pow(s, 1.45) * 0.48 + Math.sin(wh.swimCycle - 5.2) * 0.12 * s;
            const flukeAng =
              flukeRootSp.ang + flukeWhipAngle + side * (Math.PI * 0.5 + sweepBack);

            const dist = s * flukeSpan * flukeScale3D;
            const fx = flukeRootSp.x + Math.cos(flukeAng) * dist;
            const fy = flukeRootSp.y + Math.sin(flukeAng) * dist;

            const notchProfile = s < 0.15 ? s / 0.15 : 1.0;
            const flukeChord =
              baseLen *
              0.095 *
              Math.sin(Math.sqrt(s) * Math.PI) *
              (0.55 + 0.45 * notchProfile);

            const chordSteps = Math.max(3, Math.ceil(flukeChord / (cellSize * 0.52)));
            for (let ic = 0; ic <= chordSteps; ic++) {
              const cNorm = ic / chordSteps;
              const wx = fx - flukeRootSp.tx * (cNorm * flukeChord);
              const wy = fy - flukeRootSp.ty * (cNorm * flukeChord);

              const isLightEdge = s > 0.72 || cNorm > 0.74;
              const shade = isLightEdge ? 0.24 : 0.76 - cNorm * 0.18;
              const tone = isLightEdge ? 0.15 : 0.8;

              splatPoint(
                wx,
                wy,
                9.8 + (flukeScale3D - 0.88) * 8 + (1 - wIdx) * 5,
                shade,
                tone,
                cellSize * 0.4
              );
            }

            if (is === flukeSteps && sm.activity > 0.12 && Math.random() < 0.3 * sm.activity) {
              wakeParticles.push({
                x: fx,
                y: fy,
                vx: -flukeRootSp.tx * 0.6 + (Math.random() - 0.5) * 0.5,
                vy: -flukeRootSp.ty * 0.6 + (Math.random() - 0.5) * 0.5,
                age: 0,
                maxAge: 45 + Math.random() * 35,
                size: (11 + Math.random() * 14) * wh.scale,
                kind: 'vortex'
              });
            }
          }
        }

        if (Math.random() < 0.05 + sm.activity * 0.18) {
          const blowSp = sampleSpine(0.17);
          wakeParticles.push({
            x: blowSp.x + (Math.random() - 0.5) * 10,
            y: blowSp.y + (Math.random() - 0.5) * 10,
            vx: -blowSp.tx * 0.35 + (Math.random() - 0.5) * 0.3,
            vy: -blowSp.ty * 0.35 + (Math.random() - 0.5) * 0.3,
            age: 0,
            maxAge: 35 + Math.random() * 30,
            size: (8 + Math.random() * 9) * wh.scale,
            kind: 'bubble'
          });
        }
      }

      if (wakeParticles.length > 60) {
        wakeParticles.splice(0, wakeParticles.length - 60);
      }

      // 5. Render Wake Vortices & Bubble Trails
      for (let i = wakeParticles.length - 1; i >= 0; i--) {
        const pt = wakeParticles[i];
        pt.x += pt.vx * dtScale;
        pt.y += (pt.vy - sm.velocity * 0.18) * dtScale;
        pt.age += dtScale;
        if (pt.age >= pt.maxAge) {
          wakeParticles.splice(i, 1);
          continue;
        }
        const progress = pt.age / pt.maxAge;
        const rad = pt.size * (0.4 + progress * 1.1);
        const cCol = (pt.x / cellSize) | 0;
        const cRow = (pt.y / cellSize) | 0;
        const span = Math.ceil(rad / cellSize);

        for (let dr = -span; dr <= span; dr++) {
          const rr = cRow + dr;
          if (rr < 0 || rr >= rows) continue;
          for (let dc = -span; dc <= span; dc++) {
            const cc = cCol + dc;
            if (cc < 0 || cc >= cols) continue;
            if (occBuf[cc + rr * cols] > 0) continue;

            const d = Math.hypot(dc * cellSize, dr * cellSize);
            const isRing =
              pt.kind === 'vortex'
                ? Math.abs(d - rad * 0.7) < cellSize * 0.9
                : d < rad * 0.6;
            if (isRing) {
              const stampIdx = progress < 0.4 ? 2 : progress < 0.75 ? 1 : 0;
              ctx.drawImage(
                atlasCanvas,
                stampIdx * tilePx,
                5 * tilePx,
                tilePx,
                tilePx,
                cc * cellSize,
                rr * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }
      }

      // 5B. FEEDING ENCOUNTER — fish school simulation (drawn beneath the whale tiles)
      const scrollDeltaPx = sm.smoothScrollY - lastSmoothScrollY;
      lastSmoothScrollY = sm.smoothScrollY;
      if (!prefersReducedMotion && !isFocus) {
        const mainWh = whales[0];
        const headX = mainWh.spineX[0];
        const headY = mainWh.spineY[0];
        const hx = Math.cos(mainWh.heading);
        const hy = Math.sin(mainWh.heading);
        const scrollingNow = sm.activity > 0.08;

        if (feed.state === 'idle') {
          let ready = false;
          if (!feed.firstDone) {
            // First encounter: fixed short delay after arrival, scrolling or not
            feed.timer -= dt;
            ready = feed.timer <= 0;
          } else {
            // Later encounters: ~10s without scrolling (any scroll resets), then a small random delay
            if (scrollingNow) feed.idleForFeed = 0;
            else feed.idleForFeed += dt;
            ready = feed.idleForFeed >= 10 + feed.extraDelay;
          }
          if (ready) {
            const headVisible = headX > w * 0.04 && headX < w * 0.96 && headY > h * 0.06 && headY < h * 0.94;
            if (headVisible && auto.phase !== 'offscreen' && auto.phase !== 'return') {
              spawnSchool(headX, headY, hx, hy, w, h, scrollingNow);
            } else if (!feed.firstDone) {
              feed.timer = 0.8; // whale out of view: try again shortly
            }
          }
        }

        let wantMouth = false;
        if (feed.state !== 'idle') {
          feed.age += dt;
          // The school lives in the water: it drifts with the scrolled page (parallax)
          const waterShiftY = -scrollDeltaPx * 0.7;
          const reach = mainBodyLen * 0.4;
          const eatRadius = mainBodyLen * 0.075 + 14;

          if (feed.state === 'school') {
            // Ease toward the whale's path (projection of the school onto its heading line)
            const relX = feed.cx - headX;
            const relY = feed.cy - headY;
            const along = relX * hx + relY * hy;
            const pathX = headX + hx * Math.max(0, along);
            const pathY = headY + hy * Math.max(0, along);
            const interceptX = (pathX - feed.cx) * Math.min(1, 0.012 * dtScale);
            const interceptY = (pathY - feed.cy) * Math.min(1, 0.008 * dtScale);
            const maxStep = 1.1 * dtScale;
            feed.cx += Math.max(-maxStep, Math.min(maxStep, interceptX)) + feed.swimDir * 0.35 * dtScale;
            feed.cy += Math.max(-maxStep, Math.min(maxStep, interceptY)) + waterShiftY;
            if (!scrollingNow) {
              // Idle: a school waiting just beyond the edge swims into view
              const clampedY = Math.max(h * 0.12, Math.min(h * 0.88, feed.cy));
              feed.cy += Math.max(-0.9 * dtScale, Math.min(0.9 * dtScale, clampedY - feed.cy));
            }
            if (feed.isFirst && feed.age > 3.2 && !feed.lungeSeen) {
              // First encounter must complete within ~5–8s: the school swims into the whale's path
              const meetX = headX + hx * reach * 0.6;
              const meetY = headY + hy * reach * 0.6;
              const step = Math.min(1, (feed.age - 3.2) / 2) * 1.8 * dtScale;
              const mdx = meetX - feed.cx;
              const mdy = meetY - feed.cy;
              const md = Math.hypot(mdx, mdy);
              if (md > 1) {
                feed.cx += (mdx / md) * Math.min(md, step);
                feed.cy += (mdy / md) * Math.min(md, step);
              }
            }

            // Encounter can no longer complete naturally → scatter
            const distToHead = Math.hypot(relX, relY);
            const behind = along < -mainBodyLen * 0.25;
            const offView = feed.cy < -h * 0.4 || feed.cy > h * 1.4 || feed.cx < -w * 0.15 || feed.cx > w * 1.15;
            if (offView || feed.age > 13 || (behind && !feed.isFirst && distToHead > mainBodyLen * 0.5 && feed.age > 2)) {
              scatterSchool();
            }
          }

          let alive = 0;
          let mouthCandidates = 0;
          // Whale's lateral axis: fish escaping a lunge dart sideways, not straight ahead
          const latX = -hy;
          const latY = hx;
          const fleeR = mainBodyLen * 0.42;
          const mouthHalfW = mainBodyLen * 0.085 * (1 + feed.mouthOpen * 0.6);
          const fishList = feed.fish;
          for (let i = 0; i < fishList.length; i++) {
            const f = fishList[i];
            f.t += dt;
            if (f.state === 'swim') {
              alive++;
              // 1. Home slot inside the elongated school, with a slow wave travelling through it
              const morph = 1 + Math.sin(time * 0.45 + f.phase) * 0.12;
              const gx = feed.cx + f.ox * morph;
              const gy = feed.cy + f.oy + Math.sin(time * 0.9 - f.ox * 0.035) * 4;
              let ax = (gx - f.x) * 0.0022;
              let ay = (gy - f.y) * 0.003;

              // 2. Flocking: align with neighbours, keep a small personal space
              let avx = 0;
              let avy = 0;
              let n = 0;
              let sepX = 0;
              let sepY = 0;
              for (let j = 0; j < fishList.length; j++) {
                if (j === i) continue;
                const o = fishList[j];
                if (o.state !== 'swim') continue;
                const ddx = f.x - o.x;
                const ddy = f.y - o.y;
                if (ddx > 36 || ddx < -36 || ddy > 36 || ddy < -36) continue;
                const d2 = ddx * ddx + ddy * ddy;
                avx += o.vx;
                avy += o.vy;
                n++;
                if (d2 < 110 && d2 > 0.01) {
                  sepX += ddx / d2;
                  sepY += ddy / d2;
                }
              }
              if (n > 0) {
                ax += (avx / n - f.vx) * 0.045;
                ay += (avy / n - f.vy) * 0.045;
              }
              ax += sepX * 0.9 + feed.swimDir * 0.012;
              ay += sepY * 0.9;

              // 3. The whale: fish in the mouth's path are drawn in, the others part sideways
              const rx = f.x - headX;
              const ry = f.y - headY;
              const d = Math.hypot(rx, ry);
              const along = rx * hx + ry * hy;
              const lat = rx * latX + ry * latY;
              let fleeing = false;
              if (d < fleeR) {
                if (along > -eatRadius && d < reach) mouthCandidates++;
                const inMouthPath = along > -eatRadius && along < reach && Math.abs(lat) < mouthHalfW;
                if (inMouthPath && feed.mouthOpen > 0.3 && d > 1) {
                  const pull = Math.min(d, 2.4 * dtScale * feed.mouthOpen);
                  f.x -= (rx / d) * pull;
                  f.y -= (ry / d) * pull;
                } else if (!inMouthPath) {
                  const side = lat >= 0 ? 1 : -1;
                  const k = 1 - d / fleeR;
                  ax += (latX * side * 0.38 + hx * 0.08) * k;
                  ay += (latY * side * 0.38 + hy * 0.08) * k;
                  fleeing = true;
                }
              }

              // 4. Integrate: fish prefer level swimming and a narrow speed band
              f.vx += ax * dtScale;
              f.vy += ay * dtScale;
              f.vy *= Math.pow(0.94, dtScale);
              const sp = Math.hypot(f.vx, f.vy);
              const maxS = fleeing ? 3.6 : 2.0;
              if (sp > maxS) {
                f.vx *= maxS / sp;
                f.vy *= maxS / sp;
              } else if (sp < 0.45 && sp > 0.0001) {
                f.vx *= 0.45 / sp;
                f.vy *= 0.45 / sp;
              }
              f.x += f.vx * dtScale;
              f.y += f.vy * dtScale + waterShiftY;
              f.alpha = Math.min(1, f.alpha + dt * 1.2);

              if (d < eatRadius && feed.mouthOpen > 0.25 && along > -eatRadius) {
                f.state = 'eaten';
                f.t = 0;
                feed.eatenCount++;
                feed.lungeSeen = true;
                feed.gulp = Math.min(1, feed.gulp + 0.1);
                if (feed.eatenCount % 9 === 1) {
                  wakeParticles.push({
                    x: headX + (Math.random() - 0.5) * 8,
                    y: headY + (Math.random() - 0.5) * 8,
                    vx: -hx * 0.3,
                    vy: -hy * 0.3,
                    age: 0,
                    maxAge: 30 + Math.random() * 20,
                    size: 7 + Math.random() * 5,
                    kind: 'bubble'
                  });
                }
              }
            } else if (f.state === 'eaten') {
              // Drawn into the mouth, vanishing quickly
              f.x += (headX - f.x) * Math.min(1, 0.35 * dtScale);
              f.y += (headY - f.y) * Math.min(1, 0.35 * dtScale);
              f.alpha = Math.max(0, f.alpha - dt * 5);
            } else {
              // Scatter outward, slow down and thin out progressively
              f.x += f.vx * dtScale;
              f.y += f.vy * dtScale + waterShiftY;
              f.vx *= Math.pow(0.988, dtScale);
              f.vy *= Math.pow(0.97, dtScale);
              if (f.t > 0) f.alpha = Math.max(0, f.alpha - dt * 0.7);
            }
          }
          wantMouth = mouthCandidates > 0;

          // After the lunge, survivors regroup briefly, then the school disperses
          if (feed.state === 'school' && feed.lungeSeen && !wantMouth) {
            feed.leaveTimer += dt;
            if (feed.leaveTimer > 2.8) scatterSchool();
          }

          // Encounter finished: everything eaten or faded
          const anyVisible = fishList.some((f) => f.alpha > 0.01 || f.t < 0);
          if ((feed.state === 'school' && alive === 0) || !anyVisible) {
            feed.doneDelay += dt;
            if (feed.doneDelay > 0.5 || !anyVisible) {
              feed.state = 'idle';
              feed.fish = [];
              if (feed.isFirst && feed.eatenCount === 0) {
                // The first encounter didn't happen (e.g. scrolled away): offer it again shortly
                feed.timer = rand(1.5, 3);
              } else {
                // From now on, encounters need ~10s without scrolling (counted from here)
                feed.firstDone = true;
              }
              feed.isFirst = false;
              feed.idleForFeed = 0;
              feed.extraDelay = rand(0.5, 4);
            }
          }

          // Raster the school into the shared character grid (same mosaic as whale & water).
          // Each fish inks its cell plus a fainter tail cell behind it; the ink weight
          // ripples with the fish's heading, so turning waves flash through the school.
          if (feed.fish.length) {
            let touched = 0;
            const addInk = (cc: number, rr: number, v: number) => {
              if (cc < 1 || cc >= cols - 1 || rr < 1 || rr >= rows - 1) return;
              const k = cc + rr * cols;
              if (fishBuf[k] === 0) fishTouched[touched++] = k;
              fishBuf[k] += v;
            };
            for (const f of feed.fish) {
              if (f.alpha <= 0.01) continue;
              if (f.vx > 0.25) f.face = 1;
              else if (f.vx < -0.25) f.face = -1;
              const heading = Math.atan2(f.vy, f.vx);
              const flash = 0.82 + 0.18 * Math.sin(heading * 3 + time * 1.6 + f.ox * 0.025);
              const v = f.alpha * FISH_TIER_WEIGHT[f.tier] * flash;
              const cc = (f.x / cellSize) | 0;
              const rr = (f.y / cellSize) | 0;
              addInk(cc, rr, v);
              addInk(cc - f.face, rr, v * 0.5);
            }
            for (let k = 0; k < touched; k++) {
              const cellIdx = fishTouched[k];
              const v = fishBuf[cellIdx];
              fishBuf[cellIdx] = 0;
              // Hidden under the whale (fish being engulfed) or too faint
              if (v < 0.08 || occBuf[cellIdx] > 0) continue;
              const level = Math.min(1, v / 1.1);
              const inkRow =
                abyss > 0.5
                  ? level < 0.3 ? 20 : level < 0.62 ? 21 : 19 // pale tiers in dark water
                  : level < 0.3 ? 15 : level < 0.62 ? 16 : 17;
              // Denser glyphs ('-' '=' '+' '*' 'x' '#' '%') so every fish reads as a solid mark
              const gi = Math.min(9, 2 + ((level * 6.5) | 0) + ((cellIdx * 7) & 1));
              ctx.drawImage(
                atlasCanvas,
                gi * tilePx,
                inkRow * tilePx,
                tilePx,
                tilePx,
                (cellIdx % cols) * cellSize,
                ((cellIdx / cols) | 0) * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }

        // Jaws: open quickly when fish are within reach ahead, close softly afterwards
        const mouthTarget = wantMouth ? 1 : 0;
        feed.mouthOpen += (mouthTarget - feed.mouthOpen) * Math.min(1, dt * (wantMouth ? 6 : 2.6));
        if (feed.mouthOpen < 0.005) feed.mouthOpen = 0;
        // Throat pouch deflates slowly after the gulp
        feed.gulp *= Math.exp(-dt / 1.6);
        if (feed.gulp < 0.005) feed.gulp = 0;
      }

      // Expand dirty bounding box by 1 cell for halo border computation
      const boxMinC = Math.max(1, curMinC - 1);
      const boxMaxC = Math.min(cols - 2, curMaxC + 1);
      const boxMinR = Math.max(1, curMinR - 1);
      const boxMaxR = Math.min(rows - 2, curMaxR + 1);

      prevMinC = boxMinC;
      prevMaxC = boxMaxC;
      prevMinR = boxMinR;
      prevMaxR = boxMaxR;

      // 6. Compute Halo & Blit Pre-rendered Atlas Tiles Only Inside Bounding Box
      // Subtle contrast attenuation establishes underwater distance (foreground vs deeper companion)
      const shimmerTick = (time * 2.2) | 0;
      const fgWhaleAlpha = isFocus ? 1.0 : 0.60 + (1 - entryCalm) * 0.18;
      // Both whales share the deep-blue atlas rows (10..14) at full strength
      const whaleAlpha = 1.0;
      let activeAlpha = 1.0;

      for (let r = boxMinR; r <= boxMaxR; r++) {
        const py = r * cellSize;
        const rowOff = r * cols;
        for (let c = boxMinC; c <= boxMaxC; c++) {
          const idx = rowOff + c;
          const px = c * cellSize;
          const occ = occBuf[idx];

          if (occ > 0) {
            const targetAlpha = whaleAlpha;
            if (targetAlpha !== activeAlpha) {
              ctx.globalAlpha = targetAlpha;
              activeAlpha = targetAlpha;
            }

            const shade = lumBuf[idx];
            const tone = toneBuf[idx];

            // Calm, coherent typographic evolution (no rapid random flickering)
            const hash = ((c * 37 + r * 73 + shimmerTick) & 7) * 0.16;
            const glyphIdx = Math.min(
              NUM_GLYPHS - 1,
              Math.max(0, (shade * (NUM_GLYPHS - 2) + hash) | 0)
            );

            let styleRow = 0;
            if (shade > 0.76) {
              styleRow = 4;
            } else if (shade > 0.52) {
              styleRow = tone > 0.6 ? 3 : 2;
            } else if (shade > 0.32) {
              styleRow = 1;
            } else {
              styleRow = 0;
            }

            ctx.drawImage(
              atlasCanvas,
              (tone > 1.5 ? (c * 7 + r * 13 + shimmerTick) & 3 : glyphIdx) * tilePx,
              (tone > 1.5 ? 18 : !isFocus ? styleRow + 10 : styleRow) * tilePx,
              tilePx,
              tilePx,
              px,
              py,
              cellSize,
              cellSize
            );
          } else {
            const n =
              (occBuf[idx - 1] > 0 ? 1 : 0) +
              (occBuf[idx + 1] > 0 ? 1 : 0) +
              (occBuf[idx - cols] > 0 ? 1 : 0) +
              (occBuf[idx + cols] > 0 ? 1 : 0) +
              (occBuf[idx - cols - 1] > 0 ? 1 : 0) +
              (occBuf[idx - cols + 1] > 0 ? 1 : 0) +
              (occBuf[idx + cols - 1] > 0 ? 1 : 0) +
              (occBuf[idx + cols + 1] > 0 ? 1 : 0);

            if (n > 0) {
              if (fgWhaleAlpha !== activeAlpha) {
                ctx.globalAlpha = fgWhaleAlpha;
                activeAlpha = fgWhaleAlpha;
              }
              const haloCol = n >= 3 ? 2 : n >= 2 ? 1 : 0;
              ctx.drawImage(
                atlasCanvas,
                haloCol * tilePx,
                5 * tilePx,
                tilePx,
                tilePx,
                px,
                py,
                cellSize,
                cellSize
              );
            }
          }
        }
      }
      if (activeAlpha !== 1.0) {
        ctx.globalAlpha = 1.0;
      }

      // 7. DEEP-OCEAN BIOLUMINESCENT JELLYFISH — Foreground-margin plane
      renderJellyfishPlanes(w, h, rawDepth, abyss, surfaceBaseY, 2, 2);

      // 7B. Fishing-boat behaviour (time-based state machine; never coupled to scroll position)
      if (!isFocus) fishingBoat.update(prefersReducedMotion ? dt * 0.15 : dt, surfaceBaseY, h, prefersReducedMotion);

      // 8. OCEAN SURFACE WATERLINE BOUNDARY, REFLECTIONS & SURFACE SHIP (recedes cleanly above viewport on scroll)
      renderSurfaceBoundaryAndShip(w, h, surfaceBaseY);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      layoutObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScrollChange);
      window.removeEventListener('wheel', handleWheelDir);
      oceanLifeDisposed = true;
      cancelAnimationFrame(animId);
    };
  }, [mode]);

  if (mode === 'off') return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ${
        mode === 'focus' ? 'z-30 bg-[#F5F3EE]/85 backdrop-blur-[2px]' : 'z-[1]'
      }`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
});

// ============================================================================
// PROGRESSIVE OCEAN ENTRY & SCROLL-DRIVEN INTRODUCTION (PHASES 1 -> 4)
// ============================================================================

function smoothStepRange(value: number, start: number, end: number): number {
  if (end <= start) return value >= end ? 1 : 0;
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

interface ProgressiveOceanEntryProps {
  onExploreDossier: () => void;
  onDownloadPdf: () => void;
}

const NAME_WORDS = [
  { text: 'Xavier', offset: 0 },
  { text: 'Hery', offset: 1.5 }
];

const ProgressiveOceanEntry: React.FC<ProgressiveOceanEntryProps> = React.memo(({
  onExploreDossier,
  onDownloadPdf
}) => {
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const metricsRef = useRef<{ docTop: number; travel: number }>({ docTop: 0, travel: 1 });
  const [introProgress, setIntroProgress] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && sectionRef.current) {
          sectionRef.current.dataset.homeOffscreen = entry.isIntersecting ? 'false' : 'true';
        }
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mq =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    const isReduced = Boolean(mq?.matches);
    setReducedMotion(isReduced);

    let rafId = 0;
    let isLooping = false;
    let targetP = 0;
    let currentP = 0;

    const updateMetrics = () => {
      const el = runwayRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      metricsRef.current.docTop = rect.top + window.scrollY;
      metricsRef.current.travel = Math.max(1, rect.height - window.innerHeight);
    };

    const computeTargetProgress = (): number => {
      const { docTop, travel } = metricsRef.current;
      const scrolled = Math.max(0, window.scrollY - docTop);
      return Math.max(0, Math.min(1, scrolled / travel));
    };

    // Initialize immediately to current scroll position (handles refresh mid-page cleanly)
    updateMetrics();
    targetP = computeTargetProgress();
    currentP = targetP;
    setIntroProgress(currentP);

    const tick = () => {
      const diff = targetP - currentP;
      if (Math.abs(diff) < 0.0007 || isReduced) {
        if (currentP !== targetP) {
          currentP = targetP;
          setIntroProgress(currentP);
        }
        isLooping = false;
        return;
      }
      currentP += diff * 0.22;
      setIntroProgress(currentP);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      targetP = computeTargetProgress();
      if (Math.abs(targetP - currentP) < 0.0005) return;
      if (isReduced) {
        currentP = targetP;
        setIntroProgress(currentP);
        return;
      }
      if (!isLooping) {
        isLooping = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onResize = () => {
      updateMetrics();
      onScroll();
    };

    const ro =
      typeof ResizeObserver !== 'undefined' && runwayRef.current
        ? new ResizeObserver(onResize)
        : null;
    if (ro && runwayRef.current) ro.observe(runwayRef.current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleDescendInvite = useCallback(() => {
    const { docTop, travel } = metricsRef.current;
    const nextScrollY =
      introProgress < 0.35 ? docTop + travel * 0.45 : docTop + travel * 0.9;
    window.scrollTo({ top: nextScrollY, behavior: 'smooth' });
  }, [introProgress]);

  // Phase 1 — The Invitation (0.00 -> 0.24)
  const p = introProgress;
  const phase1Opacity = 1 - smoothStepRange(p, 0.02, 0.24);
  const phase1TranslateY = reducedMotion ? 0 : -smoothStepRange(p, 0.01, 0.25) * 20;
  const phase1Blur = reducedMotion ? 0 : smoothStepRange(p, 0.05, 0.24) * 3.2;

  const indicatorOpacity = 1 - smoothStepRange(p, 0.01, 0.19);
  const indicatorTranslateY = reducedMotion ? 0 : smoothStepRange(p, 0.01, 0.19) * 10;
  const indicatorScaleY = 1 + smoothStepRange(p, 0.0, 0.18) * 0.45;

  // Phase 2 — The Identity: XAVIER HERY (0.25 -> 0.53)
  const phase2Reveal = smoothStepRange(p, 0.25, 0.53);
  // Subtle vertical settle as Phase 3 joins beneath the name
  const identityCenterOffset = reducedMotion ? 0 : (1 - smoothStepRange(p, 0.46, 0.68)) * 34;

  // Phase 3 — The Migration & Experience Introduction (0.48 -> 0.90)
  const dividerScaleX = smoothStepRange(p, 0.47, 0.63);
  const group3AReveal = smoothStepRange(p, 0.5, 0.68);
  const group3BReveal = smoothStepRange(p, 0.61, 0.79);
  const group3CReveal = smoothStepRange(p, 0.71, 0.89);

  return (
    <section
      id="home"
      ref={sectionRef}
      data-home-offscreen="false"
      className="relative"
    >
      {/* Scroll runway for natural, unlocked progressive discovery — pure top edge with no header text */}
      <div ref={runwayRef} className="relative min-h-[240vh] sm:min-h-[255vh]">
        <div className="sticky top-0 h-[100dvh] min-h-[540px] flex flex-col justify-center py-10 sm:py-14 overflow-hidden">
          {/* PHASE 1: Spacious Atmospheric Opening Viewport */}
          <div
            aria-hidden={phase1Opacity < 0.05}
            style={{
              opacity: phase1Opacity,
              transform: `translateY(${phase1TranslateY}px)`,
              filter: phase1Blur > 0.05 ? `blur(${(Math.round(phase1Blur * 4) / 4).toFixed(2)}px)` : 'none',
              pointerEvents: phase1Opacity > 0.15 ? 'auto' : 'none',
              visibility: phase1Opacity <= 0.01 ? 'hidden' : 'visible'
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 select-none z-10"
          >
            <div className="max-w-2xl mx-auto">
              <p
                aria-label="A journey without horizons"
                className="font-display text-[42px] sm:text-6xl md:text-7xl text-[#162633] leading-[1.08] tracking-[-0.01em]"
              >
                <span aria-hidden="true" className="block">
                  <span className="ocean-wave-word" style={{ animationDelay: '0.08s', animationDuration: '0.95s' }}>
                    A
                  </span>{' '}
                  <span className="ocean-wave-word" style={{ animationDelay: '0.24s', animationDuration: '0.98s' }}>
                    journey
                  </span>{' '}
                  <span className="ocean-wave-word" style={{ animationDelay: '0.42s', animationDuration: '1.00s' }}>
                    without
                  </span>
                </span>
                <span aria-hidden="true" className="block mt-0.5 sm:mt-1">
                  <span
                    className="ocean-wave-word font-title italic font-normal text-[1.1em] tracking-[-0.005em]"
                    style={{ animationDelay: '0.66s', animationDuration: '1.12s' }}
                  >
                    horizons
                  </span>
                </span>
              </p>
            </div>
          </div>

          {/* PHASE 1 Bottom Animated Scroll Indicator */}
          <button
            type="button"
            onClick={handleDescendInvite}
            aria-label="Descend to explore portfolio"
            style={{
              opacity: indicatorOpacity,
              transform: `translate(-50%, ${indicatorTranslateY}px)`,
              pointerEvents: indicatorOpacity > 0.18 ? 'auto' : 'none',
              visibility: indicatorOpacity <= 0.01 ? 'hidden' : 'visible'
            }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 z-20 cursor-pointer group"
          >
            <span className="ocean-cue-in flex flex-col items-center gap-2.5">
              <span
                style={{ transform: `scaleY(${indicatorScaleY.toFixed(3)})` }}
                className="w-[1px] h-8 sm:h-10 bg-[#3E5666]/30 relative overflow-hidden block origin-top"
              >
                <span className="absolute inset-0 bg-[#162633] animate-scroll-line block" />
              </span>
            </span>
          </button>

          {/* PHASES 2 & 3: Progressive Identity & Whale-Linked Introduction (no top text bar) */}
          <div
            style={{
              transform: `translateY(${identityCenterOffset.toFixed(1)}px)`,
              pointerEvents: phase2Reveal > 0.15 ? 'auto' : 'none',
              visibility: phase2Reveal <= 0.01 ? 'hidden' : 'visible'
            }}
            className="my-auto py-1 sm:py-3 relative z-10"
          >
            {/* Phase 2: XAVIER HERY — Controlled ASCII-Shader-Connected Emergence */}
            <h1
              aria-label="Xavier Hery"
              className="font-title text-[#171717] text-[19vw] sm:text-[15vw] lg:text-[clamp(96px,11vw,176px)] leading-[0.92] tracking-[-0.02em] flex flex-wrap items-baseline gap-x-[0.22em]"
            >
              {NAME_WORDS.map((word, idx) => {
                const wordP = smoothStepRange(phase2Reveal, idx * 0.22, idx * 0.22 + 0.6);
                return (
                  <span
                    key={word.text}
                    aria-hidden="true"
                    style={{
                      opacity: reducedMotion ? phase2Reveal : wordP,
                      transform: reducedMotion ? 'none' : `translateY(${((1 - wordP) * 22).toFixed(1)}px)`,
                      filter: reducedMotion || wordP > 0.98 ? 'none' : `blur(${(Math.round((1 - wordP) * 5 * 4) / 4).toFixed(2)}px)`
                    }}
                    className="inline-block"
                  >
                    <TideWord text={word.text} offset={word.offset} />
                  </span>
                );
              })}
            </h1>

            {/* Phase 3: Progressive Factual Introduction */}
            <div className="relative pt-4 sm:pt-7 mt-4 sm:mt-7">
              <div
                aria-hidden="true"
                style={{
                  transform: `scaleX(${dividerScaleX.toFixed(3)})`,
                  opacity: dividerScaleX
                }}
                className="absolute top-0 left-0 right-0 h-[1px] bg-[#162633]/18 origin-left"
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                <div aria-hidden="true" className="hidden lg:block lg:col-span-5" />

                {/* Readable Line Groups for the Factual CV Introduction */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <p
                      style={{
                        opacity: group3AReveal,
                        transform: `translateY(${reducedMotion ? 0 : (1 - group3AReveal) * 14}px)`
                      }}
                      className="font-display text-xl sm:text-2xl lg:text-[28px] xl:text-[31px] text-[#171717] font-medium leading-[1.22]"
                    >
                      <BioWords text="Like the whale migrating across oceans without borders, my journey has been shaped by constant movement, living across" />{' '}
                      <TideWord text="Doha" offset={0} />, <TideWord text="Paris" offset={0.8} />,{' '}
                      <TideWord text="Jakarta" offset={1.6} />, <TideWord text="Moscow" offset={2.4} />,{' '}
                      <TideWord text="Singapore" offset={3.2} />, <TideWord text="Pau" offset={4.0} />, and{' '}
                      <TideWord text="Shanghai" offset={4.8} />.
                    </p>
                    <p
                      style={{
                        opacity: group3BReveal,
                        transform: `translateY(${reducedMotion ? 0 : (1 - group3BReveal) * 14}px)`
                      }}
                      className="mt-3 sm:mt-4 text-base sm:text-lg lg:text-xl text-[#2B353B] font-normal leading-relaxed max-w-3xl"
                    >
                      <BioWords text={CV_DATA.heroIntroSecondary} />
                    </p>
                  </div>


                </div>
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="h-1" />
        </div>
      </div>

    </section>
  );
});

// ============================================================================
// MAIN APPLICATION COMPONENT & REDESIGNED OCEANIC TYPOGRAPHY SYSTEM
// ============================================================================

const GLOBAL_PORTFOLIO_CSS = `
  :root {
    --font-sans: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-mono: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace;
    --font-serif: 'Instrument Serif', 'Cormorant Garamond', Georgia, serif;
    --font-hero: 'Instrument Serif', 'Cormorant Garamond', Georgia, serif;
    --font-hero-title: 'Cormorant Garamond', 'Instrument Serif', Georgia, serif;
    --font-body: var(--font-sans);
    --font-title: var(--font-sans);
    --font-annot: var(--font-mono);
    --font-tech: var(--font-mono);
  }
  html { scroll-padding-top: 4.5rem; }
  body {
    font-family: var(--font-sans);
    background-color: #F5F3EE;
    color: #171717;
    line-height: 1.62;
    letter-spacing: -0.011em;
    font-size-adjust: none;
    font-synthesis: none;
    font-kerning: normal;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
  }
  button, input, textarea, select { font-family: inherit; }

  /* Typography tokens */
  .font-sans, .cv-arch, .font-arch { font-family: var(--font-sans); font-style: normal; }
  .font-mono, .font-tech, .font-annot { font-family: var(--font-mono); font-style: normal; letter-spacing: 0.02em; }
  .font-serif { font-family: var(--font-serif); }
  
  /* Hero / Cover display typography */
  #home .font-display, .hero-display { font-family: var(--font-hero); }
  #home .font-title { font-family: var(--font-hero-title); font-size-adjust: 0.44; }
  .font-display { font-family: var(--font-hero); }
  .font-title { font-family: var(--font-sans); }

  /* Fluid typography & oceanic scales */
  .ocean-h2 {
    font-family: var(--font-sans);
    font-size: clamp(2rem, 1.35rem + 2.6vw, 3.25rem);
    line-height: 1.12;
    letter-spacing: -0.025em;
    font-weight: 500;
  }
  .ocean-h3 {
    font-family: var(--font-sans);
    font-size: clamp(1.25rem, 1.05rem + 1vw, 1.875rem);
    line-height: 1.25;
    letter-spacing: -0.015em;
    font-weight: 500;
  }
  .ocean-meta {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    line-height: 1.4;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .ocean-body {
    font-family: var(--font-sans);
    font-size: clamp(0.9375rem, 0.9rem + 0.2vw, 1.0625rem);
    line-height: 1.7;
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

interface FloatingSectionHeaderProps {
  sectionId?: string;
  number?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  coordinates?: string;
  asideAccent?: React.ReactNode;
}

const FloatingSectionHeader: React.FC<FloatingSectionHeaderProps> = ({
  title,
  description,
  asideAccent
}) => {
  return (
    <div className="relative pt-8 pb-6 sm:pt-12 sm:pb-8">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end">
        <div className="lg:col-span-7">
          <h2 className="ocean-h2 text-[#171717] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <BioWords text={title} />
          </h2>
        </div>
        {description && (
          <div className="lg:col-span-5 flex flex-col justify-end">
            <p className="ocean-body text-sm sm:text-base text-[#1F2428] leading-relaxed transition-opacity duration-700 delay-150">
              <BioWords text={description} />
            </p>
            {asideAccent && (
              <div className="mt-3 transition-opacity duration-700 delay-300">
                {asideAccent}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [pastIntro, setPastIntro] = useState<boolean>(false);
  const [cvModalOpen, setCvModalOpen] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<boolean>(false);

  useEffect(() => {
    document.title = 'Xavier Hery | International Business, Technology, Strategy';
  }, []);

  useEffect(() => {
    let rafPending = false;
    let rafId = 0;
    let cachedDocScrollable = 1;
    let cachedExpThresholdY = 600;

    const measureDoc = () => {
      const h = window.innerHeight;
      cachedDocScrollable = Math.max(1, document.documentElement.scrollHeight - h);
      const expEl = document.getElementById('experience');
      cachedExpThresholdY = expEl ? expEl.offsetTop - h * 0.35 : cachedDocScrollable * 0.18;
    };

    const updateScrollState = () => {
      rafPending = false;
      const scrollTop = window.scrollY;
      const ratio = Math.min(1, Math.max(0, scrollTop / cachedDocScrollable));
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      const nextPastIntro = scrollTop >= cachedExpThresholdY;
      setPastIntro((prev) => (prev === nextPastIntro ? prev : nextPastIntro));
    };

    const handleScroll = () => {
      if (!rafPending) {
        rafPending = true;
        rafId = requestAnimationFrame(updateScrollState);
      }
    };

    const handleResize = () => {
      measureDoc();
      handleScroll();
    };

    measureDoc();
    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
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

  const handleCopyEmail = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(CV_DATA.email).catch(() => undefined);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ocean-background)] text-[#171717] antialiased selection:bg-[#B6C5B0] selection:text-[#171717] [overflow-x:clip]">
      <style>{GLOBAL_PORTFOLIO_CSS}</style>

      {/* Persistent Oceanic Scroll Depth Indicator */}
      <div
        className={`fixed top-0 left-0 right-0 h-[2px] bg-[#9BB4B5]/40 z-50 pointer-events-none transition-opacity duration-500 ${
          pastIntro ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left will-change-transform bg-gradient-to-r from-[#162633] via-[#3E5666] to-[#6C8D91]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <AsciiWhaleBackground mode="ambient" />

      {downloadToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#171717]/90 backdrop-blur-md text-[#F5F3EE] border border-[#B6C5B0] px-4 py-3 shadow-lg flex items-center gap-3 font-mono text-xs">
          <Check className="w-4 h-4 text-[#B6C5B0]" />
          <span>Downloading {ORIGINAL_CV_FILENAME}</span>
        </div>
      )}

      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 ocean-legible">
        {/* SECTION 01: PROGRESSIVE OCEAN ENTRY & INTRODUCTION (Hero Preserved) */}
        <ProgressiveOceanEntry
          onExploreDossier={handleExploreDossier}
          onDownloadPdf={handleDownloadOriginalCv}
        />

        <div className="cv-arch mt-16 sm:mt-24 lg:mt-32 space-y-28 sm:space-y-36">
          {/* SECTION 02: EXPERIENCE (De-boxed, Floating Editorial Timeline) */}
          <section id="experience" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="experience"
                title="Operational & commercial internships"
                description="Practical experience across business development, commercial quotation workflows, and international air and sea freight coordination."
                asideAccent={
                  <p className="font-serif italic text-base text-[#52595E]">
                    Translating cross-cultural adaptability into rigorous B2B execution and freight logistics.
                  </p>
                }
              />
            </RevealBlock>

            <div className="space-y-16 sm:space-y-24 mt-4">
              {CV_DATA.experiences.map((exp, idx) => (
                <RevealBlock key={exp.id} delayMs={idx * 100}>
                  <article className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start relative group">
                    {/* Left Column: Temporal Anchor & Organization */}
                    <div className="lg:col-span-5 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#52595E] tracking-widest uppercase">
                          {exp.index}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#B6C5B0]" />
                        <span className="font-mono text-xs text-[#171717] tracking-wider uppercase font-medium">
                          <BioWords text={exp.date} />
                        </span>
                      </div>

                      <h3 className="ocean-h3 text-2xl sm:text-3xl lg:text-4xl text-[#171717] font-medium tracking-tight">
                        <BioWords text={exp.company} />
                      </h3>

                      <p className="font-sans text-base text-[#3E4C52] font-normal">
                        <BioWords text={exp.role} />
                      </p>

                      <p className="font-mono text-[11px] text-[#52595E]/90 tracking-wide uppercase pt-1">
                        <BioWords text={exp.domainTag.replace(/\s*\/\s*/g, ' · ')} />
                      </p>
                    </div>

                    {/* Right Column: Flowing Narrative & Deliverables */}
                    <div className="lg:col-span-7 lg:pl-6 max-w-2xl">
                      <ul className="space-y-4">
                        {exp.concisePoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-4 text-base text-[#1F2428] leading-relaxed">
                            <span className="font-mono text-xs text-[#52595E] mt-1 shrink-0 font-normal">
                              0{i + 1}
                            </span>
                            <span className="font-sans"><BioWords text={pt} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 03: INTERNATIONAL BACKGROUND (Pinned 3D Runway) */}
          <section id="global" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="global"
                title="Seven cities across Europe, the Middle East & Asia"
                description="An international chronology shaped by living across Doha, Paris, Jakarta, Moscow, Singapore, Pau, and Shanghai."
              />
            </RevealBlock>

            {/* Journey runway: a full-bleed, full-viewport stage stays pinned while the visitor
                scrolls through this distance — the scroll position IS the journey timeline */}
            <div
              data-journey-runway
              className="relative mt-8 sm:mt-12 h-[600vh] motion-reduce:h-[100svh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
            >
              <div className="sticky top-0 h-[100svh] w-full">
                <JourneyGlobe locations={CV_DATA.locations} />
              </div>
            </div>
          </section>

          {/* SECTION 04: SKILLS & TECHNOLOGY (Open Typographic Landscape) */}
          <section id="skills" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="skills"
                title="Technical & creative toolset"
                description="Organized across automated workflows, media production, and enterprise productivity suites."
              />
            </RevealBlock>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
              {CV_DATA.skills.map((category, idx) => {
                const columnOffsetClass = idx === 1 ? 'md:pt-8' : idx === 2 ? 'md:pt-4' : '';
                return (
                  <RevealBlock key={category.id} delayMs={idx * 110} className={columnOffsetClass}>
                    <div className="space-y-6">
                      <div>
                        <div className="font-mono text-xs uppercase tracking-widest text-[#52595E] mb-1.5">
                          // 0{idx + 1}
                        </div>
                        <h3 className="ocean-h3 text-xl sm:text-2xl text-[#171717] font-medium tracking-tight">
                          <BioWords text={category.title} />
                        </h3>
                        <p className="font-sans text-xs sm:text-sm text-[#52595E] mt-1.5 leading-relaxed">
                          <BioWords text={category.verbatimSummary} />
                        </p>
                      </div>

                      <div className="space-y-3.5 pt-2">
                        {category.items.map((skill) => (
                          <div
                            key={skill.name}
                            className="ocean-skill-item group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 py-1"
                          >
                            <span className="font-sans text-base sm:text-lg text-[#171717] font-normal group-hover:text-[#3E5666] transition-colors">
                              <BioWords text={skill.name} />
                            </span>
                            <span className="font-mono text-[11px] text-[#52595E]/80 tracking-wider uppercase shrink-0">
                              <BioWords text={skill.classification} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RevealBlock>
                );
              })}
            </div>
          </section>

          {/* SECTION 05: EDUCATION (Chronological Narrative Flow) */}
          <section id="education" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="education"
                title="Academic chronology"
                description="A global educational trajectory across international schools in Europe and Asia, culminating in the ESSCA Bachelor curriculum."
              />
            </RevealBlock>

            <div className="mt-8 sm:mt-12 space-y-12 sm:space-y-16">
              {CV_DATA.education.map((edu, idx) => (
                <RevealBlock key={edu.id} delayMs={idx * 80}>
                  <article className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start relative group">
                    {/* Date Column */}
                    <div className="md:col-span-3 font-mono text-xs sm:text-[13px] tracking-wider uppercase text-[#52595E] pt-1">
                      <BioWords text={edu.date} />
                    </div>

                    {/* Main Institution & Degree */}
                    <div className="md:col-span-6 space-y-1.5">
                      <h3 className="ocean-h3 text-xl sm:text-2xl text-[#171717] font-medium tracking-tight">
                        <BioWords text={edu.institution} />
                      </h3>
                      {edu.degree && (
                        <p className="font-sans text-sm sm:text-base text-[#3E4C52] font-normal">
                          <BioWords text={edu.degree} />
                        </p>
                      )}
                      {edu.highlights && (
                        <div className="pt-3 space-y-2 max-w-xl">
                          {edu.highlights.map((h, hIdx) => (
                            <p key={hIdx} className="font-sans text-xs sm:text-sm text-[#2B353B] leading-relaxed">
                              <span className="font-mono text-[#52595E] mr-2">·</span>
                              <BioWords text={h} />
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location & Metadata */}
                    <div className="md:col-span-3 md:text-right font-mono text-xs tracking-wider uppercase text-[#52595E] pt-1">
                      <BioWords text={edu.locationLabel} />
                    </div>
                  </article>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 06: LANGUAGES (Open Typographic Matrix) */}
          <section id="languages" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="languages"
                title="Across languages"
                description="Multilingual fluency forged through living and studying in six distinct linguistic regions."
              />
            </RevealBlock>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-10 sm:gap-y-14">
              {CV_DATA.languages.map((lang, idx) => (
                <RevealBlock key={lang.id} delayMs={idx * 60}>
                  <div className="group flex items-baseline justify-between gap-4 pb-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-[#52595E]/70">0{idx + 1}</span>
                      <h3 className="ocean-h3 text-2xl sm:text-3xl text-[#171717] font-medium tracking-tight">
                        <BioWords text={lang.language} />
                      </h3>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-wider text-[#52595E] whitespace-nowrap text-right">
                      {lang.levelCode && (
                        <>
                          <span className="text-[#1F2428] font-medium"><BioWords text={lang.levelCode} /></span>
                          <span className="text-[#52595E]/50 mx-1.5">·</span>
                        </>
                      )}
                      <span><BioWords text={lang.levelWord} /></span>
                    </div>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 07: PERSONAL INTERESTS (Open Vignettes) */}
          <section id="interests" className="relative">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="interests"
                title="Disciplines & cultural monitoring"
                description="Athletic conditioning, music production, macroeconomic research, and luxury retail observation."
              />
            </RevealBlock>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
              {CV_DATA.interests.map((interest, idx) => (
                <RevealBlock key={interest.id} delayMs={idx * 80}>
                  <div className="space-y-4">
                    <div className="font-mono text-xs uppercase tracking-widest text-[#52595E]">
                      // 0{idx + 1}
                    </div>
                    <h3 className="ocean-h3 text-xl sm:text-2xl text-[#171717] font-medium tracking-tight">
                      <BioWords text={interest.title} />
                    </h3>
                    <ul className="space-y-3 pt-1">
                      {interest.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="font-sans text-sm sm:text-base leading-relaxed text-[#2B353B]">
                          <BioWords text={b} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealBlock>
              ))}
            </div>
          </section>

          {/* SECTION 08: CONTACT & DOSSIER (Direct Correspondence Suite) */}
          <section id="contact" className="relative pb-24 sm:pb-36">
            <RevealBlock variant="section">
              <FloatingSectionHeader
                sectionId="contact"
                title="Direct correspondence"
                description="Open for B2B development, international logistics coordination, and strategic business inquiries."
              />
            </RevealBlock>

            <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
              {/* Email Editorial Action */}
              <div className="lg:col-span-6 space-y-4">
                <div className="font-mono text-xs uppercase tracking-widest text-[#52595E]">
                  Electronic Mail
                </div>
                <div>
                  <a
                    href={CV_DATA.emailHref}
                    className="font-sans text-2xl sm:text-3xl lg:text-4xl text-[#171717] font-medium tracking-tight hover:text-[#3E5666] transition-colors underline underline-offset-8 decoration-1 decoration-[#171717]/30 hover:decoration-[#3E5666]"
                  >
                    {CV_DATA.email}
                  </a>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleCopyEmail}
                    className="font-mono text-xs uppercase tracking-wider text-[#52595E] hover:text-[#171717] transition-colors inline-flex items-center gap-2"
                  >
                    <span>{copiedEmail ? '[ Copied to clipboard ]' : '[ Copy address ]'}</span>
                  </button>
                </div>
              </div>

              {/* Dossier PDF Action */}
              <div className="lg:col-span-6 space-y-4">
                <div className="font-mono text-xs uppercase tracking-widest text-[#52595E]">
                  Curriculum Vitae Dossier
                </div>
                <h3 className="ocean-h3 text-xl sm:text-2xl text-[#171717] font-medium tracking-tight">
                  <BioWords text="Original English CV PDF" />
                </h3>
                <p className="font-mono text-xs text-[#52595E] tracking-wide">
                  <BioWords text="Engl CV Xavier Hery.pdf · official document" />
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setCvModalOpen(true)}
                    className="px-5 py-3 border border-[#171717]/25 hover:border-[#171717] transition-colors text-[#171717] font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Preview Document
                  </button>
                  <button
                    onClick={handleDownloadOriginalCv}
                    className="px-6 py-3 bg-[#B6C5B0] hover:bg-[#9BB4B5] transition-colors text-[#171717] font-mono text-xs font-medium uppercase tracking-wider inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Closing Editorial Accent */}
            <div className="mt-24 pt-12 border-t border-[#171717]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <p className="font-serif italic text-base sm:text-lg text-[#52595E]">
                Based in Europe · Operating globally across shifting currents.
              </p>
              <p className="font-mono text-[11px] text-[#52595E]/80 tracking-widest uppercase">
                XAVIER HERY · PORTFOLIO MMXXVI
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* CV Modal Preview — Embeds the exact original Engl CV Xavier Hery.pdf */}
      {cvModalOpen && (
        <div
          onClick={() => setCvModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#171717]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F5F3EE] border border-[#171717] w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl"
          >
            <div className="px-4 sm:px-6 py-3.5 bg-[#171717] text-[#F5F3EE] flex justify-between items-center gap-3">
              <span className="font-mono text-xs truncate">{ORIGINAL_CV_FILENAME}</span>
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
                  onClick={handleDownloadOriginalCv}
                  className="px-3 py-1.5 bg-[#B6C5B0] hover:bg-[#9BB4B5] transition-colors text-[#171717] font-mono text-[13px] font-semibold inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => setCvModalOpen(false)}
                  aria-label="Close CV preview"
                  className="p-1 text-[#F5F3EE] hover:text-[#9BB4B5] transition-colors"
                >
                  <X className="w-5 h-5" />
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
