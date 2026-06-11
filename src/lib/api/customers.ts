import apiClient from './client';
import type { Customer, PaginatedResponse } from '@/types';

interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface CreateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  taxNumber?: string;
  address?: string;
}

export const customersApi = {
  list: async (params?: CustomerListParams): Promise<PaginatedResponse<Customer>> => {
    const res = await apiClient.get('/customers', { params });
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const res = await apiClient.get(`/customers/${id}`);
    return res.data.data ?? res.data;
  },

  create: async (data: CreateCustomerData): Promise<Customer> => {
    const res = await apiClient.post('/customers', data);
    return res.data.data ?? res.data;
  },

  update: async (id: string, data: Partial<CreateCustomerData>): Promise<Customer> => {
    const res = await apiClient.put(`/customers/${id}`, data);
    return res.data.data ?? res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
