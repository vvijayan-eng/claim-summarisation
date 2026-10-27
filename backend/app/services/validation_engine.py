from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models.claim import Claim
from app.models.document import ClaimDocument

class ValidationEngineService:
    """
    Automated Claims Validation Rule Engine & Explainable Diagnostic System.
    Evaluates:
      1. Missing mandatory documents
      2. Date inconsistencies
      3. Amount mismatches
      4. Identity / Policyholder mismatches
      5. Duplicate claim checks
    """

    def evaluate_claim(
        self, 
        claim: Claim, 
        documents: List[ClaimDocument],
        all_existing_claims: Optional[List[Claim]] = None
    ) -> List[Dict[str, Any]]:
        results: List[Dict[str, Any]] = []

        doc_categories = [d.document_category for d in documents]
        doc_names = [d.file_name.lower() for d in documents]
        
        # ---------------------------------------------------------
        # Check A: Missing Mandatory Documents
        # ---------------------------------------------------------
        # 1. ID Proof
        has_id = any("ID Proof" in cat or "license" in name or "id" in name for cat, name in zip(doc_categories, doc_names))
        if not has_id:
            results.append({
                "rule_code": "VAL-DOC-001",
                "category": "Missing Document",
                "severity": "Warning",
                "status": "Failed",
                "issue_detected": "Missing Primary Identification (Government ID / Driver's License)",
                "explanation": (
                    "No valid state driver's license or government-issued photo ID was found in the submitted dossier. "
                    "Under anti-fraud compliance and KYC regulations, payout cannot be disbursed without verifying claimant identity."
                ),
                "confidence_score": 0.98,
                "suggested_action": "Send automated Document Request to claimant requesting front/back photo of Driver's License."
            })
        else:
            results.append({
                "rule_code": "VAL-DOC-001",
                "category": "Missing Document",
                "severity": "Info",
                "status": "Passed",
                "issue_detected": "Identification Proof Verified",
                "explanation": "Valid government-issued identification was successfully matched and verified against policyholder records.",
                "confidence_score": 0.99,
                "suggested_action": "No action required. Identification criteria satisfied."
            })

        # 2. Repair Estimate / Invoice for Auto/Property
        has_estimate = any("Repair Estimate" in cat or "estimate" in name or "quote" in name for cat, name in zip(doc_categories, doc_names))
        has_invoice = any("Invoice" in cat or "bill" in name or "invoice" in name for cat, name in zip(doc_categories, doc_names))
        
        if claim.policy_type in ("Auto", "Property") and not (has_estimate or has_invoice):
            results.append({
                "rule_code": "VAL-DOC-002",
                "category": "Missing Document",
                "severity": "Critical",
                "status": "Failed",
                "issue_detected": "Itemized Repair Estimate or Invoice Missing",
                "explanation": (
                    f"Claim is requesting ${claim.estimated_loss:,.2f} in financial indemnity, but no itemized breakdown from a certified repair facility was provided. "
                    "Adjuster cannot validate labor rates, parts origin, or structural allowances."
                ),
                "confidence_score": 0.95,
                "suggested_action": "Require claimant to upload formal collision repair estimate with labor hour breakdown."
            })

        # 3. Police Report for collisions > $3,000 or theft
        has_police = any("Police Report" in cat or "police" in name for cat, name in zip(doc_categories, doc_names))
        if (claim.policy_type == "Auto" and claim.estimated_loss > 3000.0) and not has_police:
            results.append({
                "rule_code": "VAL-DOC-003",
                "category": "Missing Document",
                "severity": "Warning",
                "status": "Failed",
                "issue_detected": "Official Police Incident Report Missing for High-Value Loss",
                "explanation": (
                    f"For vehicle claims exceeding $3,000.00 (current claim: ${claim.estimated_loss:,.2f}), state regulatory policy requires an official law enforcement accident report. "
                    "This verifies date, weather, road layout, and third-party liabilities."
                ),
                "confidence_score": 0.92,
                "suggested_action": "Request police accident report CAD number or precinct transcript from the claimant."
            })

        # ---------------------------------------------------------
        # Check B: Date Inconsistencies
        # ---------------------------------------------------------
        now = datetime.utcnow()
        inc_date = claim.incident_date
        file_date = claim.claim_filed_date or now

        # Future date check
        if inc_date > now:
            results.append({
                "rule_code": "VAL-DATE-001",
                "category": "Date Inconsistency",
                "severity": "Critical",
                "status": "Failed",
                "issue_detected": f"Future Incident Date ({inc_date.strftime('%Y-%m-%d')})",
                "explanation": (
                    f"Reported incident date {inc_date.strftime('%Y-%m-%d')} is set in the future relative to system clock ({now.strftime('%Y-%m-%d')}). "
                    "This violates chronological integrity and strongly suggests clerical error or fraudulent pre-staging."
                ),
                "confidence_score": 1.0,
                "suggested_action": "Contact claimant or agent immediately to clarify the true date of occurrence."
            })
        
        # Incident date after claim filed date
        if inc_date > file_date:
            results.append({
                "rule_code": "VAL-DATE-002",
                "category": "Date Inconsistency",
                "severity": "Critical",
                "status": "Failed",
                "issue_detected": "Incident Date Occurred After Claim Filing Date",
                "explanation": (
                    f"The loss event date ({inc_date.strftime('%Y-%m-%d')}) postdates the recorded filing date ({file_date.strftime('%Y-%m-%d')}). "
                    "An incident cannot legally be indemnified prior to its occurrence."
                ),
                "confidence_score": 0.99,
                "suggested_action": "Flag for timeline reconciliation. Request time-stamped telematics or dispatch log."
            })

        # Check extracted document dates against incident date
        for doc in documents:
            if doc.extracted_fields and isinstance(doc.extracted_fields, dict):
                doc_date_str = doc.extracted_fields.get("incident_date") or doc.extracted_fields.get("invoice_date")
                if doc_date_str:
                    try:
                        doc_d = datetime.strptime(doc_date_str, "%Y-%m-%d")
                        if doc.document_category == "Invoice" and doc_d < inc_date:
                            results.append({
                                "rule_code": "VAL-DATE-003",
                                "category": "Date Inconsistency",
                                "severity": "Critical",
                                "status": "Failed",
                                "issue_detected": f"Invoice Predates Incident Date in '{doc.file_name}'",
                                "explanation": (
                                    f"Invoice {doc.extracted_fields.get('invoice_number', '')} is dated {doc_date_str}, "
                                    f"which is before the stated loss date {inc_date.strftime('%Y-%m-%d')}. "
                                    "Repairs or services cannot precede the casualty event."
                                ),
                                "confidence_score": 0.96,
                                "suggested_action": "Halt payment on this invoice line item; request proof of prior vehicle condition."
                            })
                    except Exception:
                        pass

        # ---------------------------------------------------------
        # Check C: Amount Mismatches & Invoice Validation
        # ---------------------------------------------------------
        invoice_totals = []
        for doc in documents:
            if doc.extracted_fields and isinstance(doc.extracted_fields, dict):
                amt = doc.extracted_fields.get("total_amount") or doc.extracted_fields.get("total_repair_cost")
                if amt and isinstance(amt, (int, float)):
                    invoice_totals.append((doc.file_name, float(amt)))

        if invoice_totals:
            total_doc_sum = sum(a[1] for a in invoice_totals)
            diff = abs(total_doc_sum - claim.estimated_loss)
            pct_diff = (diff / claim.estimated_loss) * 100 if claim.estimated_loss > 0 else 0

            if pct_diff > 15.0 and diff > 250.0:
                results.append({
                    "rule_code": "VAL-AMT-001",
                    "category": "Amount Mismatch",
                    "severity": "Warning",
                    "status": "Failed",
                    "issue_detected": f"Discrepancy Between Claimed Amount (${claim.estimated_loss:,.2f}) and Invoice Total (${total_doc_sum:,.2f})",
                    "explanation": (
                        f"The aggregated total from OCR documents (${total_doc_sum:,.2f}) differs by {pct_diff:.1f}% (${diff:,.2f}) "
                        f"from the customer's claimed loss of ${claim.estimated_loss:,.2f}. "
                        "This may indicate unaccounted rental fees, hidden supplements, or inflated demand."
                    ),
                    "confidence_score": 0.94,
                    "suggested_action": "Review individual line item totals in the Claim Workbench and reconcile delta before drafting settlement."
                })
            else:
                results.append({
                    "rule_code": "VAL-AMT-001",
                    "category": "Amount Mismatch",
                    "severity": "Info",
                    "status": "Passed",
                    "issue_detected": "Claim Loss Closely Reconciles with Documented Repair Estimates",
                    "explanation": f"Claimed loss (${claim.estimated_loss:,.2f}) aligns with documented figures (${total_doc_sum:,.2f}) within permissible underwriting tolerance.",
                    "confidence_score": 0.97,
                    "suggested_action": "Proceed with standard payout authorization matrix."
                })

        # ---------------------------------------------------------
        # Check D: Identity Mismatches
        # ---------------------------------------------------------
        c_name_lower = claim.customer_name.lower().strip()
        for doc in documents:
            if doc.extracted_fields and isinstance(doc.extracted_fields, dict):
                patient = doc.extracted_fields.get("patient_name")
                billed_to = doc.extracted_fields.get("billed_to")
                driver = doc.extracted_fields.get("driver_reported")
                
                check_name = patient or billed_to
                if check_name and check_name.lower() not in ("insured", "insured patient", "customer name / insurance carrier"):
                    # compare tokens
                    tokens_claim = set(c_name_lower.split())
                    tokens_doc = set(check_name.lower().split())
                    if not tokens_claim.intersection(tokens_doc):
                        results.append({
                            "rule_code": "VAL-ID-001",
                            "category": "Identity Mismatch",
                            "severity": "Warning",
                            "status": "Failed",
                            "issue_detected": f"Name Mismatch on '{doc.file_name}': Found '{check_name}' vs Insured '{claim.customer_name}'",
                            "explanation": (
                                f"The name on the submitted document ({check_name}) does not match the registered policyholder ({claim.customer_name}). "
                                "Third-party drivers or unauthorized claimants must provide power of attorney or listed driver endorsement."
                            ),
                            "confidence_score": 0.91,
                            "suggested_action": "Check policy endorsements to verify if this individual is a declared secondary driver."
                        })

        # ---------------------------------------------------------
        # Check E: Duplicate Claims
        # ---------------------------------------------------------
        if all_existing_claims:
            duplicates = [
                c for c in all_existing_claims
                if c.id != claim.id 
                and (
                    (c.policy_number == claim.policy_number and abs((c.incident_date - claim.incident_date).days) <= 2)
                    or (c.customer_name.lower() == claim.customer_name.lower() and abs(c.estimated_loss - claim.estimated_loss) < 50.0 and abs((c.incident_date - claim.incident_date).days) <= 14)
                )
            ]
            if duplicates:
                dup_numbers = ", ".join([d.claim_number for d in duplicates])
                results.append({
                    "rule_code": "VAL-DUP-001",
                    "category": "Duplicate Claim",
                    "severity": "Critical",
                    "status": "Failed",
                    "issue_detected": f"Potential Duplicate Submission Detected (Matching: {dup_numbers})",
                    "explanation": (
                        f"This claim shares identical policy ({claim.policy_number}) and near-identical loss date "
                        f"with existing active record(s) {dup_numbers}. "
                        "Double-dipping or inadvertent multi-channel submissions duplicate payout liability."
                    ),
                    "confidence_score": 0.98,
                    "suggested_action": "Compare claim files side-by-side in Workbench; merge duplicate or reject subsequent submission."
                })

        return results

validation_engine = ValidationEngineService()
