import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { Shield, KeyRound, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('alexander.hayes@carrier-claims.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        p: 2,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 440,
          borderRadius: 3,
          bgcolor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '12px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              mx: 'auto',
              mb: 1.5,
              boxShadow: '0 4px 12px rgba(0,98,163,0.3)',
            }}
          >
            <Shield size={28} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ClaimAssure AI
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Enterprise Insurance Claims Summarization & Validation
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3, fontSize: '0.8rem' }}>
          Role-Based Access Control (RBAC): Adjuster / SIU / Management portal. Single Sign-On (SSO) compliant.
        </Alert>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Enterprise Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<LogIn size={18} />}
              sx={{ mt: 1, py: 1.2 }}
            >
              Sign In to Claims Console
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Typography variant="caption" color="text.secondary">
            OR ENTERPRISE FEDERATION
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<KeyRound size={16} />}
          onClick={() => navigate('/')}
        >
          Authenticate via Microsoft Entra ID (Azure AD SSO)
        </Button>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            HIPAA SOC2 Type II Certified • GDPR Compliant
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};
