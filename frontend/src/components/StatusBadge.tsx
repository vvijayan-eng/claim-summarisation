import React from 'react';
import { Chip } from '@mui/material';
import { ClaimStatus } from '../types';

interface StatusBadgeProps {
  status: ClaimStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Approved':
        return {
          bg: '#e6f4ea',
          color: '#137333',
          border: '#ceead6',
          label: 'Approved',
        };
      case 'Validation Failed':
        return {
          bg: '#fce8e6',
          color: '#c5221f',
          border: '#fad2cf',
          label: 'Validation Failed',
        };
      case 'Escalated':
        return {
          bg: '#fef7e0',
          color: '#b06000',
          border: '#feefc3',
          label: 'Escalated (SIU)',
        };
      case 'Under Review':
        return {
          bg: '#e8f0fe',
          color: '#1a73e8',
          border: '#d2e3fc',
          label: 'Under Review',
        };
      case 'Processing':
        return {
          bg: '#f3e8fd',
          color: '#8430ce',
          border: '#e9d5ff',
          label: 'Processing (AI)',
        };
      case 'Uploaded':
        return {
          bg: '#f1f3f4',
          color: '#5f6368',
          border: '#dadce0',
          label: 'Uploaded',
        };
      case 'Closed':
        return {
          bg: '#e2e8f0',
          color: '#475569',
          border: '#cbd5e1',
          label: 'Closed',
        };
      default:
        return {
          bg: '#f1f3f4',
          color: '#5f6368',
          border: '#dadce0',
          label: status,
        };
    }
  };

  const style = getStyle();

  return (
    <Chip
      size={size}
      label={style.label}
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.72rem' : '0.82rem',
        borderRadius: '6px',
      }}
    />
  );
};
