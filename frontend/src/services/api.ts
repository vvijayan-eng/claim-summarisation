import axios from 'axios';
import { Claim, ClaimStatus, AnalyticsKPIs, ClaimDocument } from '../types';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const claimsApi = {
  getClaims: async (params?: {
    status?: string;
    risk_level?: string;
    policy_type?: string;
    search?: string;
  }): Promise<Claim[]> => {
    const res = await apiClient.get('/claims', { params });
    return res.data;
  },

  getClaimById: async (id: number): Promise<Claim> => {
    const res = await apiClient.get(`/claims/${id}`);
    return res.data;
  },

  createClaim: async (data: Partial<Claim>): Promise<Claim> => {
    const res = await apiClient.post('/claims', data);
    return res.data;
  },

  updateStatus: async (
    id: number,
    status: ClaimStatus,
    notes?: string,
    adjusterName?: string
  ): Promise<Claim> => {
    const res = await apiClient.put(`/claims/${id}/status`, {
      status,
      notes,
      adjuster_name: adjusterName || 'Claims Adjuster',
    });
    return res.data;
  },

  addNotes: async (id: number, notes: string, adjusterName?: string): Promise<Claim> => {
    const res = await apiClient.put(`/claims/${id}/notes`, {
      notes,
      adjuster_name: adjusterName || 'Claims Adjuster',
    });
    return res.data;
  },

  escalateClaim: async (id: number, reason: string): Promise<Claim> => {
    const res = await apiClient.post(`/claims/${id}/escalate?reason=${encodeURIComponent(reason)}`);
    return res.data;
  },

  uploadDocuments: async (
    claimId: number,
    category: string,
    files: File[]
  ): Promise<ClaimDocument[]> => {
    const formData = new FormData();
    formData.append('claim_id', claimId.toString());
    formData.append('document_category', category);
    files.forEach((file) => formData.append('files', file));

    const res = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  runValidation: async (claimId: number): Promise<Claim> => {
    const res = await apiClient.post(`/validate/${claimId}`);
    return res.data;
  },

  runFraudAnalysis: async (claimId: number): Promise<Claim> => {
    const res = await apiClient.post(`/fraud-score/${claimId}`);
    return res.data;
  },

  generateSummary: async (claimId: number): Promise<Claim> => {
    const res = await apiClient.post(`/summarize/${claimId}`);
    return res.data;
  },

  getAnalyticsKPIs: async (): Promise<AnalyticsKPIs> => {
    const res = await apiClient.get('/analytics/kpis');
    return res.data;
  },

  seedSyntheticData: async (): Promise<{ message: string; count: number }> => {
    const res = await apiClient.post('/analytics/synthetic/seed');
    return res.data;
  },
};
