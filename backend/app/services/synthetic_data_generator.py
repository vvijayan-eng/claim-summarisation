import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.models.document import ClaimDocument
from app.models.validation import ValidationResult
from app.models.fraud import FraudIndicator
from app.models.audit import AuditLog
from app.services.validation_engine import validation_engine
from app.services.fraud_scoring import fraud_scoring_engine
from app.services.ai_summarizer import ai_summarizer

class SyntheticDataGenerator:
    """
    Synthesizes rich, realistic insurance claim packages across
    Auto, Property, Medical, and Travel insurance lines.
    All records explicitly stamped: 'SYNTHETIC TEST DATA'.
    """

    AUTO_PROFILES = [
        {
            "customer_name": "Eleanor Vance",
            "email": "eleanor.vance@example-test.com",
            "phone": "555-019-4821",
            "policy_type": "Auto",
            "policy_num": "PA-AUTO-94821",
            "incident_type": "Multi-Vehicle Collision",
            "location": "Route 9 & Maplewood Blvd, White Plains, NY",
            "description": "Insured vehicle was struck on passenger quarter panel while navigating traffic circle. Both side curtain airbags deployed.",
            "loss": 8450.00,
            "deductible": 500.00,
            "region": "North America - East",
            "docs": [
                {"name": "Metro_Police_Accident_Report_PD891.pdf", "category": "Police Report"},
                {"name": "Certified_Collision_Repair_Estimate.pdf", "category": "Repair Estimate"},
                {"name": "Drivers_License_EVance_Scan.jpg", "category": "ID Proof"}
            ]
        },
        {
            "customer_name": "Marcus Aurelius Thorne",
            "email": "m.thorne@example-test.com",
            "phone": "555-014-9923",
            "policy_type": "Auto",
            "policy_num": "PA-AUTO-10924",
            "incident_type": "Hail & Windstorm Damage",
            "location": "Residential Driveway, Plano, TX",
            "description": "Severe baseball-sized hailstorm shattered rear windshield and dented aluminum roof paneling across entire hood area.",
            "loss": 5890.00,
            "deductible": 1000.00,
            "region": "North America - South",
            "docs": [
                {"name": "BodyShop_Itemized_Invoice_INV291.pdf", "category": "Invoice"},
                {"name": "Severe_Weather_NOAA_Incident_Affidavit.pdf", "category": "Supporting Document"}
                # Missing ID proof intentionally to trigger validation rule
            ]
        },
        {
            "customer_name": "Sophia Rodriguez-Chen",
            "email": "sophia.rc@example-test.com",
            "phone": "555-017-7712",
            "policy_type": "Auto",
            "policy_num": "PA-AUTO-88219",
            "incident_type": "Rear-End Impact",
            "location": "Interstate 95 Mile Marker 42, Stamford, CT",
            "description": "Stopped in heavy bumper-to-bumper congestion. Third-party commercial van collided with rear bumper at approx 22 mph.",
            "loss": 14200.00,
            "deductible": 500.00,
            "region": "North America - East",
            "docs": [
                {"name": "State_Trooper_Collision_Record.pdf", "category": "Police Report"},
                {"name": "Prestige_Collision_Repair_Estimate_R102.pdf", "category": "Repair Estimate"},
                {"name": "St_Jude_Emergency_Room_Summary.pdf", "category": "Medical Record"},
                {"name": "Drivers_License_SRodriguez.pdf", "category": "ID Proof"},
                {"name": "Suspicious_Photoshop_Invoice_copy_of.pdf", "category": "Invoice"} # Trigger fraud edit flag
            ]
        }
    ]

    PROPERTY_PROFILES = [
        {
            "customer_name": "Arthur Pendelton",
            "email": "arthur.p@example-test.com",
            "phone": "555-012-3341",
            "policy_type": "Property",
            "policy_num": "HO-PROP-55410",
            "incident_type": "Burst Pipe & Water Damage",
            "location": "442 Whispering Pines Rd, Denver, CO",
            "description": "Sub-zero freeze ruptured second-floor copper plumbing line, causing severe cascading water intrusion through kitchen drywall and hardwood flooring.",
            "loss": 18750.00,
            "deductible": 1500.00,
            "region": "North America - West",
            "docs": [
                {"name": "Disaster_Restoration_Plumbing_Invoice.pdf", "category": "Invoice"},
                {"name": "Certified_Moisture_Map_Estimate.pdf", "category": "Repair Estimate"},
                {"name": "Homeowners_Deed_Identification.pdf", "category": "ID Proof"}
            ]
        },
        {
            "customer_name": "Samantha Green",
            "email": "sgreen@example-test.com",
            "phone": "555-018-8829",
            "policy_type": "Property",
            "policy_num": "HO-PROP-99120",
            "incident_type": "Kitchen Electrical Fire",
            "location": "1208 Elmwood Terrace, Chicago, IL",
            "description": "Appliance short circuit ignited kitchen cabinets. Smoke damage extending to adjacent dining room and upper landing.",
            "loss": 31500.00,
            "deductible": 2500.00,
            "region": "North America - Midwest",
            "docs": [
                {"name": "Chicago_Fire_Dept_Incident_Report.pdf", "category": "Police Report"},
                {"name": "Soot_Remediation_Estimate_Quote.pdf", "category": "Repair Estimate"}
                # Missing ID proof
            ]
        }
    ]

    MEDICAL_PROFILES = [
        {
            "customer_name": "Dr. Julian Montgomery",
            "email": "j.montgomery@example-test.com",
            "phone": "555-016-4491",
            "policy_type": "Health",
            "policy_num": "MED-HLTH-77319",
            "incident_type": "Emergency Appendectomy & Hospitalization",
            "location": "Mercy General Hospital, Seattle, WA",
            "description": "Acute abdomen presentation requiring emergent laparoscopic appendectomy and 48-hour inpatient observation.",
            "loss": 19450.00,
            "deductible": 1200.00,
            "region": "North America - West",
            "docs": [
                {"name": "Mercy_General_Operative_Clinical_Summary.pdf", "category": "Medical Record"},
                {"name": "Hospital_Itemized_UB04_Claim_Invoice.pdf", "category": "Invoice"},
                {"name": "Insured_Gov_Passport_ID.pdf", "category": "ID Proof"}
            ]
        }
    ]

    TRAVEL_PROFILES = [
        {
            "customer_name": "Chloe Delacroix",
            "email": "chloe.delacroix@example-test.com",
            "phone": "555-013-6628",
            "policy_type": "Travel",
            "policy_num": "TRV-INT-30291",
            "incident_type": "Flight Cancellation & Emergency Lodging",
            "location": "Heathrow Airport (LHR), London, UK",
            "description": "Severe European ATC strike caused 72-hour stranding. Carrier refused voucher compensation under Force Majeure clause.",
            "loss": 2840.00,
            "deductible": 100.00,
            "region": "International / Europe",
            "docs": [
                {"name": "Airline_Cancellation_Notice_BA284.pdf", "category": "Supporting Document"},
                {"name": "Hilton_London_Itemized_Folio_Bill.pdf", "category": "Invoice"},
                {"name": "Passport_Identity_Scan_CD.pdf", "category": "ID Proof"}
            ]
        }
    ]

    @classmethod
    def generate_seed_data(cls, db: Session, count_per_type: int = 1):
        """
        Seeds the database with diverse synthetic insurance claims.
        """
        all_profiles = cls.AUTO_PROFILES + cls.PROPERTY_PROFILES + cls.MEDICAL_PROFILES + cls.TRAVEL_PROFILES
        
        created_claims = []
        base_date = datetime.utcnow() - timedelta(days=20)

        for i, profile in enumerate(all_profiles):
            inc_offset = random.randint(1, 15)
            inc_date = base_date + timedelta(days=inc_offset)
            claim_filed_date = inc_date + timedelta(days=random.randint(1, 3))
            
            c_num = f"CLM-2026-{1000 + i * 27:05d}"
            
            # Determine initial status
            statuses = ["Under Review", "Under Review", "Processing", "Validation Failed", "Approved", "Escalated"]
            chosen_status = statuses[i % len(statuses)]
            
            claim = Claim(
                claim_number=c_num,
                policy_number=profile["policy_num"],
                policy_type=profile["policy_type"],
                customer_name=f"[SYNTHETIC TEST DATA] {profile['customer_name']}",
                customer_email=profile["email"],
                customer_phone=profile["phone"],
                customer_id_number=f"ID-{random.randint(100000, 999999)}",
                incident_date=inc_date,
                claim_filed_date=claim_filed_date,
                incident_type=profile["incident_type"],
                incident_location=profile["location"],
                incident_description=profile["description"],
                estimated_loss=profile["loss"],
                deductible=profile["deductible"],
                status=chosen_status,
                region=profile["region"],
                is_synthetic=True,
                assigned_adjuster="Alexander Hayes, Senior Claims Adjuster"
            )
            db.add(claim)
            db.flush()

            # Create Documents
            docs_obj_list = []
            for doc_meta in profile["docs"]:
                doc = ClaimDocument(
                    claim_id=claim.id,
                    file_name=doc_meta["name"],
                    file_type="PDF" if doc_meta["name"].endswith(".pdf") else "JPG",
                    document_category=doc_meta["category"],
                    file_size_bytes=random.randint(245000, 1850000),
                    file_path=f"/uploads/{claim.claim_number}/{doc_meta['name']}",
                    storage_url=f"https://azureblob.storage.core.windows.net/claim-docs/{claim.claim_number}/{doc_meta['name']}",
                    ocr_raw_text=f"SYNTHETIC TEST DATA\nDocument Type: {doc_meta['category']}\nVerified via Azure Document Intelligence OCR.",
                    extracted_fields={
                        "document_category": doc_meta["category"],
                        "file_name": doc_meta["name"],
                        "total_amount": profile["loss"] if "Invoice" in doc_meta["category"] else None,
                        "total_repair_cost": profile["loss"] if "Estimate" in doc_meta["category"] else None,
                        "incident_date": inc_date.strftime("%Y-%m-%d"),
                        "vendor_name": "Certified Service Provider LLC"
                    },
                    ocr_confidence=0.97,
                    processing_status="Completed"
                )
                db.add(doc)
                docs_obj_list.append(doc)
            db.flush()

            # Run Validation Engine
            val_results_raw = validation_engine.evaluate_claim(claim, docs_obj_list)
            for vr in val_results_raw:
                val_obj = ValidationResult(
                    claim_id=claim.id,
                    rule_code=vr["rule_code"],
                    category=vr["category"],
                    severity=vr["severity"],
                    status=vr["status"],
                    issue_detected=vr["issue_detected"],
                    explanation=vr["explanation"],
                    confidence_score=vr["confidence_score"],
                    suggested_action=vr["suggested_action"],
                    is_resolved=False
                )
                db.add(val_obj)

            # Run Fraud Scoring Engine
            fraud_score, risk_cat, fraud_inds = fraud_scoring_engine.analyze_claim_fraud_risk(
                claim=claim,
                documents=docs_obj_list,
                validation_results=val_results_raw,
                historical_claims_count=1 if i == 2 else 0
            )
            claim.fraud_score = fraud_score
            claim.risk_level = risk_cat

            for fi in fraud_inds:
                fi_obj = FraudIndicator(
                    claim_id=claim.id,
                    indicator_code=fi["indicator_code"],
                    indicator_name=fi["indicator_name"],
                    risk_level=fi["risk_level"],
                    impact_score=fi["impact_score"],
                    detected_reason=fi["detected_reason"],
                    evidence_pointer=fi["evidence_pointer"],
                    metadata_context=fi["metadata_context"]
                )
                db.add(fi_obj)

            # Generate AI Summary
            summary_dict = ai_summarizer._generate_structured_summary(
                claim={
                    "claim_number": claim.claim_number,
                    "policy_number": claim.policy_number,
                    "customer_name": claim.customer_name,
                    "incident_date": claim.incident_date,
                    "incident_type": claim.incident_type,
                    "estimated_loss": claim.estimated_loss,
                    "deductible": claim.deductible,
                    "policy_type": claim.policy_type,
                    "fraud_score": claim.fraud_score
                },
                documents=[{"file_name": d.file_name, "document_category": d.document_category} for d in docs_obj_list],
                validations=val_results_raw,
                fraud_indicators=fraud_inds
            )
            claim.ai_summary = summary_dict
            claim.ai_processing_time_sec = round(random.uniform(2.4, 4.8), 2)
            claim.adjuster_review_time_sec = round(random.uniform(180, 420), 1)

            # Audit Trail
            db.add(AuditLog(
                claim_id=claim.id,
                actor_id="AI-PIPELINE-AZURE",
                actor_name="Automated Claim Ingestion Agent",
                action_type="CLAIM_INITIALIZED",
                description=f"Claim {claim.claim_number} created with {len(docs_obj_list)} documents. OCR and validation executed.",
                ip_address="10.200.4.15",
                compliance_framework="GDPR / HIPAA SOC2 Type II",
                pii_masked=True
            ))

            created_claims.append(claim)

        db.commit()
        return created_claims

synthetic_generator = SyntheticDataGenerator()
