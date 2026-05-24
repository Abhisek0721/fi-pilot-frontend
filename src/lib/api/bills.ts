import apiClient from './client';
import type { Bill, PaginatedResponse, BillStatus } from '@/types';

interface BillListParams {
  page?: number;
  limit?: number;
  status?: BillStatus;
  vendorId?: string;
}

interface CreateBillData {
  vendorId: string;
  billNumber: string;
  billDate: string;
  dueDate?: string;
  currency: string;
  notes?: string;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    hsnSac?: string;
  }[];
}

export const billsApi = {
  create: async (data: CreateBillData): Promise<Bill> => {
    const res = await apiClient.post('/bills', data);
    return res.data.data ?? res.data;
  },

  list: async (params?: BillListParams): Promise<PaginatedResponse<Bill>> => {
    const res = await apiClient.get('/bills', { params });
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Bill> => {
    const res = await apiClient.get(`/bills/${id}`);
    return res.data.data ?? res.data;
  },

  update: async (id: string, data: Partial<CreateBillData>): Promise<Bill> => {
    const res = await apiClient.put(`/bills/${id}`, data);
    return res.data.data ?? res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/bills/${id}`);
  },

  markPaid: async (id: string): Promise<Bill> => {
    const res = await apiClient.post(`/bills/${id}/mark-paid`);
    return res.data.data ?? res.data;
  },

  getOverdue: async (): Promise<Bill[]> => {
    const res = await apiClient.get('/bills/overdue');
    return res.data.data ?? res.data;
  },

  getAging: async () => {
    const res = await apiClient.get('/bills/aging');
    return res.data.data ?? res.data;
  },
};
