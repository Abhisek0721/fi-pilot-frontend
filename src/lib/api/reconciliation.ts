import apiClient from './client';
import type { ReconciliationMatch } from '@/types';

export const reconciliationApi = {
  getUnmatched: async (): Promise<ReconciliationMatch[]> => {
    const res = await apiClient.get('/reconciliation/unmatched');
    return res.data.data ?? res.data;
  },

  match: async (data: {
    bankTransactionId: string;
    invoiceId?: string;
    billId?: string;
    paymentId?: string;
  }): Promise<ReconciliationMatch> => {
    const res = await apiClient.post('/reconciliation/match', data);
    return res.data.data ?? res.data;
  },

  getStatus: async () => {
    const res = await apiClient.get('/reconciliation/status');
    return res.data.data ?? res.data;
  },
};
