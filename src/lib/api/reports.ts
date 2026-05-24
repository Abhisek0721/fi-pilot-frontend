import apiClient from './client';
import type { PnLReport, BalanceSheet, CashFlowReport } from '@/types';

export const reportsApi = {
  getPnL: async (period?: string): Promise<PnLReport> => {
    const res = await apiClient.get('/reports/pnl', { params: { period } });
    return res.data.data ?? res.data;
  },

  getBalanceSheet: async (): Promise<BalanceSheet> => {
    const res = await apiClient.get('/reports/balance-sheet');
    return res.data.data ?? res.data;
  },

  getCashFlow: async (period?: string): Promise<CashFlowReport> => {
    const res = await apiClient.get('/reports/cash-flow', { params: { period } });
    return res.data.data ?? res.data;
  },

  getTrialBalance: async () => {
    const res = await apiClient.get('/reports/trial-balance');
    return res.data.data ?? res.data;
  },

  getReceivablesAging: async () => {
    const res = await apiClient.get('/reports/receivables-aging');
    return res.data.data ?? res.data;
  },

  getPayablesAging: async () => {
    const res = await apiClient.get('/reports/payables-aging');
    return res.data.data ?? res.data;
  },
};
