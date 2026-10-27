from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=True, index=True)
    
    actor_id = Column(String(100), default="SYSTEM_AI")
    actor_name = Column(String(255), default="Automated Claims Engine")
    action_type = Column(String(100), nullable=False) # e.g. OCR_EXTRACTION, AI_SUMMARIZE, RULE_EVALUATION, STATUS_UPDATE, PII_ACCESSED
    
    description = Column(Text, nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    compliance_framework = Column(String(50), default="GDPR / HIPAA SOC2")
    pii_masked = Column(Boolean, default=True)
    
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="audit_logs")
