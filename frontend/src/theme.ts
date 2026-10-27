import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#0062a3' : '#3894dc', // Microsoft Fluent Blue
        light: '#e1f0fa',
        dark: '#004578',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#107c41', // Fluent Green / Approval Accent
        light: '#dff6dd',
        dark: '#0b5a2f',
      },
      error: {
        main: '#d13438',
        light: '#fde7e9',
      },
      warning: {
        main: '#ca5010',
        light: '#fdf3eb',
      },
      info: {
        main: '#0078d4',
        light: '#eff6fc',
      },
      background: {
        default: mode === 'light' ? '#f3f4f6' : '#0f172a',
        paper: mode === 'light' ? '#ffffff' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#1e293b' : '#f8fafc',
        secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      },
      divider: mode === 'light' ? '#e2e8f0' : '#334155',
    },
    typography: {
      fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, "Inter", sans-serif',
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.1rem',
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
