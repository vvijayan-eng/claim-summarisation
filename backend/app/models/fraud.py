from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class FraudIndicator(Base):
    __tablename__ = "fraud_indicators"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    
    indicator_code = Column(String(50), nullable=False) # e.g. FRD-DUP-01, FRD-EDIT-02, FRD-NARR-03, FRD-HIST-04, FRD-AMT-05, FRD-EVID-06
    indicator_name = Column(String(100), nullable=False) # e.g. Conflicting Narratives, Duplicate Submissions, Suspicious Digital Edits
    risk_level = Column(String(20), default="Medium")    # Low, Medium, High
    impact_score = Column(Float, default=15.0)          # Impact to overall 0-100 score
    
    detected_reason = Column(Text, nullable=False)      # Why this triggered
    evidence_pointer = Column(Text, nullable=True)      # Document/field reference
    metadata_context = Column(JSON, nullable=True)      # Additional telemetry/hash/diff
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="fraud_indicators")
