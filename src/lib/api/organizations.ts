import apiClient from './client';
import type { Organization, OrganizationMember, CreateOrganizationFormData } from '@/types';

export const organizationsApi = {
  create: async (data: CreateOrganizationFormData): Promise<Organization> => {
    const res = await apiClient.post('/organizations', data);
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Organization> => {
    const res = await apiClient.get(`/organizations/${id}`);
    return res.data.data ?? res.data;
  },

  update: async (id: string, data: Partial<CreateOrganizationFormData>): Promise<Organization> => {
    const res = await apiClient.put(`/organizations/${id}`, data);
    return res.data.data ?? res.data;
  },

  getMembers: async (id: string): Promise<OrganizationMember[]> => {
    const res = await apiClient.get(`/organizations/${id}/members`);
    return res.data.data ?? res.data;
  },

  addMember: async (id: string, data: { email: string; role: string }): Promise<OrganizationMember> => {
    const res = await apiClient.post(`/organizations/${id}/members`, data);
    return res.data.data ?? res.data;
  },
};
