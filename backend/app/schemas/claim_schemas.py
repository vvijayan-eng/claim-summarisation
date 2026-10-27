from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class DocumentBase(BaseModel):
    file_name: str
    file_type: str
    document_category: str = "Supporting Document"

class DocumentCreate(DocumentBase):
    pass

class DocumentOut(DocumentBase):
    id: int
    claim_id: int
    file_size_bytes: int
    storage_url: Optional[str] = None
    extracted_fields: Optional[Dict[str, Any]] = None
    ocr_confidence: Optional[float] = 0.95
    processing_status: str
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ValidationResultOut(BaseModel):
    id: int
    claim_id: int
    rule_code: str
    category: str
    severity: str
    status: str
    issue_detected: str
    explanation: str
    confidence_score: float
    suggested_action: str
    is_resolved: bool
    resolved_by: Optional[str] = None
    resolution_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FraudIndicatorOut(BaseModel):
    id: int
    claim_id: int
    indicator_code: str
    indicator_name: str
    risk_level: str
    impact_score: float
    detected_reason: str
    evidence_pointer: Optional[str] = None
    metadata_context: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: int
    claim_id: Optional[int] = None
    actor_id: str
    actor_name: str
    action_type: str
    description: str
    ip_address: str
    compliance_framework: str
    pii_masked: bool
    timestamp: datetime

    class Config:
        from_attributes = True

class ClaimBase(BaseModel):
    policy_number: str
    policy_type: str = "Auto"
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_id_number: Optional[str] = None
    incident_date: datetime
    incident_type: str
    incident_location: Optional[str] = None
    incident_description: Optional[str] = None
    estimated_loss: float = 0.0
    deductible: float = 500.0
    region: str = "North America - East"

class ClaimCreate(ClaimBase):
    pass

class ClaimUpdateStatus(BaseModel):
    status: str
    notes: Optional[str] = None
    adjuster_name: Optional[str] = "Claims Adjuster"

class ClaimAddNotes(BaseModel):
    notes: str
    adjuster_name: Optional[str] = "Claims Adjuster"

class ClaimOut(ClaimBase):
    id: int
    claim_number: str
    claim_filed_date: datetime
    status: str
    risk_level: str
    fraud_score: float
    ai_summary: Optional[Dict[str, Any]] = None
    ai_processing_time_sec: float
    adjuster_review_time_sec: float
    assigned_adjuster: Optional[str] = None
    adjuster_notes: Optional[str] = None
    is_synthetic: bool
    created_at: datetime
    updated_at: datetime
    documents: List[DocumentOut] = []
    validation_results: List[ValidationResultOut] = []
    fraud_indicators: List[FraudIndicatorOut] = []

    class Config:
        from_attributes = True

class ClaimSummarySection(BaseModel):
    executive_summary: str
    incident_description: str
    claimed_damage: str
    financial_summary: Dict[str, Any]
    missing_information: List[str]
    risk_indicators: List[str]
    recommended_actions: List[str]

class AnalyticsKPIs(BaseModel):
    total_claims: int
    processing_time_avg_hours: float
    ai_review_time_avg_min: float
    adjuster_review_time_avg_min: float
    validation_accuracy_pct: float
    fraud_alerts_count: int
    avg_settlement_duration_days: float
    claims_by_status: Dict[str, int]
    claims_by_type: Dict[str, int]
    claims_by_region: Dict[str, int]
    fraud_heatmap: List[Dict[str, Any]]
    sla_compliance_pct: float
