export interface ProcessedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  arrayBuffer: ArrayBuffer;
  hexPreview: string; // First N bytes
  binaryString: string; // First N bytes
  cArray: string;
  base64: string;
  smartScript?: string; // Cache the AI result
}

export enum TabOption {
  BINARY = 'BINARY',
  PYTHON_RAW = 'PYTHON_RAW',
  PYTHON_SMART = 'PYTHON_SMART',
  C_ARRAY = 'C_ARRAY',
  BASE64 = 'BASE64'
}

export interface AnalysisState {
  loading: boolean;
  content: string | null;
  error: string | null;
}

// New Types for Neural Nexus
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface NeuralGem {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  icon: string;
  color: string;
}

export enum AppModule {
  DASHBOARD = 'DASHBOARD',
  CONVERTER = 'CONVERTER',
  NEURAL_NEXUS = 'NEURAL_NEXUS'
}