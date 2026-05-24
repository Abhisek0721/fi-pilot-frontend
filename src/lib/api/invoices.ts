import apiClient from './client';
import type { Invoice, PaginatedResponse, CreateInvoiceFormData, InvoiceStatus } from '@/types';

interface InvoiceListParams {
  page?: number;
  limit?: number;
  status?: InvoiceStatus;
  customerId?: string;
}

export const invoicesApi = {
  create: async (data: CreateInvoiceFormData): Promise<Invoice> => {
    const res = await apiClient.post('/invoices', data);
    return res.data.data ?? res.data;
  },

  list: async (params?: InvoiceListParams): Promise<PaginatedResponse<Invoice>> => {
    const res = await apiClient.get('/invoices', { params });
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Invoice> => {
    const res = await apiClient.get(`/invoices/${id}`);
    return res.data.data ?? res.data;
  },

  update: async (id: string, data: Partial<CreateInvoiceFormData>): Promise<Invoice> => {
    const res = await apiClient.put(`/invoices/${id}`, data);
    return res.data.data ?? res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/invoices/${id}`);
  },

  markSent: async (id: string): Promise<Invoice> => {
    const res = await apiClient.post(`/invoices/${id}/mark-sent`);
    return res.data.data ?? res.data;
  },

  markPaid: async (id: string): Promise<Invoice> => {
    const res = await apiClient.post(`/invoices/${id}/mark-paid`);
    return res.data.data ?? res.data;
  },

  getOverdue: async (): Promise<Invoice[]> => {
    const res = await apiClient.get('/invoices/overdue');
    return res.data.data ?? res.data;
  },

  getAging: async () => {
    const res = await apiClient.get('/invoices/aging');
    return res.data.data ?? res.data;
  },
};
