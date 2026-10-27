import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  Button,
  Chip,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Search, Filter, RefreshCw, Eye, ArrowUpDown, FileText } from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { StatusBadge } from '../components/StatusBadge';
import { RiskBadge } from '../components/RiskBadge';
import { useNavigate } from 'react-router-dom';
import { ClaimStatus, RiskLevel, PolicyType } from '../types';

export const ClaimsQueue: React.FC = () => {
  const { claims, selectClaim, fetchClaims, loading } = useClaims();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claim_number.toLowerCase().includes(search.toLowerCase()) ||
      claim.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      claim.policy_number.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || claim.status === statusFilter;
    const matchesRisk = riskFilter === 'All' || claim.risk_level === riskFilter;
    const matchesType = typeFilter === 'All' || claim.policy_type === typeFilter;

    return matchesSearch && matchesStatus && matchesRisk && matchesType;
  });

  const handleReview = (id: number) => {
    selectClaim(id);
    navigate('/workbench');
  };

  return (
    <Box>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Claims Operational Queue
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage incoming claims dossiers, review automated validation status, and assign adjusters.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => fetchClaims()}
          disabled={loading}
        >
          Refresh Feed
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Filter by Claim #, Insured Name, Policy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6} sm={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Claim Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Uploaded">Uploaded</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Under Review">Under Review</MenuItem>
              <MenuItem value="Validation Failed">Validation Failed</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Escalated">Escalated</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Fraud Risk Level"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <MenuItem value="All">All Risk Levels</MenuItem>
              <MenuItem value="Low">Low Risk</MenuItem>
              <MenuItem value="Medium">Medium Risk</MenuItem>
              <MenuItem value="High">High Risk</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={2.5}>
            <TextField
              select
              fullWidth
              size="small"
              label="Policy Line"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="All">All Lines</MenuItem>
              <MenuItem value="Auto">Auto</MenuItem>
              <MenuItem value="Property">Property</MenuItem>
              <MenuItem value="Health">Health / Medical</MenuItem>
              <MenuItem value="Travel">Travel</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} sm={0.5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              size="small"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setRiskFilter('All');
                setTypeFilter('All');
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Claims Queue Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Claim Dossier</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Policyholder</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Line & Incident</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Filed Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Claimed Amount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Validation Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Risk Score</TableCell>
                <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>Workbench</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow
                  key={claim.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleReview(claim.id)}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {claim.claim_number}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {claim.documents?.length || 0} document(s) attached
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {claim.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Policy: {claim.policy_number}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {claim.policy_type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {claim.incident_type}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {new Date(claim.claim_filed_date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Loss: {new Date(claim.incident_date).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      ${claim.estimated_loss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ded: ${claim.deductible}
                    </Typography>
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
                      variant="contained"
                      color="primary"
                      startIcon={<Eye size={14} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReview(claim.id);
                      }}
                    >
                      Open Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredClaims.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <FileText size={40} color="#94a3b8" />
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                      No claims match current filter criteria
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Try clearing filters or search term
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
