import React, { createContext, useContext, useState, useEffect } from 'react';
import { Claim, ClaimStatus, AnalyticsKPIs } from '../types';
import { claimsApi } from '../services/api';

interface ClaimsContextType {
  claims: Claim[];
  loading: boolean;
  selectedClaim: Claim | null;
  analytics: AnalyticsKPIs | null;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  fetchClaims: (params?: any) => Promise<void>;
  selectClaim: (id: number) => Promise<void>;
  updateClaimStatus: (id: number, status: ClaimStatus, notes?: string) => Promise<void>;
  addNotesToClaim: (id: number, notes: string) => Promise<void>;
  escalateClaimToSIU: (id: number, reason: string) => Promise<void>;
  reRunValidation: (id: number) => Promise<void>;
  reRunFraudCheck: (id: number) => Promise<void>;
  reGenerateSummary: (id: number) => Promise<void>;
  seedDemoData: () => Promise<void>;
}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const ClaimsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsKPIs | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const fetchClaims = async (params?: any) => {
    try {
      setLoading(true);
      const data = await claimsApi.getClaims(params);
      setClaims(data);
      if (data.length > 0 && !selectedClaim) {
        setSelectedClaim(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectClaim = async (id: number) => {
    try {
      setLoading(true);
      const claim = await claimsApi.getClaimById(id);
      setSelectedClaim(claim);
    } catch (err) {
      console.error('Failed to fetch claim detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (id: number, status: ClaimStatus, notes?: string) => {
    try {
      const updated = await claimsApi.updateStatus(id, status, notes);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedClaim?.id === id) {
        setSelectedClaim(updated);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const addNotesToClaim = async (id: number, notes: string) => {
    try {
      const updated = await claimsApi.addNotes(id, notes);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedClaim?.id === id) {
        setSelectedClaim(updated);
      }
    } catch (err) {
      console.error('Failed to add notes:', err);
    }
  };

  const escalateClaimToSIU = async (id: number, reason: string) => {
    try {
      const updated = await claimsApi.escalateClaim(id, reason);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (selectedClaim?.id === id) {
        setSelectedClaim(updated);
      }
    } catch (err) {
      console.error('Failed to escalate claim:', err);
    }
  };

  const reRunValidation = async (id: number) => {
    try {
      setLoading(true);
      const updated = await claimsApi.runValidation(id);
      setSelectedClaim(updated);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Validation execution error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reRunFraudCheck = async (id: number) => {
    try {
      setLoading(true);
      const updated = await claimsApi.runFraudAnalysis(id);
      setSelectedClaim(updated);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('Fraud analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reGenerateSummary = async (id: number) => {
    try {
      setLoading(true);
      const updated = await claimsApi.generateSummary(id);
      setSelectedClaim(updated);
      setClaims((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error('AI summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  const seedDemoData = async () => {
    try {
      setLoading(true);
      await claimsApi.seedSyntheticData();
      await fetchClaims();
    } catch (err) {
      console.error('Seeding error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
    claimsApi.getAnalyticsKPIs().then(setAnalytics).catch(() => {});
  }, []);

  return (
    <ClaimsContext.Provider
      value={{
        claims,
        loading,
        selectedClaim,
        analytics,
        mode,
        toggleTheme,
        fetchClaims,
        selectClaim,
        updateClaimStatus,
        addNotesToClaim,
        escalateClaimToSIU,
        reRunValidation,
        reRunFraudCheck,
        reGenerateSummary,
        seedDemoData,
      }}
    >
      {children}
    </ClaimsContext.Provider>
  );
};

export const useClaims = () => {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
};
