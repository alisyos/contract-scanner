export type ContractType = 'auto' | 'general_sale' | 'service' | 'real_estate' | 'employment' | 'nda' | 'other';
export type AnalysisFocus = 'unfavorable_terms' | 'ambiguity' | 'legal_risk' | 'performance_timeline' | 'termination_liquidated_damages';
export type Jurisdiction = 'KR' | 'US' | 'EU' | 'JP' | 'CN' | 'OTHERS';
export type Language = 'auto' | 'ko' | 'en' | 'ja' | 'zh';
export type ReportFormat = 'brief' | 'detailed' | 'negotiation_points';
export type PartyRole = 'buyer' | 'seller' | 'service_provider' | 'client' | 'employer' | 'employee' | 'other';
export type AnalysisPerspective = 'neutral' | 'party_a' | 'party_b' | 'buyer' | 'seller' | 'service_provider' | 'client' | 'employer' | 'employee';
export type Severity = 'high' | 'medium' | 'low' | 'none';
export type Confidence = 'high' | 'medium' | 'low';
export type Priority = 'high' | 'medium' | 'low';
export type Status = 'completed' | 'error';

export interface FileInfo {
  name: string;
  mimeType: string;
  size: number;
  storageKey: string;
}

export interface NotificationSettings {
  show_in_app: boolean;
  email?: string;
}

export interface ContractMeta {
  contract_title?: string;
  party_role?: PartyRole;
  counterparty_name?: string;
  effective_date?: string;
  end_date?: string;
  currency?: string;
  total_value?: number;
}

export interface ContractAnalysisRequest {
  contract_file: FileInfo;
  contract_type: ContractType;
  analysis_focus: AnalysisFocus[];
  analysis_perspective: AnalysisPerspective;
  jurisdiction: Jurisdiction;
  language: Language;
  report_format: ReportFormat;
  reference_docs?: FileInfo[];
  additional_terms_text?: string;
  meta?: ContractMeta;
}

export interface KeyFinding {
  type: AnalysisFocus;
  title: string;
  severity: Severity;
  confidence: Confidence;
  reason: string;
  clause_excerpt: string;
  clause_location: {
    page?: number | null;
    section?: string | null;
    paragraph?: string | null;
  };
}

export interface ReportItem {
  label: string;
  detail: string;
  recommendation?: string | null;
  suggested_rewrite?: string | null;
}

export interface ReportSection {
  heading: string;
  items: ReportItem[];
}

export interface NegotiationPoint {
  issue: string;
  impact: string;
  priority: Priority;
  suggested_rewrite: string;
  rationale: string;
}

export interface AlignmentMismatch {
  topic: string;
  deviation: string;
  risk: string;
  suggested_fix: string;
}

export interface ContractAnalysisResponse {
  jobId: string;
  status: Status;
  summary: {
    risk_score: number;
    risk_breakdown: {
      unfavorable_terms: number;
      ambiguity: number;
      legal_risk: number;
      performance_timeline: number;
      termination_liquidated_damages: number;
    };
    key_findings: KeyFinding[];
  };
  report: {
    format: ReportFormat;
    sections: ReportSection[];
    downloadUrl?: string | null;
  };
  negotiation_points?: NegotiationPoint[];
  alignment_with_reference?: {
    has_reference: boolean;
    notes: string;
    mismatches: AlignmentMismatch[];
  };
  meta: {
    input_echo: {
      contract_type: string;
      jurisdiction: string;
      language: string;
      analysis_focus: string[];
      notification: NotificationSettings;
    };
    contract_overview: {
      title?: string | null;
      parties?: {
        this_party_role?: string | null;
        counterparty_name?: string | null;
      };
      term?: {
        effective_date?: string | null;
        end_date?: string | null;
      };
      value?: {
        currency?: string | null;
        total_value?: number | null;
      };
    };
    disclaimer: string;
  };
  errors?: Array<{
    code: string;
    message: string;
  }>;
}