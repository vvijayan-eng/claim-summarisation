# Sample Insurance Claim Test Documents

These synthetic documents are pre-formatted for testing the **ClaimAssure AI** intake, OCR extraction, validation rule engine, and fraud scoring modules.

---

## 📂 Test Files Included

| File Name | Category | Scenario / Expected AI Behavior |
| :--- | :--- | :--- |
| **`01_Official_Police_Accident_Report.txt`** | **Police Report** | Standard clean collision report. Extracts CAD ID, officer badge, date (2026-01-12), impact narrative, and matches claimant name. Passes `VAL-DOC-003`. |
| **`02_Certified_Collision_Repair_Estimate.txt`** | **Repair Estimate** | High-fidelity itemized estimate from certified shop. Reconciles parts ($4,850), labor ($2,482), and grand total ($7,850). Passes `VAL-AMT-001`. |
| **`03_Government_Driver_License_ID_Proof.txt`** | **ID Proof** | Valid State Driver's License. Fulfills KYC/AML mandatory identity criteria. Resolves `VAL-DOC-001` missing ID alerts. |
| **`04_Suspicious_Invoice_Test_Case.txt`** | **Invoice** | **Adversarial / Fraud Test Case.** Deliberately triggers: <br>• **`VAL-DATE-003`**: Invoice dated 2025-11-20 (predates loss on 2026-01-12). <br>• **`VAL-AMT-001`**: $16,850 billed vs $7,850 claimed (+114% variance). <br>• **`FRD-EDIT-02`**: Digital modification / Photoshop tag anomaly. |
| **`high_risk_document.txt`** | **Invoice / Repair Estimate** | **CRITICAL HIGH-RISK REJECTION CASE.** <br>• **Triggers Immediate Rejection / SIU Escalation** <br>• **Date Predates Loss by 116 Days** (`VAL-DATE-003`) <br>• **+522% Inflated Demand ($48,900 vs $7,850)** (`VAL-AMT-001` & `FRD-AMT-05`) <br>• **Identity Mismatch** (Viktor K. Vance-Sloan vs Eleanor Vance) <br>• **Contradictory Narrative** (Parked driveway vs 65 mph street race rollover) (`FRD-NARR-03`) <br>• **Tampered Layered Artifact** (`FRD-EDIT-02`). |

---

## 🚀 How to Test in the Application

1. Open the UI at **`http://localhost:3000`**.
2. Click **"Intake & Upload"** in the left sidebar navigation (or URL `http://localhost:3000/intake`).
3. Select an existing claim (e.g. `CLM-2026-01000 - Eleanor Vance`) or choose **"+ Create New Claim Record"**.
4. Drag and drop any of these sample files into the dashed ingestion zone.
5. Choose the corresponding document classification tag (e.g., *Police Report*, *Repair Estimate*, *Invoice*, or *ID Proof*).
6. Click **"Ingest & Run AI Pipeline"**.
7. The platform will automatically extract OCR fields, run the 5-point validation engine, compute the fraud risk score, and open the **Claim Review Workbench** showing the 7-section AI summary and explainable findings!
