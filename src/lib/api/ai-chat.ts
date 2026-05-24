import apiClient from './client';
import type { AiChatMessage, PaginatedResponse } from '@/types';

export const aiChatApi = {
  getHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<AiChatMessage>> => {
    const res = await apiClient.get('/ai-chat/history', { params });
    return res.data.data ?? res.data;
  },

  sendMessage: async (message: string): Promise<AiChatMessage> => {
    const res = await apiClient.post('/ai-chat/message', { message });
    return res.data.data ?? res.data;
  },
};
