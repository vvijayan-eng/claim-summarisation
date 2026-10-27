from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class ClaimDocument(Base):
    __tablename__ = "claim_documents"

    id = Column(Integer, primary_key=True, index=True)
    claim_id = Column(Integer, ForeignKey("claims.id"), nullable=False, index=True)
    
    file_name = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)  # PDF, JPG, PNG, TIFF, DOCX, TXT
    document_category = Column(String(100), default="Supporting Document")
    # Categories: Police Report, Repair Estimate, Invoice, ID Proof, Medical Record, Policy Schedule, Photo Evidence
    
    file_size_bytes = Column(Integer, default=0)
    file_path = Column(String(500), nullable=True)
    storage_url = Column(String(500), nullable=True)
    
    # OCR & Extraction
    ocr_raw_text = Column(Text, nullable=True)
    extracted_fields = Column(JSON, nullable=True)  # Structured keys: { invoice_no, vendor_name, total_amount, date, etc. }
    ocr_confidence = Column(Float, default=0.95)
    processing_status = Column(String(50), default="Completed")  # Pending, Processing, Completed, Failed
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    claim = relationship("Claim", back_populates="documents")
