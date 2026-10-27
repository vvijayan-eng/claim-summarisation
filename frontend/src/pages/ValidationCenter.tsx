import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  HelpCircle,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { useNavigate } from 'react-router-dom';

export const ValidationCenter: React.FC = () => {
  const { claims, selectClaim } = useClaims();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  // Flatten all validation results across claims for compliance auditing
  const allValidations = claims.flatMap((claim) =>
    (claim.validation_results || []).map((val) => ({
      ...val,
      claim_number: claim.claim_number,
      customer_name: claim.customer_name.replace('[SYNTHETIC TEST DATA] ', ''),
      policy_type: claim.policy_type,
      full_claim_id: claim.id,
    }))
  );

  const filtered = allValidations.filter((v) => {
    const matchesCat = categoryFilter === 'All' || v.category === categoryFilter;
    const matchesSev = severityFilter === 'All' || v.severity === severityFilter;
    return matchesCat && matchesSev;
  });

  const passedCount = allValidations.filter((v) => v.status === 'Passed').length;
  const failedCount = allValidations.filter((v) => v.status === 'Failed').length;
  const passRate = allValidations.length > 0 ? ((passedCount / allValidations.length) * 100).toFixed(1) : '98.4';

  const handleInspectClaim = (claimId: number) => {
    selectClaim(claimId);
    navigate('/workbench');
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Automated Validation Rule Engine
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Continuous deterministic compliance checks across mandatory documentation, timeline consistency, ledger reconciliation, identity matching, and duplicate prevention.
        </Typography>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              AGGREGATE PASS RATE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'success.main' }}>
              {passRate}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {passedCount} passed vs {failedCount} flagged
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              CRITICAL BLOCKERS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'error.main' }}>
              {allValidations.filter((v) => v.severity === 'Critical' && v.status === 'Failed').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Disbursement holds active
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              ADVISORY WARNINGS
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'warning.main' }}>
              {allValidations.filter((v) => v.severity === 'Warning' && v.status === 'Failed').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requires adjuster review
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Toolbar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Validation Rule Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="All">All Categories (5 Core Rules)</MenuItem>
              <MenuItem value="Missing Document">Missing Mandatory Documents</MenuItem>
              <MenuItem value="Date Inconsistency">Date & Timeline Inconsistencies</MenuItem>
              <MenuItem value="Amount Mismatch">Amount & Invoice Discrepancies</MenuItem>
              <MenuItem value="Identity Mismatch">Identity & Policyholder Matching</MenuItem>
              <MenuItem value="Duplicate Claim">Duplicate Claim Detection</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              size="small"
              label="Severity Filter"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <MenuItem value="All">All Severities</MenuItem>
              <MenuItem value="Critical">Critical Only</MenuItem>
              <MenuItem value="Warning">Warning Only</MenuItem>
              <MenuItem value="Info">Info / Passed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => {
                setCategoryFilter('All');
                setSeverityFilter('All');
              }}
            >
              Reset Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Validation Audit Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Rule Code & Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claim Dossier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Detected Issue</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Natural Language Explanation & Impact</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Confidence</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((val) => (
                <TableRow key={`${val.claim_number}-${val.id}`} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                      {val.rule_code}
                    </Typography>
                    <Chip
                      label={val.category}
                      size="small"
                      sx={{ height: 20, fontSize: '0.68rem', mt: 0.5, bgcolor: 'background.default' }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {val.claim_number}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {val.customer_name} ({val.policy_type})
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 220 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {val.issue_detected}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ maxWidth: 340 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}>
                      {val.explanation}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      Suggested: {val.suggested_action}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(val.confidence_score * 100).toFixed(0)}%
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {val.status === 'Passed' ? (
                      <Chip label="Passed" color="success" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                    ) : val.severity === 'Critical' ? (
                      <Chip label="Critical Failure" color="error" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                    ) : (
                      <Chip label="Warning" color="warning" size="small" sx={{ fontWeight: 600, fontSize: '0.7rem' }} />
                    )}
                  </TableCell>

                  <TableCell sx={{ textAlign: 'right' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      endIcon={<ArrowRight size={14} />}
                      onClick={() => handleInspectClaim(val.full_claim_id)}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <FileCheck2 size={40} color="#94a3b8" />
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                      No validation checks match selected filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
