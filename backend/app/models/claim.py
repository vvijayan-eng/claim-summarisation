from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String(50), unique=True, index=True, nullable=False)
    policy_number = Column(String(50), index=True, nullable=False)
    policy_type = Column(String(50), default="Auto")  # Auto, Property, Health, Travel
    
    # Customer Info
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=True)
    customer_phone = Column(String(50), nullable=True)
    customer_id_number = Column(String(100), nullable=True)
    
    # Incident Details
    incident_date = Column(DateTime, nullable=False)
    claim_filed_date = Column(DateTime, default=datetime.utcnow)
    incident_type = Column(String(100), nullable=False)  # Collision, Hail Damage, Water Leak, ER Visit, Flight Cancellation
    incident_location = Column(String(255), nullable=True)
    incident_description = Column(Text, nullable=True)
    
    # Financials
    estimated_loss = Column(Float, default=0.0)
    approved_amount = Column(Float, nullable=True)
    deductible = Column(Float, default=500.0)
    
    # Status & Workflow
    status = Column(String(50), default="Uploaded", index=True)
    # Statuses: Uploaded, Processing, Under Review, Validation Failed, Approved, Escalated, Closed
    
    # AI Assessments
    risk_level = Column(String(20), default="Low")  # Low, Medium, High
    fraud_score = Column(Float, default=0.0)  # 0 to 100
    ai_summary = Column(JSON, nullable=True)  # Structured summary
    ai_processing_time_sec = Column(Float, default=0.0)
    adjuster_review_time_sec = Column(Float, default=0.0)
    
    # Metadata
    assigned_adjuster = Column(String(255), nullable=True)
    adjuster_notes = Column(Text, nullable=True)
    region = Column(String(50), default="North America - East")
    is_synthetic = Column(Boolean, default=True)  # Tagged SYNTHETIC TEST DATA
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    documents = relationship("ClaimDocument", back_populates="claim", cascade="all, delete-orphan")
    validation_results = relationship("ValidationResult", back_populates="claim", cascade="all, delete-orphan")
    fraud_indicators = relationship("FraudIndicator", back_populates="claim", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="claim", cascade="all, delete-orphan")
