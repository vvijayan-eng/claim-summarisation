export type ClaimStatus = 
  | 'Uploaded'
  | 'Processing'
  | 'Under Review'
  | 'Validation Failed'
  | 'Approved'
  | 'Escalated'
  | 'Closed';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type PolicyType = 'Auto' | 'Property' | 'Health' | 'Travel';

export interface DocumentFieldExtraction {
  document_category?: string;
  file_name?: string;
  police_incident_id?: string;
  officer_badge?: string;
  reporting_agency?: string;
  incident_date?: string;
  incident_type?: string;
  vehicle_vin?: string;
  vehicle_make_model?: string;
  shop_name?: string;
  parts_total?: number;
  labor_total?: number;
  total_repair_cost?: number;
  invoice_number?: string;
  vendor_name?: string;
  total_amount?: number;
  provider_name?: string;
  diagnosis_codes?: string[];
  id_number?: string;
  [key: string]: any;
}

export interface ClaimDocument {
  id: number;
  claim_id: number;
  file_name: string;
  file_type: string;
  document_category: string;
  file_size_bytes: number;
  storage_url?: string;
  extracted_fields?: DocumentFieldExtraction;
  ocr_confidence: number;
  processing_status: string;
  uploaded_at: string;
  ocr_raw_text?: string;
}

export interface ValidationResult {
  id: number;
  claim_id: number;
  rule_code: string;
  category: 'Missing Document' | 'Date Inconsistency' | 'Amount Mismatch' | 'Identity Mismatch' | 'Duplicate Claim';
  severity: 'Info' | 'Warning' | 'Critical';
  status: 'Passed' | 'Failed' | 'Needs Review';
  issue_detected: string;
  explanation: string;
  confidence_score: number;
  suggested_action: string;
  is_resolved: boolean;
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface FraudIndicator {
  id: number;
  claim_id: number;
  indicator_code: string;
  indicator_name: string;
  risk_level: 'Low' | 'Medium' | 'High';
  impact_score: number;
  detected_reason: string;
  evidence_pointer?: string;
  metadata_context?: Record<string, any>;
  created_at: string;
}

export interface ClaimAISummary {
  executive_summary: string;
  incident_description: string;
  claimed_damage: string;
  financial_summary: {
    gross_claimed_loss: number;
    policy_deductible: number;
    calculated_net_payable: number;
    currency: string;
    invoice_match_status: string;
    reserve_recommendation: number;
  };
  missing_information: string[];
  risk_indicators: string[];
  recommended_actions: string[];
  risk_level: RiskLevel;
  formatted_text?: string;
}

export interface Claim {
  id: number;
  claim_number: string;
  policy_number: string;
  policy_type: PolicyType;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_id_number?: string;
  incident_date: string;
  claim_filed_date: string;
  incident_type: string;
  incident_location?: string;
  incident_description?: string;
  estimated_loss: number;
  approved_amount?: number;
  deductible: number;
  status: ClaimStatus;
  risk_level: RiskLevel;
  fraud_score: number;
  ai_summary?: ClaimAISummary;
  ai_processing_time_sec: number;
  adjuster_review_time_sec: number;
  assigned_adjuster?: string;
  adjuster_notes?: string;
  region: string;
  is_synthetic: boolean;
  created_at: string;
  updated_at: string;
  documents: ClaimDocument[];
  validation_results: ValidationResult[];
  fraud_indicators: FraudIndicator[];
}

export interface AuditLog {
  id: number;
  claim_id?: number;
  actor_id: string;
  actor_name: string;
  action_type: string;
  description: string;
  ip_address: string;
  compliance_framework: string;
  pii_masked: boolean;
  timestamp: string;
}

export interface AnalyticsKPIs {
  total_claims: number;
  processing_time_avg_hours: number;
  ai_review_time_avg_min: number;
  adjuster_review_time_avg_min: number;
  validation_accuracy_pct: number;
  fraud_alerts_count: number;
  avg_settlement_duration_days: number;
  claims_by_status: Record<string, number>;
  claims_by_type: Record<string, number>;
  claims_by_region: Record<string, number>;
  fraud_heatmap: Array<{
    region: string;
    high_risk: number;
    medium_risk: number;
    low_risk: number;
  }>;
  sla_compliance_pct: number;
}
