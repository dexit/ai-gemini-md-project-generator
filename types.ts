export interface ProjectSpec {
  projectName: string;
  projectType: string;
  goal: string;
  coreFeatures: string[];

  // Tech Stack Breakdown
  phpVersion: string;
  framework: string;
  webServer: string[];
  database: string;
  frontendStack: string[];

  // PHP Specifics
  composerPackages: string[];
  psrStandards: string[];

  // Architecture
  databaseLayer: string;
  useMigrations: boolean;
  authMethod: string;
  designPatterns: string[];

  // Advanced Architecture
  cachingLayer: string;
  queueSystem: string;
  monologChannels: string[];
  useApiRateLimiting: boolean;
  isApiFirst: boolean;

  // Development
  keyCommands: string[];
  
  // AI Generation Settings
  model: string;
  temperature: number;
  topP: number;
  enableThinking: boolean;
}

export interface DebugInfo {
  prompt: string;
  config: object;
  rawResponse: string;
}

export interface GenerationResult {
  plan: string;
  prompt: string;
  config: object;
}

export interface HistoryItem {
  id: string; // Using ISO timestamp string as a unique ID
  spec: ProjectSpec;
  plan: string;
  timestamp: string; // ISO string
}
