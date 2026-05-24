import apiClient from './client';
import type { AiInsight, PaginatedResponse, InsightType } from '@/types';

export const aiInsightsApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<PaginatedResponse<AiInsight>> => {
    const res = await apiClient.get('/ai-insights', { params });
    return res.data.data ?? res.data;
  },

  generate: async (data: { type: InsightType; period?: string }): Promise<AiInsight> => {
    const res = await apiClient.post('/ai-insights/generate', data);
    return res.data.data ?? res.data;
  },

  markRead: async (id: string): Promise<AiInsight> => {
    const res = await apiClient.patch(`/ai-insights/${id}/read`);
    return res.data.data ?? res.data;
  },
};
