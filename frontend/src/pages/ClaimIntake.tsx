import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
} from '@mui/material';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  X,
  Zap,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';
import { claimsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const ClaimIntake: React.FC = () => {
  const { claims, fetchClaims, selectClaim } = useClaims();
  const navigate = useNavigate();

  const [selectedClaimId, setSelectedClaimId] = useState<number | string>(claims[0]?.id || 'NEW');
  const [docCategory, setDocCategory] = useState<string>('Supporting Document');
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // New Claim Form State (if creating from intake)
  const [newPolicyNum, setNewPolicyNum] = useState<string>('PA-AUTO-99820');
  const [newCustomerName, setNewCustomerName] = useState<string>('Jordan Reed');
  const [newPolicyType, setNewPolicyType] = useState<string>('Auto');
  const [newIncidentType, setNewIncidentType] = useState<string>('Rear-End Collision');
  const [newLoss, setNewLoss] = useState<number>(6400);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const incoming = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...incoming]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const incoming = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...incoming]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessUpload = async () => {
    if (files.length === 0) {
      alert('Please select or drag at least one document to upload.');
      return;
    }

    try {
      setIsUploading(true);
      let targetClaimId: number;

      if (selectedClaimId === 'NEW') {
        // Create new claim first
        const newClaim = await claimsApi.createClaim({
          policy_number: newPolicyNum,
          customer_name: newCustomerName,
          policy_type: newPolicyType as any,
          incident_type: newIncidentType,
          incident_date: new Date().toISOString() as any,
          estimated_loss: Number(newLoss),
          deductible: 500,
          region: 'North America - East',
          incident_description: `Intake submission for ${newPolicyType} incident.`,
        });
        targetClaimId = newClaim.id;
      } else {
        targetClaimId = Number(selectedClaimId);
      }

      // Upload documents with OCR extraction
      await claimsApi.uploadDocuments(targetClaimId, docCategory, files);

      // Auto-trigger validation, fraud scoring, and AI summary
      await claimsApi.runValidation(targetClaimId);
      await claimsApi.runFraudAnalysis(targetClaimId);
      await claimsApi.generateSummary(targetClaimId);

      setUploadSuccess(true);
      await fetchClaims();
      await selectClaim(targetClaimId);

      setTimeout(() => {
        navigate('/workbench');
      }, 1200);
    } catch (err) {
      console.error('Upload processing failed:', err);
      alert('Document ingestion pipeline encountered an error. Check console.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Claim Intake & Document Ingestion
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload PDF policies, police records, medical charts, repair estimates, and photos into the Azure Document Intelligence OCR pipeline.
        </Typography>
      </Box>

      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Documents successfully extracted via Azure OCR! Validation rules and AI summary generated. Redirecting to Claim Workbench...
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Step 1: Claim Selection / Header Info */}
        <Grid item xs={12} md={5}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              1. Associate With Claim Dossier
            </Typography>

            <TextField
              select
              fullWidth
              size="small"
              label="Target Claim"
              value={selectedClaimId}
              onChange={(e) => setSelectedClaimId(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="NEW">+ Create New Claim Record</MenuItem>
              {claims.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.claim_number} - {c.customer_name.replace('[SYNTHETIC TEST DATA] ', '')}
                </MenuItem>
              ))}
            </TextField>

            {selectedClaimId === 'NEW' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'primary.main' }}>
                  New Claim Parameters
                </Typography>
                <TextField
                  size="small"
                  label="Policy Number"
                  value={newPolicyNum}
                  onChange={(e) => setNewPolicyNum(e.target.value)}
                />
                <TextField
                  size="small"
                  label="Policyholder Name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                />
                <TextField
                  select
                  size="small"
                  label="Policy Line"
                  value={newPolicyType}
                  onChange={(e) => setNewPolicyType(e.target.value)}
                >
                  <MenuItem value="Auto">Auto Collision</MenuItem>
                  <MenuItem value="Property">Property & Casualty</MenuItem>
                  <MenuItem value="Health">Medical / Health</MenuItem>
                  <MenuItem value="Travel">Travel & Baggage</MenuItem>
                </TextField>
                <TextField
                  size="small"
                  label="Estimated Loss Demand ($)"
                  type="number"
                  value={newLoss}
                  onChange={(e) => setNewLoss(Number(e.target.value))}
                />
              </Box>
            )}

            <Box sx={{ mt: 2.5 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Document Classification Tag"
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
              >
                <MenuItem value="Police Report">Police Incident Report</MenuItem>
                <MenuItem value="Repair Estimate">Certified Repair Estimate</MenuItem>
                <MenuItem value="Invoice">Itemized Invoice / Bill</MenuItem>
                <MenuItem value="ID Proof">Government ID / Driver License</MenuItem>
                <MenuItem value="Medical Record">Medical & Hospital Record</MenuItem>
                <MenuItem value="Supporting Document">General Supporting Evidence</MenuItem>
              </TextField>
            </Box>
          </Paper>
        </Grid>

        {/* Step 2: Drag and Drop Ingestion Box */}
        <Grid item xs={12} md={7}>
          <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              2. Upload Files
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Supported: PDF, JPG, PNG, TIFF, DOCX, TXT (Encrypted via Azure Blob Storage)
            </Typography>

            {/* Drag & Drop Zone */}
            <Box
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              sx={{
                p: 4,
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 2,
                bgcolor: 'action.hover',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': { bgcolor: 'primary.light' },
              }}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.tiff,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <UploadCloud size={48} color="#0062a3" />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                Drag & drop files here, or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Multiple documents allowed for batch claim analysis
              </Typography>
            </Box>

            {/* Selected File List */}
            {files.length > 0 && (
              <Box sx={{ mt: 2.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                  Staged Files ({files.length}):
                </Typography>
                <List dense sx={{ mt: 0.5 }}>
                  {files.map((file, idx) => (
                    <ListItem
                      key={idx}
                      secondaryAction={
                        <IconButton edge="end" size="small" onClick={() => handleRemoveFile(idx)}>
                          <X size={14} />
                        </IconButton>
                      }
                      sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 0.5 }}
                    >
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <FileText size={16} color="#0062a3" />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={`${(file.size / 1024).toFixed(1)} KB • Tag: ${docCategory}`}
                        primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600 }}
                        secondaryTypographyProps={{ fontSize: '0.72rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                  Extracting OCR text & computing embeddings...
                </Typography>
                <LinearProgress sx={{ mt: 0.5, borderRadius: 1 }} />
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => setFiles([])}
                disabled={isUploading || files.length === 0}
              >
                Clear Files
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Zap size={16} />}
                onClick={handleProcessUpload}
                disabled={isUploading || files.length === 0}
              >
                {isUploading ? 'Ingesting...' : 'Ingest & Run AI Pipeline'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
