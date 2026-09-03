import { request } from '@/services/api-client';

export interface AIResponse {
  message: string;
}

const aiService = {
  chat(message: string) {
    return request<AIResponse>({
      method: 'POST',
      url: '/ai/chat',
      data: {
        message,
      },
    });
  },
};

export default aiService;