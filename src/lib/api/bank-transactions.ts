import apiClient from './client';
import type { BankTransaction, PaginatedResponse, TransactionStatus } from '@/types';

interface TransactionListParams {
  page?: number;
  limit?: number;
  status?: TransactionStatus;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  bankAccountId?: string;
}

export const bankTransactionsApi = {
  list: async (params?: TransactionListParams): Promise<PaginatedResponse<BankTransaction>> => {
    const res = await apiClient.get('/bank-transactions', { params });
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<BankTransaction> => {
    const res = await apiClient.get(`/bank-transactions/${id}`);
    return res.data.data ?? res.data;
  },

  approve: async (id: string): Promise<BankTransaction> => {
    const res = await apiClient.patch(`/bank-transactions/${id}/approve`);
    return res.data.data ?? res.data;
  },

  categorize: async (
    id: string,
    data: { category: string; categoryReason?: string },
  ): Promise<BankTransaction> => {
    const res = await apiClient.patch(`/bank-transactions/${id}/categorize`, data);
    return res.data.data ?? res.data;
  },
};
