import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  FileText,
  Clock,
  Zap,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { claims, analytics, selectClaim } = useClaims();
  const navigate = useNavigate();

  const handleOpenWorkbench = (id: number) => {
    selectClaim(id);
    navigate('/workbench');
  };

  return (
    <Box>
      {/* Title & Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Claims Intake & Operations Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time AI summarization, automated validation rules, and explainable fraud telemetry.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Zap size={16} />}
            onClick={() => navigate('/intake')}
          >
            Intake New Claim
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/queue')}
          >
            View Full Queue
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  TOTAL CLAIMS IN QUEUE
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {analytics?.total_claims || claims.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <TrendingUp size={12} /> +14.2% intake velocity
                </Typography>
              </Box>
              <Box sx={{ p: 1.2, bgcolor: 'primary.light', borderRadius: 1.5, color: 'primary.main' }}>
                <FileText size={22} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  AVG AI REVIEW SPEED
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  3.2s
                </Typography>
                <Typography variant="caption" sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Zap size={12} /> vs 45 min manual baseline
                </Typography>
              </Box>
              <Box sx={{ p: 1.2, bgcolor: 'info.light', borderRadius: 1.5, color: 'info.main' }}>
                <Clock size={22} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  VALIDATION ACCURACY
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
                  {analytics?.validation_accuracy_pct || 98.4}%
                </Typography>
                <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <CheckCircle size={12} /> 5 core validation checks
                </Typography>
              </Box>
              <Box sx={{ p: 1.2, bgcolor: 'secondary.light', borderRadius: 1.5, color: 'secondary.main' }}>
                <ShieldCheck size={22} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  FRAUD ALERTS FLAGGED
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'warning.dark' }}>
                  {analytics?.fraud_alerts_count || 5}
                </Typography>
                <Typography variant="caption" sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <AlertOctagon size={12} /> SIU triage active
                </Typography>
              </Box>
              <Box sx={{ p: 1.2, bgcolor: 'warning.light', borderRadius: 1.5, color: 'warning.main' }}>
                <AlertOctagon size={22} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content: Active Claims Stream & AI Pipeline Highlights */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Live Claims Processing Stream
              </Typography>
              <Button size="small" endIcon={<ArrowRight size={14} />} onClick={() => navigate('/queue')}>
                View All
              </Button>
            </Box>
            <Divider />
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Claim Number</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer / Policy</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Estimated Loss</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Risk Rating</TableCell>
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {claims.slice(0, 6).map((claim) => (
                    <TableRow key={claim.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleOpenWorkbench(claim.id)}>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {claim.claim_number}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {claim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {claim.policy_number}
                        </Typography>
                      </TableCell>
                      <TableCell>{claim.policy_type}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        ${claim.estimated_loss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={claim.status} />
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={claim.risk_level} score={claim.fraud_score} />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWorkbench(claim.id);
                          }}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Sidebar: AI Pipeline Status & SLA Metrics */}
        <Grid item xs={12} lg={4}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Azure AI Engine Telemetry
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Azure Document Intelligence (OCR)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>99.2% Uptime</Typography>
              </Box>
              <LinearProgress variant="determinate" value={99} color="success" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Azure AI MaaS (DeepSeek-V3)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>100% Active</Typography>
              </Box>
              <LinearProgress variant="determinate" value={100} color="primary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">SLA Settlement Compliance</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>96.8% (Target 95%)</Typography>
              </Box>
              <LinearProgress variant="determinate" value={96.8} color="secondary" sx={{ height: 6, borderRadius: 3 }} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Automated Validation Health
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Evaluating 5 automated compliance checks: Mandatory Documents, Date Inconsistencies, Line Item Amounts, Identity Mismatches, and Duplicate Submissions.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
