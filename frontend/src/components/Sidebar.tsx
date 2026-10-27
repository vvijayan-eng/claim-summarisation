import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import {
  LayoutDashboard,
  Inbox,
  FileCheck2,
  ShieldAlert,
  BarChart3,
  UploadCloud,
  FileSpreadsheet,
  Settings,
  Shield,
  Layers,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: 'Executive Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Claims Queue', path: '/queue', icon: <Inbox size={20} /> },
    { label: 'Claim Workbench', path: '/workbench', icon: <FileSpreadsheet size={20} />, badge: 'AI Powered' },
    { label: 'Intake & Upload', path: '/intake', icon: <UploadCloud size={20} /> },
    { label: 'Validation Center', path: '/validation', icon: <FileCheck2 size={20} /> },
    { label: 'Fraud Review (SIU)', path: '/fraud', icon: <ShieldAlert size={20} /> },
    { label: 'Analytics & KPIs', path: '/analytics', icon: <BarChart3 size={20} /> },
    { label: 'System Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Brand Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '8px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,98,163,0.3)',
          }}
        >
          <Shield size={22} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
            ClaimAssure AI
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.72rem' }}>
            Enterprise Claims Platform
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List sx={{ px: 1.5, py: 2 }}>
        {navItems.map((item) => {
          const isSelected = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isSelected}
                sx={{
                  borderRadius: '6px',
                  py: 1,
                  px: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 600 : 500,
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="primary"
                    sx={{ height: 18, fontSize: '0.65rem', fontWeight: 600 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* Compliance Notice Footer */}
      <Box sx={{ p: 2, m: 1.5, bgcolor: 'background.default', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Layers size={16} color="#0062a3" />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Azure AI & Compliance
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
          HIPAA Compatible • GDPR • SOC2
          <br />
          Azure OpenAI GPT-4o Active
        </Typography>
      </Box>
    </Drawer>
  );
};
