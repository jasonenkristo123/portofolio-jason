import type { ProfileData, Project, TechItem, ExperienceItem } from '../types/portfolio';

export const profileData: ProfileData = {
  name: 'Jason Enkristo',
  tagline: 'Full-Stack Web Developer',
  education: 'Information Technology, Brawijaya University',
  status: 'Available for Engineering Roles & Projects',
  bio: 'Informatics engineering undergraduate focused on building end-to-end web platforms and mobile applications with resilient architecture, clean code, and Linux-driven workflows.',
  experienceStart: 'Active Developer',
  avatarUrl: '/foto-jason.jpeg',
  interests: [
    'Web Architecture',
    'Mobile Systems',
    'Linux Ecosystem',
    'Software Reliability',
    'Reactive Interfaces'
  ],
  contact: {
    email: 'jasonenkristo@gmail.com',
    github: 'https://github.com/jasonenkristo123',
    linkedin: 'https://linkedin.com/in/jasonenkristo',
    location: 'Indonesia'
  }
};

export const techStackData: TechItem[] = [
  // client interface layer
  {
    name: 'TypeScript',
    category: 'frontend',
    layer: 'client',
    iconKey: 'typescript',
    color: '#3178C6',
    roleTag: 'Type Contracts',
    usageContext: 'Type-safe contracts across full-stack applications and component props',
    projectLinks: ['cimart', 'kalorin-ai']
  },
  {
    name: 'React',
    category: 'frontend',
    layer: 'client',
    iconKey: 'react',
    color: '#0284c7',
    roleTag: 'Component UI',
    usageContext: 'Component-driven UI, state management, custom hooks, and interactive flows',
    projectLinks: ['cimart', 'kalorin-ai']
  },
  {
    name: 'Next.js',
    category: 'frontend',
    layer: 'client',
    iconKey: 'nextdotjs',
    color: '#0f172a',
    roleTag: 'App Framework',
    usageContext: 'Server-side rendering, static generation, and edge routing',
    projectLinks: ['cimart']
  },
  {
    name: 'Tailwind CSS v4',
    category: 'frontend',
    layer: 'client',
    iconKey: 'tailwindcss',
    color: '#06b6d4',
    roleTag: 'Design Tokens',
    usageContext: 'Modern utility-first styling, design tokens, and fluid responsive layouts',
    projectLinks: ['cimart', 'kalorin-ai']
  },
  {
    name: 'JavaScript',
    category: 'frontend',
    layer: 'client',
    iconKey: 'javascript',
    color: '#eab308',
    roleTag: 'Scripting Core',
    usageContext: 'Core web scripting, DOM events, and asynchronous event loops',
    projectLinks: ['cimart']
  },

  // backend engine layer
  {
    name: 'Laravel',
    category: 'backend',
    layer: 'backend',
    iconKey: 'laravel',
    color: '#ef4444',
    roleTag: 'MVC & REST Engine',
    usageContext: 'Robust REST APIs, Inertia backend routing, authentication, and transaction handling',
    projectLinks: ['cimart']
  },
  {
    name: 'Node.js',
    category: 'backend',
    layer: 'backend',
    iconKey: 'nodejs',
    color: '#22c55e',
    roleTag: 'Server Runtime',
    usageContext: 'High-throughput microservices, real-time WebSockets, and build automation tooling',
    projectLinks: ['kalorin-ai']
  },

  {
    name: 'PostgreSQL',
    category: 'backend',
    layer: 'database',
    iconKey: 'postgresql',
    color: '#2563eb',
    roleTag: 'Relational Core',
    usageContext: 'Relational data modeling, complex queries, indexing, and transactional integrity',
    projectLinks: ['kalorin-ai']
  },
  {
    name: 'Supabase',
    category: 'backend',
    layer: 'database',
    iconKey: 'supabase',
    color: '#10b981',
    roleTag: 'Cloud Postgres & Auth',
    usageContext: 'Managed Postgres backend, row-level security policies, real-time subscriptions, and auth',
    projectLinks: ['kalorin-ai']
  },
  {
    name: 'MySQL',
    category: 'backend',
    layer: 'database',
    iconKey: 'mysql',
    color: '#0284c7',
    roleTag: 'Transactional DB',
    usageContext: 'E-commerce relational database schemas, ACID transactions, and optimized indexing',
    projectLinks: ['cimart']
  },
  {
    name: 'Prisma ORM',
    category: 'backend',
    layer: 'database',
    iconKey: 'prisma',
    color: '#6366f1',
    roleTag: 'Type-Safe ORM',
    usageContext: 'Type-safe database migrations, declarative schema modeling, and optimized queries',
    projectLinks: ['kalorin-ai']
  },

  // infrastructure and devops layer
  {
    name: 'Linux',
    category: 'tools',
    layer: 'devops',
    iconKey: 'linux',
    color: '#eab308',
    roleTag: 'System OS',
    usageContext: 'Primary Unix environment, Bash scripting, system service management, and workflow',
    projectLinks: ['cimart', 'villanakey', 'kalorin-ai']
  },
  {
    name: 'Docker',
    category: 'tools',
    layer: 'devops',
    iconKey: 'docker',
    color: '#0284c7',
    roleTag: 'Containerization',
    usageContext: 'Containerized deployment, multi-stage builds, and consistent staging environments',
    projectLinks: ['cimart']
  },
  {
    name: 'Git',
    category: 'tools',
    layer: 'devops',
    iconKey: 'git',
    color: '#f97316',
    roleTag: 'Version Control',
    usageContext: 'Version control, feature branching workflows, code reviews, and CI/CD pipelines',
    projectLinks: ['cimart', 'villanakey', 'kalorin-ai']
  },
  {
    name: 'Vercel',
    category: 'tools',
    layer: 'devops',
    iconKey: 'vercel',
    color: '#0f172a',
    roleTag: 'Edge Deployment',
    usageContext: 'Edge deployment, continuous integration, and global CDN delivery for web apps',
    projectLinks: ['kalorin-ai']
  }
];

export const projectsData: Project[] = [
  {
    id: 'simaba',
    title: 'SIMABA FILKOM UB',
    subtitle: 'Official Student Orientation & Management Platform for FILKOM UB',
    category: 'frontend',
    summary: 'The official platform for FILKOM UB\'s New Student Campus Life Introduction (PKKMB) and Startup Academy, supporting attendance, assignments, and committee administration.',
    description: 'A high-performance interactive web application designed to support the complete FILKOM UB student orientation program. It provides a unified portal for assignment submissions, QR code-based attendance, interactive learning materials, and consistent student data management through an administrative dashboard.',
    architecture: [
      'Modern front-end architecture built with the Next.js App Router, React 19, and TypeScript',
      'Distributed global state management with Zustand for efficient data flow and UI state handling',
      'Automated asynchronous data fetching, caching, and REST API integration with TanStack Query',
      'High-accuracy, camera-based attendance using the ZXing QR code scanner',
      'Interactive content and interface design featuring GSAP animation, PDF page-flip effects with React PageFlip, and Canvas Confetti',
      'Complex tabular data management in the administrative dashboard with TanStack Table',
      'Serwist-powered Progressive Web App support for fast loading and reliable caching',
      'Structured forms and strict schema validation with React Hook Form and Zod'
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Zustand',
      'TanStack Query',
      'TanStack Table',
      'GSAP',
      'ZXing QR Scanner',
      'NextAuth.js',
      'React PDF',
      'React PageFlip',
      'React Hook Form',
      'Zod',
      'Shadcn UI'
    ],
    highlights: [
      'The primary digital platform for FILKOM UB orientation, serving thousands of new students and committee members',
      'Real-time, browser-based QR code scanning for rapid attendance verification',
      'An immersive user experience with fluid GSAP animation and interactive PDF previews'
    ],
    challenges: 'Integrating media and QR scanning libraries alongside complex PDF rendering in a Next.js and React 19 environment, while maintaining responsive GSAP animation across a wide range of student devices.',
    role: 'Front-End Developer',
    demoUrl: 'https://simaba-filkom.ub.ac.id',
    isPrivateRepo: true,
    privateRepoReason: 'Private repository due to institutional copyright and data confidentiality requirements',
    imageUrl: '/projects/simaba.png',
    imageFit: 'cover',
    featured: true,
    metrics: [
      { label: 'Framework', value: 'Next.js 16 (React 19)' },
      { label: 'State & Query', value: 'Zustand & TanStack Query' },
      { label: 'Features', value: 'QR Attendance & Assignments' }
    ]
  },
  {
    id: 'equalilearn',
    title: 'EqualiLearn',
    subtitle: 'AI-Powered Inclusive Learning & Collaborative Study Platform',
    category: 'frontend',
    summary: 'An AI-powered inclusive learning platform featuring live transcription, PPT-to-audio conversion, interactive mind maps, and collaborative study rooms powered by WebSockets.',
    description: 'An accessible educational web application designed to support inclusive learning for diverse learning needs. EqualiLearn converts presentation files into audio and interactive mind maps, provides real-time transcription to improve accessibility, and offers live collaborative study rooms for group discussion.',
    architecture: [
      'Modern front-end architecture built with the Next.js App Router, React 19, and TypeScript',
      'Interactive node-based mind maps generated from AI-extracted presentation content with @xyflow/react',
      'Real-time group chat and collaboration in study rooms through WebSocket integration',
      'Live transcription and PPT-to-audio data flows managed through REST APIs and TanStack Query',
      'Centralized global state management with Zustand for interface navigation and learning modules',
      'Adaptive interfaces built with Tailwind CSS v4, Base UI, Shadcn UI, and subtle GSAP micro-interactions',
      'Fast, consistent linting and formatting with Biome and Git hooks managed by Lefthook'
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'XYFlow (React Flow)',
      'Zustand',
      'TanStack Query',
      'WebSockets',
      'GSAP',
      'Base UI',
      'Shadcn UI',
      'Biome',
      'React Hook Form',
      'Zod'
    ],
    highlights: [
      'Real-time transcription that supports inclusive and accessible learning',
      'Automatic generation of interactive mind maps from presentation files using XYFlow',
      'WebSocket-powered collaborative study rooms for real-time interaction and discussion'
    ],
    challenges: 'Building dynamic XYFlow mind-map visualizations from AI-processed content while precisely synchronizing live transcription state and WebSocket messages within a two-person front-end team.',
    role: 'Front-End Developer',
    githubUrl: 'https://github.com/jasonenkristo123/EqualiLearn',
    isMobileApp: false,
    demoStatusLabel: 'Native Mobile Application (Demo/APK available on request)',
    imageUrl: '/projects/equalilearn.png',
    imageFit: 'cover',
    featured: true,
    metrics: [
      { label: 'Domain', value: 'AI EdTech & Accessibility' },
      { label: 'Visualization', value: 'XYFlow Node Mindmap' },
      { label: 'Real-time', value: 'WebSocket Collaboration' }
    ]
  },
  {
    id: 'simpanin',
    title: 'SIMPANINID',
    subtitle: 'Food Waste Tracking & Visual Analytics Platform',
    category: 'frontend',
    summary: 'A food waste tracking and management platform with a visual analytics dashboard designed to help users reduce unnecessary food waste.',
    description: 'A web application for managing and monitoring food waste in support of more sustainable lifestyles. Developed by a four-person team, the platform enables users to record food inventory, track savings over time, and analyze accumulated waste and recurring trends through interactive charts.',
    architecture: [
      'Modern front-end architecture built with the Next.js App Router, React 19, and TypeScript',
      'Interactive analytics dashboards built with Chart.js and react-chartjs-2 to visualize food waste data',
      'Efficient centralized state management with Zustand for user filters and preferences',
      'Optimized asynchronous data fetching and REST API state management with TanStack Query and Axios',
      'Fluid, dynamic UI interactions combining GSAP (@gsap/react) and Framer Motion',
      'Structured food waste entry forms validated with React Hook Form and Zod',
      'Automated code quality and consistency through Husky-powered Git hooks, ESLint, and Prettier'
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Chart.js',
      'react-chartjs-2',
      'Zustand',
      'TanStack Query',
      'GSAP',
      'Framer Motion',
      'Shadcn UI',
      'React Hook Form',
      'Zod',
      'Husky'
    ],
    highlights: [
      'An interactive dashboard for visualizing food waste statistics',
      'A responsive user experience enhanced by fluid GSAP and Framer Motion animation',
      'Collaborative development by a four-person team using a disciplined Git hooks workflow'
    ],
    challenges: 'Presenting REST API analytics through intuitive, responsive charts while combining GSAP and Framer Motion without compromising interface performance.',
    role: 'Front-End Developer',
    githubUrl: 'https://github.com/jasonenkristo123/SIMPANINID',
    demoUrl: 'https://simpaninid-alpha.vercel.app/',
    imageUrl: '/projects/simpanin.png',
    imageFit: 'cover',
    featured: true,
    metrics: [
      { label: 'Domain', value: 'Food Waste Tracker' },
      { label: 'Analytics', value: 'Chart.js Visuals' },
      { label: 'Team Size', value: '4 Engineers' }
    ]
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: 'edu-brawijaya',
    period: 'Aug 2025 - Present',
    role: 'Bachelor of Information Technology',
    organization: 'Universitas Brawijaya',
    badge: 'Formal Education',
    category: 'education',
    description:
      'Pursuing an undergraduate degree in the Faculty of Computer Science, with a strong foundation in software engineering, data structures, algorithms, and database design for modern application development.',
    highlights: [
      'Software Engineering & Web Development',
      'Data Structures, Algorithms, & Object-Oriented Programming',
      'Relational Database Design & Optimization'
    ],
    tech: [
      'Software Engineering',
      'Data Structures',
      'Algorithms',
      'Database Systems',
      'System Design',
      'Web Development'
    ]
  },
  {
    id: 'exp-bcc',
    period: 'April 2026 - Present',
    role: 'Front-End Developer & Lead of Starter Camp',
    organization: 'Basic Computing Community (BCC)',
    badge: 'Campus Organization',
    category: 'Organization',
    description:
      'Contributing to modern web interface development within BCC\'s Front-End Department. Appointed Program Lead for Frontend Starter Camp, mentoring first-year students in the web development ecosystem while regularly participating in internal technical workshops on front-end best practices.',
    highlights: [
      'Program Lead for Frontend Starter Camp for First-Year Students',
      'Intensive Development and Study of the Modern Front-End Ecosystem',
      'Collaborative Projects and Internal Department Workshops'
    ],
    tech: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'JavaScript',
      'HTML/CSS',
      'Git',
      'GSAP',
      'Tanstack Query',
      'Shadcn UI',
      'Axios',
      'Zustand',
      'React Hook Form',
      'Zod'
    ]
  },
  {
    id: 'exp-simaba',
    period: 'May 2026 - Present',
    role: 'Front-End Developer',
    organization: 'PKKMB & Startup Academy FILKOM UB 2026',
    badge: 'Campus Committee',
    category: 'project',
    description:
      'Responsible for architecting and developing the interface for FILKOM UB\'s official student orientation platform, SIMABA, within the Publication, Information, and Technology (PIT) Division. Delivered QR code-based attendance, a student assignment portal, a committee administration dashboard, and interactive GSAP animation.',
    highlights: [
      'SIMABA 2026 Publication, Information, and Technology (PIT) Division',
      'QR Code Attendance System & Student Assignment Management Dashboard',
      'Website Interface Development with GSAP & Next.js 16'
    ],
    tech: [
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Zustand',
      'GSAP',
      'TanStack Query',
      'ZXing QR Scanner',
      'Docker'
    ]
  },
];
