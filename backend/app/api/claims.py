from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.claim import Claim
from app.models.document import ClaimDocument
from app.models.validation import ValidationResult
from app.models.fraud import FraudIndicator
from app.models.audit import AuditLog
from app.schemas.claim_schemas import (
    ClaimOut, 
    ClaimCreate, 
    ClaimUpdateStatus, 
    ClaimAddNotes,
    AuditLogOut
)
from app.services.validation_engine import validation_engine
from app.services.fraud_scoring import fraud_scoring_engine
from app.services.ai_summarizer import ai_summarizer
from app.services.audit_service import audit_service

router = APIRouter(prefix="/claims", tags=["Claims"])

@router.get("", response_model=List[ClaimOut])
def get_claims(
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    policy_type: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(Claim)
    
    if status and status != "All":
        query = query.filter(Claim.status == status)
    if risk_level and risk_level != "All":
        query = query.filter(Claim.risk_level == risk_level)
    if policy_type and policy_type != "All":
        query = query.filter(Claim.policy_type == policy_type)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Claim.claim_number.ilike(search_fmt)) |
            (Claim.customer_name.ilike(search_fmt)) |
            (Claim.policy_number.ilike(search_fmt))
        )
        
    return query.order_by(Claim.created_at.desc()).offset(skip).limit(limit).all()

@router.get("/{claim_id}", response_model=ClaimOut)
def get_claim_by_id(claim_id: int, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim

@router.post("", response_model=ClaimOut)
def create_claim(payload: ClaimCreate, db: Session = Depends(get_db)):
    # Generate unique claim number
    c_num = f"CLM-2026-{datetime.utcnow().strftime('%m%d%H%M%S')}"
    
    claim = Claim(
        claim_number=c_num,
        policy_number=payload.policy_number,
        policy_type=payload.policy_type,
        customer_name=f"[SYNTHETIC TEST DATA] {payload.customer_name}" if "SYNTHETIC" not in payload.customer_name else payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
        customer_id_number=payload.customer_id_number,
        incident_date=payload.incident_date,
        incident_type=payload.incident_type,
        incident_location=payload.incident_location,
        incident_description=payload.incident_description,
        estimated_loss=payload.estimated_loss,
        deductible=payload.deductible,
        region=payload.region,
        status="Uploaded"
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    
    audit_service.log_event(
        db,
        action_type="CLAIM_CREATED",
        description=f"New claim #{claim.claim_number} filed for policy #{claim.policy_number}",
        claim_id=claim.id
    )
    
    return claim

@router.put("/{claim_id}/status", response_model=ClaimOut)
def update_claim_status(claim_id: int, payload: ClaimUpdateStatus, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    old_status = claim.status
    claim.status = payload.status
    if payload.notes:
        claim.adjuster_notes = f"{claim.adjuster_notes or ''}\n[{datetime.utcnow().strftime('%Y-%m-%d %H:%M')}] {payload.notes}".strip()
    
    db.commit()
    db.refresh(claim)
    
    audit_service.log_event(
        db,
        action_type="STATUS_UPDATE",
        description=f"Status transitioned from '{old_status}' to '{payload.status}'. Notes: {payload.notes or 'None'}",
        claim_id=claim.id,
        actor_name=payload.adjuster_name or "Claims Adjuster"
    )
    return claim

@router.put("/{claim_id}/notes", response_model=ClaimOut)
def add_claim_notes(claim_id: int, payload: ClaimAddNotes, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    stamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
    claim.adjuster_notes = f"{claim.adjuster_notes or ''}\n[{stamp} by {payload.adjuster_name}] {payload.notes}".strip()
    
    db.commit()
    db.refresh(claim)
    
    audit_service.log_event(
        db,
        action_type="NOTE_ADDED",
        description=f"Adjuster note recorded: {payload.notes}",
        claim_id=claim.id,
        actor_name=payload.adjuster_name or "Claims Adjuster"
    )
    return claim

@router.post("/{claim_id}/escalate", response_model=ClaimOut)
def escalate_claim(claim_id: int, reason: str = Query(..., description="Escalation rationale"), db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    claim.status = "Escalated"
    stamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
    claim.adjuster_notes = f"{claim.adjuster_notes or ''}\n[{stamp} ESCALATED TO SIU] Reason: {reason}".strip()
    
    db.commit()
    db.refresh(claim)
    
    audit_service.log_event(
        db,
        action_type="CLAIM_ESCALATED",
        description=f"Claim escalated to Special Investigation Unit (SIU). Rationale: {reason}",
        claim_id=claim.id
    )
    return claim

@router.get("/{claim_id}/audit-logs", response_model=List[AuditLogOut])
def get_claim_audit_logs(claim_id: int, db: Session = Depends(get_db)):
    return db.query(AuditLog).filter(AuditLog.claim_id == claim_id).order_by(AuditLog.timestamp.desc()).all()
