import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  FileSearch,
  Scale,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { RiskBadge } from '../components/RiskBadge';
import { StatusBadge } from '../components/StatusBadge';
import { useNavigate } from 'react-router-dom';

export const FraudReview: React.FC = () => {
  const { claims, selectClaim } = useClaims();
  const navigate = useNavigate();

  // High risk claims prioritizing SIU attention
  const highAndMedRiskClaims = claims
    .filter((c) => c.risk_level === 'High' || c.risk_level === 'Medium')
    .sort((a, b) => b.fraud_score - a.fraud_score);

  const [activeClaimId, setActiveClaimId] = useState<number>(highAndMedRiskClaims[0]?.id || claims[0]?.id);
  const activeClaim = claims.find((c) => c.id === activeClaimId) || claims[0];

  const handleOpenWorkbench = (id: number) => {
    selectClaim(id);
    navigate('/workbench');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Special Investigation Unit (SIU) & Fraud Triage
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Explainable, multi-factor insurance fraud risk scoring. Analyzes duplicate submissions, digital image edits, conflicting officer statements, loss outliers, and frequency patterns.
        </Typography>
      </Box>

      {/* Principle Banner */}
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          borderLeft: '4px solid #ca5010',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Scale size={24} color="#ca5010" />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Regulatory Principle: Explainable Advisory AI (No Automated Adverse Action)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            In compliance with insurance underwriting and claims regulations, the platform never renders automated rejection decisions. All scores are explainable advisory recommendations for human investigation.
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Left Column: Flagged High & Medium Risk Claims Queue */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                High & Medium Risk Claims ({highAndMedRiskClaims.length})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ranked by anomalous fraud score vector
              </Typography>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table size="small">
                <TableBody>
                  {highAndMedRiskClaims.map((claim) => {
                    const isSelected = claim.id === activeClaim?.id;
                    return (
                      <TableRow
                        key={claim.id}
                        hover
                        selected={isSelected}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setActiveClaimId(claim.id)}
                      >
                        <TableCell sx={{ py: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {claim.claim_number}
                            </Typography>
                            <RiskBadge level={claim.risk_level} score={claim.fraud_score} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {claim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {claim.policy_type} • Claimed: ${claim.estimated_loss.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Column: Deep-Dive Forensic Breakdown of Selected Claim */}
        <Grid item xs={12} md={7}>
          {activeClaim ? (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {activeClaim.claim_number} - Forensic Report
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Insured: {activeClaim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')} • Policy #{activeClaim.policy_number}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<Eye size={14} />}
                  onClick={() => handleOpenWorkbench(activeClaim.id)}
                >
                  Open in Workbench
                </Button>
              </Box>

              <Divider sx={{ mb: 2.5 }} />

              {/* Gauge & Category */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      FRAUD RISK SCORE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: activeClaim.fraud_score > 65 ? 'error.main' : 'warning.main' }}>
                        {Math.round(activeClaim.fraud_score)}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">/ 100</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={activeClaim.fraud_score}
                      color={activeClaim.fraud_score > 65 ? 'error' : 'warning'}
                      sx={{ height: 8, borderRadius: 4, mt: 1 }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      RECOMMENDED SIU ACTION
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mt: 1, color: activeClaim.risk_level === 'High' ? 'error.main' : 'warning.dark' }}>
                      {activeClaim.risk_level === 'High'
                        ? 'Freeze Payout & Assign Field Investigator'
                        : 'Request Corroborating Primary Documents'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      Assigned Adjuster: {activeClaim.assigned_adjuster || 'Alexander Hayes'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Triggered Indicators */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Explainable Risk Indicators ({activeClaim.fraud_indicators?.length || 0})
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activeClaim.fraud_indicators?.map((fi) => (
                  <Card key={fi.id} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ShieldAlert size={16} color="#ca5010" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {fi.indicator_name} ({fi.indicator_code})
                          </Typography>
                        </Box>
                        <Chip
                          label={`+${fi.impact_score.toFixed(0)} pts`}
                          size="small"
                          color="warning"
                          variant="outlined"
                          sx={{ fontWeight: 700, height: 20, fontSize: '0.68rem' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.82rem', color: 'text.secondary' }}>
                        <strong>Detection Reason:</strong> {fi.detected_reason}
                      </Typography>
                      {fi.evidence_pointer && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            Evidence Pointer: {fi.evidence_pointer}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {(!activeClaim.fraud_indicators || activeClaim.fraud_indicators.length === 0) && (
                  <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No high-risk fraud signals identified for this claim.
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Paper>
          ) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Select a claim from the left panel to review its fraud telemetry.
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
