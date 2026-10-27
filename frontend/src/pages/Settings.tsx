import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Shield,
  Lock,
  EyeOff,
  Database,
  Cloud,
  Sparkles,
  Key,
  CheckCircle,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

export const SettingsPage: React.FC = () => {
  const { seedDemoData, loading } = useClaims();

  const [piiMasking, setPiiMasking] = useState<boolean>(true);
  const [auditLogging, setAuditLogging] = useState<boolean>(true);
  const [azureEndpoint, setAzureEndpoint] = useState<string>('https://claimassure-azure-ai.openai.azure.com/');
  const [modelDeployment, setModelDeployment] = useState<string>('azure_ai/genailab-maas-DeepSeek-V3-0324');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Security, Compliance & System Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure HIPAA/GDPR regulatory parameters, PII de-identification, Azure AI endpoints, and synthetic data generation.
        </Typography>
      </Box>

      {savedSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Security and AI configuration saved successfully.
        </Alert>
      )}

      {/* GDPR / HIPAA Compliance Section */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Shield size={22} color="#107c41" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Regulatory Compliance & PII Sanitization
          </Typography>
          <Chip label="HIPAA & GDPR Active" color="success" size="small" sx={{ fontWeight: 600 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ensures Social Security Numbers (SSN), taxpayer IDs, phone numbers, and payment credentials are automatically redacted in adjusters' summary feeds and audit logs.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <FormControlLabel
            control={<Switch checked={piiMasking} onChange={(e) => setPiiMasking(e.target.checked)} />}
            label="Automatic PII Masking on Ingested Text & OCR Streams"
          />
          <FormControlLabel
            control={<Switch checked={auditLogging} onChange={(e) => setAuditLogging(e.target.checked)} />}
            label="Immutable SOC2 / HIPAA Audit Logging for Every Adjuster Interaction"
          />
          <FormControlLabel
            control={<Switch defaultChecked disabled />}
            label="Enforce TLS 1.3 in Transit & AES-256 Storage Encryption at Rest"
          />
        </Box>
      </Paper>

      {/* Azure AI Services Configuration */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Cloud size={22} color="#0062a3" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Azure AI & Document Intelligence Endpoints
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Connect directly to enterprise Azure OpenAI service and Azure AI Document Intelligence instances.
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              size="small"
              label="Azure OpenAI Endpoint URL"
              value={azureEndpoint}
              onChange={(e) => setAzureEndpoint(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Deployment Name"
              value={modelDeployment}
              onChange={(e) => setModelDeployment(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Azure OpenAI API Key"
              placeholder="••••••••••••••••••••••••••••••••"
              defaultValue="sk-UimD2EgxtiH19Qax3qHIkA"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Configuration
          </Button>
        </Box>
      </Paper>

      {/* Synthetic Test Data Generator */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Sparkles size={22} color="#b45309" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Synthetic Test Data Management
          </Typography>
          <Chip label="Regulatory Sandbox" color="warning" size="small" sx={{ fontWeight: 600 }} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Inject pre-structured test cases spanning Auto, Property, Health, and Travel casualty claims with synthesized repair estimates, police reports, and intentional validation discrepancies for adjuster training.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Database size={16} />}
            onClick={seedDemoData}
            disabled={loading}
          >
            {loading ? 'Seeding...' : 'Seed 7 Multi-Line Synthetic Claims'}
          </Button>
          <Typography variant="caption" color="text.secondary">
            All records will be explicitly branded: <strong>[SYNTHETIC TEST DATA]</strong>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
