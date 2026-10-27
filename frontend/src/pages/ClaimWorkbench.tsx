import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Eye,
  PlusCircle,
  HelpCircle,
  Info,
  ChevronDown,
  DollarSign,
  Calendar,
  Send,
  MessageSquare,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { DocumentViewerModal } from '../components/DocumentViewerModal';
import { ClaimDocument } from '../types';

export const ClaimWorkbench: React.FC = () => {
  const {
    selectedClaim,
    updateClaimStatus,
    addNotesToClaim,
    escalateClaimToSIU,
    reRunValidation,
    reRunFraudCheck,
    reGenerateSummary,
    loading,
  } = useClaims();

  const [activeDoc, setActiveDoc] = useState<ClaimDocument | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Notes Modal state
  const [noteOpen, setNoteOpen] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');

  // Escalate Modal state
  const [escalateOpen, setEscalateOpen] = useState<boolean>(false);
  const [escalateReason, setEscalateReason] = useState<string>('Suspicious digital edits and conflicting officer statement.');

  // Request Document Modal state
  const [reqDocOpen, setReqDocOpen] = useState<boolean>(false);
  const [reqDocText, setReqDocText] = useState<string>('Please provide a certified copy of your State Driver License and proof of prior damage repair.');

  if (!selectedClaim) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <FileText size={48} color="#94a3b8" />
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
          No Claim Selected
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please select a claim from the Claims Queue to open the 3-panel review workbench.
        </Typography>
      </Box>
    );
  }

  const handleOpenDoc = (doc: ClaimDocument) => {
    setActiveDoc(doc);
    setModalOpen(true);
  };

  const handleApprove = () => {
    if (window.confirm(`Are you sure you want to approve claim #${selectedClaim.claim_number}?`)) {
      updateClaimStatus(selectedClaim.id, 'Approved', 'Claim verified and authorized by Senior Adjuster.');
    }
  };

  const handleReject = () => {
    const reason = window.prompt('Please enter justification for claim rejection:', 'Claim documentation inconsistent with policy provisions.');
    if (reason) {
      updateClaimStatus(selectedClaim.id, 'Closed', `Claim rejected: ${reason}`);
    }
  };

  const handleEscalate = () => {
    escalateClaimToSIU(selectedClaim.id, escalateReason);
    setEscalateOpen(false);
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      addNotesToClaim(selectedClaim.id, noteText.trim());
      setNoteText('');
      setNoteOpen(false);
    }
  };

  const handleSendDocRequest = () => {
    addNotesToClaim(selectedClaim.id, `[DOCUMENT REQUEST SENT TO INSURED]: ${reqDocText}`);
    setReqDocOpen(false);
    alert('Document request dispatch notification sent to insured via SMS & secure email portal.');
  };

  const summary = selectedClaim.ai_summary;

  return (
    <Box>
      {/* Dossier Header */}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {selectedClaim.claim_number}
              </Typography>
              <StatusBadge status={selectedClaim.status} size="medium" />
              <RiskBadge level={selectedClaim.risk_level} score={selectedClaim.fraud_score} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Policy #{selectedClaim.policy_number} ({selectedClaim.policy_type}) • Insured: <strong>{selectedClaim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}</strong> • Incident Date: {new Date(selectedClaim.incident_date).toLocaleDateString()}
            </Typography>
          </Box>

          {/* Action Bar */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle size={16} />}
              onClick={handleApprove}
            >
              Approve Claim
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ShieldAlert size={16} />}
              onClick={() => setEscalateOpen(true)}
            >
              Escalate to SIU
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<XCircle size={16} />}
              onClick={handleReject}
            >
              Reject
            </Button>
            <Button
              variant="outlined"
              startIcon={<MessageSquare size={16} />}
              onClick={() => setNoteOpen(true)}
            >
              Add Note
            </Button>
            <Button
              variant="outlined"
              startIcon={<Send size={16} />}
              onClick={() => setReqDocOpen(true)}
            >
              Request Docs
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* 3-PANEL WORKBENCH GRID */}
      <Grid container spacing={2.5}>
        {/* ======================================================== */}
        {/* LEFT PANEL: Uploaded Documents & OCR Telemetry */}
        {/* ======================================================== */}
        <Grid item xs={12} md={3.2}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Claim Documents ({selectedClaim.documents?.length || 0})
              </Typography>
              <Tooltip title="Re-run OCR extraction">
                <Button size="small" onClick={() => reRunValidation(selectedClaim.id)} disabled={loading}>
                  <RefreshCw size={14} />
                </Button>
              </Tooltip>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Processed via Azure AI Document Intelligence
            </Typography>

            <List disablePadding>
              {selectedClaim.documents?.map((doc) => (
                <Card
                  key={doc.id}
                  variant="outlined"
                  sx={{
                    mb: 1.5,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  }}
                  onClick={() => handleOpenDoc(doc)}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <FileText size={20} color="#0062a3" style={{ marginTop: 2, flexShrink: 0 }} />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all' }}>
                          {doc.file_name}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Chip
                            label={doc.document_category}
                            size="small"
                            sx={{ height: 20, fontSize: '0.68rem', bgcolor: 'background.default' }}
                          />
                          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                            {(doc.ocr_confidence * 100).toFixed(0)}% OCR
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}

              {(!selectedClaim.documents || selectedClaim.documents.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <Typography variant="body2">No documents attached.</Typography>
                </Box>
              )}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Adjuster Operational Notes Stream */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Adjuster Dossier Notes
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                bgcolor: 'background.default',
                borderRadius: 1.5,
                maxHeight: 180,
                overflowY: 'auto',
                fontSize: '0.8rem',
              }}
            >
              {selectedClaim.adjuster_notes ? (
                <Typography variant="caption" sx={{ whiteSpace: 'pre-line', display: 'block' }}>
                  {selectedClaim.adjuster_notes}
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No notes added yet. Use "Add Note" above to document phone calls or inspections.
                </Typography>
              )}
            </Paper>
          </Paper>
        </Grid>

        {/* ======================================================== */}
        {/* CENTER PANEL: AI Summary (All 7 Sections) */}
        {/* ======================================================== */}
        <Grid item xs={12} md={5.3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sparkles size={20} color="#0062a3" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Azure AI Summary (DeepSeek-V3)
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshCw size={14} />}
                onClick={() => reGenerateSummary(selectedClaim.id)}
                disabled={loading}
              >
                Regenerate AI
              </Button>
            </Box>

            {summary ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* A. Executive Summary */}
                <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase' }}>
                    A. Executive Summary
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                    {summary.executive_summary}
                  </Typography>
                </Box>

                {/* B. Incident Description */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    B. Incident Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {summary.incident_description}
                  </Typography>
                </Box>

                {/* C. Claimed Damage */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    C. Claimed Damage
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {summary.claimed_damage}
                  </Typography>
                </Box>

                {/* D. Financial Summary */}
                <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    D. Financial Summary & Reconciliation
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Estimated Loss</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        ${summary.financial_summary?.gross_claimed_loss?.toLocaleString() || selectedClaim.estimated_loss}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Deductible</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        ${summary.financial_summary?.policy_deductible || selectedClaim.deductible}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">Net Payable</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'success.main' }}>
                        ${summary.financial_summary?.calculated_net_payable?.toLocaleString() || (selectedClaim.estimated_loss - selectedClaim.deductible)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* E. Missing Information */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.dark', textTransform: 'uppercase' }}>
                    E. Missing Information
                  </Typography>
                  <List dense disablePadding sx={{ mt: 0.5 }}>
                    {summary.missing_information?.map((item, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <AlertTriangle size={14} color="#d97706" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          primaryTypographyProps={{ fontSize: '0.82rem', color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                    {(!summary.missing_information || summary.missing_information.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        None - all mandatory document requirements satisfied.
                      </Typography>
                    )}
                  </List>
                </Box>

                {/* F. Risk Indicators */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                    F. Risk Indicators
                  </Typography>
                  <List dense disablePadding sx={{ mt: 0.5 }}>
                    {summary.risk_indicators?.map((ind, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <Info size={14} color="#0062a3" />
                        </ListItemIcon>
                        <ListItemText
                          primary={ind}
                          primaryTypographyProps={{ fontSize: '0.82rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                {/* G. Recommended Actions */}
                <Box sx={{ p: 1.5, bgcolor: 'primary.light', borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.dark', textTransform: 'uppercase' }}>
                    G. Recommended Actions
                  </Typography>
                  <List dense disablePadding sx={{ mt: 0.5 }}>
                    {summary.recommended_actions?.map((act, idx) => (
                      <ListItem key={idx} disableGutters sx={{ py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <ArrowUpRight size={14} color="#0062a3" />
                        </ListItemIcon>
                        <ListItemText
                          primary={act}
                          primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, color: 'primary.dark' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Sparkles size={40} color="#0062a3" />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Summary generation queued.
                </Typography>
                <Button size="small" variant="contained" sx={{ mt: 2 }} onClick={() => reGenerateSummary(selectedClaim.id)}>
                  Generate AI Summary Now
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Validation Alerts & Fraud Risk Engine */}
        {/* ======================================================== */}
        <Grid item xs={12} md={3.5}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            {/* Fraud Gauge Header */}
            <Box sx={{ mb: 2.5, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Explainable Fraud Score
                </Typography>
                <RiskBadge level={selectedClaim.risk_level} score={selectedClaim.fraud_score} showScore={false} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: selectedClaim.fraud_score > 65 ? 'error.main' : selectedClaim.fraud_score > 30 ? 'warning.main' : 'success.main' }}>
                  {Math.round(selectedClaim.fraud_score)}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">/ 100</Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={selectedClaim.fraud_score}
                color={selectedClaim.fraud_score > 65 ? 'error' : selectedClaim.fraud_score > 30 ? 'warning' : 'success'}
                sx={{ height: 8, borderRadius: 4, mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.7rem' }}>
                AI provides risk signals only. Approval decisions rest with certified human adjusters.
              </Typography>
            </Box>

            {/* Validation Alerts Breakdown */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Validation Alerts ({selectedClaim.validation_results?.filter(v => v.status === 'Failed').length || 0})</span>
              <Button size="small" onClick={() => reRunValidation(selectedClaim.id)}>Check Rules</Button>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 320, overflowY: 'auto' }}>
              {selectedClaim.validation_results?.map((val) => (
                <Accordion key={val.id} variant="outlined" disableGutters sx={{ borderRadius: '6px !important', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<ChevronDown size={14} />} sx={{ px: 1.5, py: 0.5, minHeight: 40 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                      {val.status === 'Passed' ? (
                        <CheckCircle size={14} color="#16a34a" />
                      ) : val.severity === 'Critical' ? (
                        <XCircle size={14} color="#dc2626" />
                      ) : (
                        <AlertTriangle size={14} color="#d97706" />
                      )}
                      <Typography variant="caption" sx={{ fontWeight: 600, flexGrow: 1, fontSize: '0.78rem' }}>
                        {val.issue_detected}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontSize: '0.75rem', lineHeight: 1.4 }}>
                      <strong>Why this matters:</strong> {val.explanation}
                    </Typography>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', fontSize: '0.72rem', color: 'primary.dark' }}>
                        Next Action: {val.suggested_action}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Fraud Indicators List */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Flagged Risk Signals ({selectedClaim.fraud_indicators?.length || 0})
            </Typography>
            <List dense disablePadding>
              {selectedClaim.fraud_indicators?.map((fi) => (
                <ListItem key={fi.id} disableGutters sx={{ py: 0.5, borderBottom: '1px dashed', borderColor: 'divider' }}>
                  <ListItemIcon sx={{ minWidth: 22 }}>
                    <ShieldAlert size={14} color="#b45309" />
                  </ListItemIcon>
                  <ListItemText
                    primary={fi.indicator_name}
                    secondary={fi.detected_reason}
                    primaryTypographyProps={{ fontSize: '0.78rem', fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: '0.7rem' }}
                  />
                </ListItem>
              ))}
              {(!selectedClaim.fraud_indicators || selectedClaim.fraud_indicators.length === 0) && (
                <Typography variant="caption" color="text.secondary">
                  No anomalous fraud indicators triggered for this record.
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        document={activeDoc}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Note Modal */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add Adjuster Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            placeholder="Document contact with claimant, repair shop estimates, or inspection logs..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNoteOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveNote}>
            Save Note to Dossier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Escalate Modal */}
      <Dialog open={escalateOpen} onClose={() => setEscalateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: 'warning.dark' }}>
          Escalate Claim to Special Investigation Unit (SIU)
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This flags claim #{selectedClaim.claim_number} for forensic cross-referencing, metadata inspection, and fraud investigation.
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Escalation Rationale"
            value={escalateReason}
            onChange={(e) => setEscalateReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEscalateOpen(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleEscalate}>
            Confirm SIU Escalation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Docs Modal */}
      <Dialog open={reqDocOpen} onClose={() => setReqDocOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Request Missing Documentation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Generates an automated, secure document upload link sent to policyholder <strong>{selectedClaim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}</strong>.
          </Typography>
          <TextField
            multiline
            rows={3}
            fullWidth
            label="Requested Items & Instructions"
            value={reqDocText}
            onChange={(e) => setReqDocText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReqDocOpen(false)}>Cancel</Button>
          <Button variant="contained" startIcon={<Send size={16} />} onClick={handleSendDocRequest}>
            Dispatch Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
