import { request } from "./api-client";

export interface ChatCreate {
  message: string;
}

export interface AIChatResponse {
  reply: string;
}

export interface ChatResponse {
  message_id: number;
  sender: string;
  message_text: string;
  log_date: string;
}

export const chatService = {
  async send(message: string): Promise<AIChatResponse> {
    return request<AIChatResponse>({
      method: "POST",
      url: "/chat",
      data: {
        message,
      },
    });
  },

  async history(): Promise<ChatResponse[]> {
    return request<ChatResponse[]>({
      method: "GET",
      url: "/chat",
    });
  },
};

export default chatService;