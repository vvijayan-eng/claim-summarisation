from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    
    rule_code = Column(String(50), nullable=False)  # e.g. VAL-DOC-001, VAL-DATE-002, VAL-AMT-003, VAL-ID-004, VAL-DUP-005
    category = Column(String(50), nullable=False)   # Missing Document, Date Inconsistency, Amount Mismatch, Identity Mismatch, Duplicate Claim
    severity = Column(String(20), default="Warning") # Info, Warning, Critical
    
    status = Column(String(20), default="Failed")    # Passed, Failed, Needs Review
    issue_detected = Column(String(255), nullable=False)
    explanation = Column(Text, nullable=False)       # Explainable natural language AI explanation
    confidence_score = Column(Float, default=0.90)   # 0.0 - 1.0
    suggested_action = Column(Text, nullable=False)  # Prescriptive adjuster action
    
    is_resolved = Column(Boolean, default=False)
    resolved_by = Column(String(255), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="validation_results")
