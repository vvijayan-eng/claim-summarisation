import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import {
  BarChart3,
  Clock,
  Zap,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  MapPin,
  PieChart,
  CheckCircle2,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, claims } = useClaims();

  const total = analytics?.total_claims || claims.length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Management Analytics & Operational KPIs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Executive performance metrics on document turnaround, AI review acceleration, validation fidelity, and regional fraud heatmaps.
        </Typography>
      </Box>

      {/* KPI Row 1: Primary Efficiency Benchmarks */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              AI REVIEW TIME
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'primary.main' }}>
              3.2 sec
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <Zap size={12} /> 99.4% faster than manual intake
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              ADJUSTER REVIEW TIME
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              6.4 min
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Baseline was 45.0 min (85% reduction)
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              AVG SETTLEMENT DURATION
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'secondary.main' }}>
              3.8 days
            </Typography>
            <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <TrendingUp size={12} /> Down from 14.2 days legacy
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              SLA REGULATORY COMPLIANCE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5, color: 'success.main' }}>
              96.8%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Industry benchmark: 90.0%
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Visualizations Grid */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Claims by Type */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PieChart size={18} color="#0062a3" />
              Volume Distribution by Policy Line
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Auto Collision & Casualty</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>45% ({Math.round(total * 0.45)} claims)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} color="primary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Property & Homeowners</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>30% ({Math.round(total * 0.30)} claims)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={30} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Medical & Hospitalization</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>15% ({Math.round(total * 0.15)} claims)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={15} color="info" sx={{ height: 8, borderRadius: 4 }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Travel & Cancellation</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>10% ({Math.round(total * 0.10)} claims)</Typography>
                </Box>
                <LinearProgress variant="determinate" value={10} color="warning" sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Processing Bottlenecks Analysis */}
        <Grid item xs={12} md={6}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={18} color="#0062a3" />
              Processing Bottleneck Diagnostics
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Step 1: Document Upload & Ingestion</Typography>
                  <Chip label="Optimal (< 1s)" color="success" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Stream direct to Azure Blob Storage with automated parallel chunking.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Step 2: OCR & Entity Extraction</Typography>
                  <Chip label="2.4s avg" color="success" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Azure Document Intelligence prebuilt model inference.
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Step 3: Customer Document Fulfillment</Typography>
                  <Chip label="Bottleneck (48h)" color="warning" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Delays primarily occur awaiting claimant response to missing driver license or invoice requests.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Regional Fraud Heatmap Table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapPin size={18} color="#0062a3" />
            Regional Fraud Risk Heatmap & Underwriting Exposure
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'background.paper' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Operating Region</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>High Risk Claims</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Medium Risk Claims</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Low Risk Claims</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>SIU Triage Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.fraud_heatmap?.map((item) => (
                <TableRow key={item.region} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{item.region}</TableCell>
                  <TableCell>
                    <Chip label={`${item.high_risk} files`} color={item.high_risk > 1 ? 'error' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={`${item.medium_risk} files`} color={item.medium_risk > 2 ? 'warning' : 'default'} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={`${item.low_risk} files`} color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: item.high_risk > 1 ? 'error.main' : 'text.secondary' }}>
                      {item.high_risk > 1 ? 'Active SIU Investigation' : 'Normal Operations'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading heatmap data...
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
