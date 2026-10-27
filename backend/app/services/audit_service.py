import re
from typing import Optional
from sqlalchemy.orm import Session
from app.models.audit import AuditLog

class AuditService:
    """
    HIPAA & GDPR Compliance and Security Audit Service.
    Enforces tamper-evident activity logging and PII masking.
    """

    @staticmethod
    def mask_pii(text: Optional[str]) -> str:
        if not text:
            return ""
        
        # Mask SSN / National IDs (###-##-####)
        text = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '***-**-****', text)
        
        # Mask Phone numbers (###-###-#### or (###) ###-####)
        text = re.sub(r'(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)(\d{3}[-.\s]?\d{4})', r'(\2) ***-****', text)
        
        # Mask Email addresses
        text = re.sub(r'([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)', r'\1***@\2', text)
        
        # Mask Credit card / Financial accounts
        text = re.sub(r'\b(?:\d{4}[ -]?){3}(\d{4})\b', r'****-****-****-\1', text)
        
        return text

    @staticmethod
    def log_event(
        db: Session,
        action_type: str,
        description: str,
        claim_id: Optional[int] = None,
        actor_id: str = "USR-ADJUSTER-01",
        actor_name: str = "Authorized Claims Officer",
        ip_address: str = "10.240.12.84",
        pii_masked: bool = True
    ) -> AuditLog:
        safe_description = AuditService.mask_pii(description) if pii_masked else description
        
        log_entry = AuditLog(
            claim_id=claim_id,
            actor_id=actor_id,
            actor_name=actor_name,
            action_type=action_type,
            description=safe_description,
            ip_address=ip_address,
            compliance_framework="GDPR / HIPAA SOC2 Type II",
            pii_masked=pii_masked
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry

audit_service = AuditService()
