export type RiskLevel = 'SAFE' | 'CAUTION' | 'DANGER';

export interface UserProfile {
  conditions: string[];
}

export interface AnalysisResult {
  level: RiskLevel;
  summary: string;
  details: string;
  ingredients: string[];
}
