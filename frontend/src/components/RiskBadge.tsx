import React from 'react';
import { Box, Typography } from '@mui/material';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, showScore = true }) => {
  const getColor = () => {
    switch (level) {
      case 'High':
        return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', bar: '#dc2626' };
      case 'Medium':
        return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', bar: '#f59e0b' };
      case 'Low':
      default:
        return { bg: '#dcfce7', text: '#166534', border: '#86efac', bar: '#16a34a' };
    }
  };

  const c = getColor();

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.8,
        px: 1.2,
        py: 0.3,
        borderRadius: '6px',
        backgroundColor: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: c.bar,
        }}
      />
      <Typography variant="caption" sx={{ fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {level} RISK {showScore && score !== undefined && `(${Math.round(score)}/100)`}
      </Typography>
    </Box>
  );
};
