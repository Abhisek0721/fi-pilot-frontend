import apiClient from './client';
import type { Document, PaginatedResponse, DocumentType, DocumentStatus } from '@/types';

interface DocumentListParams {
  page?: number;
  limit?: number;
  type?: DocumentType;
  status?: DocumentStatus;
}

export const documentsApi = {
  upload: async (file: File, type: DocumentType): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const res = await apiClient.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data ?? res.data;
  },

  list: async (params?: DocumentListParams): Promise<PaginatedResponse<Document>> => {
    const res = await apiClient.get('/documents', { params });
    return res.data.data ?? res.data;
  },

  getById: async (id: string): Promise<Document> => {
    const res = await apiClient.get(`/documents/${id}`);
    return res.data.data ?? res.data;
  },

  updateStatus: async (id: string, status: DocumentStatus): Promise<Document> => {
    const res = await apiClient.patch(`/documents/${id}/status`, { status });
    return res.data.data ?? res.data;
  },
};
