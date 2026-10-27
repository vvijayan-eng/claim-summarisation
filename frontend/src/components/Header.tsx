import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Paper,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useClaims } from '../context/ClaimsContext';

export const Header: React.FC = () => {
  const { mode, toggleTheme, seedDemoData } = useClaims();

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
        {/* Left Side: Synthetic Data Warning Banner */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={<AlertTriangle size={14} color="#d97706" />}
            label="SYNTHETIC TEST DATA ACTIVE - REGULATORY SANDBOX"
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fcd34d',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.04em',
            }}
          />
        </Box>

        {/* Center: Search Field */}
        <Paper
          component="form"
          variant="outlined"
          sx={{
            p: '2px 8px',
            display: 'flex',
            alignItems: 'center',
            width: 360,
            borderRadius: '6px',
            bgcolor: 'background.default',
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Search size={18} color="#94a3b8" />
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '0.88rem' }}
            placeholder="Search claim #, customer, policy..."
            inputProps={{ 'aria-label': 'search claims' }}
          />
        </Paper>

        {/* Right Side Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title="Generate Realistic Synthetic Claims">
            <Chip
              icon={<Sparkles size={14} />}
              label="Generate Sample Data"
              variant="outlined"
              size="small"
              onClick={seedDemoData}
              sx={{ cursor: 'pointer', fontWeight: 600, borderColor: 'primary.main', color: 'primary.main' }}
            />
          </Tooltip>

          <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
            <IconButton onClick={toggleTheme} size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications (3 unread)">
            <IconButton size="small" sx={{ border: '1px solid', borderColor: 'divider' }}>
              <Bell size={18} />
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.85rem' }}>
              AH
            </Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                Alexander Hayes
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Senior Claims Adjuster
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
