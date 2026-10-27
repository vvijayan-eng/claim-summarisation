import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { FileText, Eye, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { ClaimDocument } from '../types';

interface DocumentViewerModalProps {
  document: ClaimDocument | null;
  open: boolean;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  open,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!document) return null;

  const fields = document.extracted_fields || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <FileText size={22} color="#0062a3" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {document.file_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Category: {document.document_category} • File Type: {document.file_type} • Size: {(document.file_size_bytes / 1024).toFixed(1)} KB
            </Typography>
          </Box>
        </Box>
        <Chip
          icon={<ShieldCheck size={14} />}
          label={`OCR Confidence: ${(document.ocr_confidence * 100).toFixed(0)}%`}
          color="success"
          variant="outlined"
          size="small"
        />
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Structured Extracted Fields" />
          <Tab label="Raw OCR Text Stream" />
          <Tab label="Document Preview" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Data parsed by Azure AI Document Intelligence prebuilt model. All extracted key-value pairs are bound into the claim validation schema:
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableBody>
                  {Object.entries(fields).map(([key, val]) => (
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: 600, width: '35%', bgcolor: 'action.hover' }}>
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {Object.keys(fields).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        No custom structured fields detected for this document type.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {activeTab === 1 && (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              color: 'grey.100',
              borderRadius: 1,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            <pre style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {document.ocr_raw_text || 'No raw OCR stream available for this file.'}
            </pre>
          </Paper>
        )}

        {activeTab === 2 && (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              minHeight: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <FileText size={56} color="#64748b" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {document.file_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Document stored in secure Azure Blob Storage with AES-256 server-side encryption.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={() => alert(`Simulating secure download for ${document.file_name}`)}
            >
              Download Encrypted File Copy
            </Button>
          </Paper>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Audit Reference ID: DOC-{document.id}-{document.claim_id} • HIPAA/GDPR Encrypted
        </Typography>
        <Button onClick={onClose} variant="contained" color="primary">
          Close Viewer
        </Button>
      </DialogActions>
    </Dialog>
  );
};
