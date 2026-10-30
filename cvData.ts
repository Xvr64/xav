// ============================================================================
// STRICT FACTUAL DATA SOURCE — EXTRACTED VERBATIM FROM "Engl CV Xavier Hery.pdf"
// ============================================================================

export interface ExperienceItem {
  id: string;
  index: string;
  company: string;
  role: string;
  date: string;
  concisePoints: string[];
  verbatimPoints: string[];
  domainTag: string;
}

export interface LocationItem {
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

export interface SkillCategory {
  id: string;
  index: string;
  title: string;
  verbatimSummary: string;
  items: {
    name: string;
    classification: string;
  }[];
}

export interface EducationItem {
  id: string;
  index: string;
  institution: string;
  verbatimInstitution: string;
  degree?: string;
  date: string;
  highlights?: string[];
  locationLabel: string;
}

export interface LanguageItem {
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

export interface InterestCategory {
  id: string;
  index: string;
  title: string;
  bullets: string[];
  verbatimNote: string;
  namedEntities?: string[];
}

export const CV_DATA = {
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
