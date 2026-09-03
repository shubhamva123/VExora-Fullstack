import { request } from './api-client';
import type { CalendarEvent, RevisionItem, Conversation, ChatMessage, AppNotification, AnalyticsDataPoint, ActivitySeries } from '@/types';

export const calendarService = {
  async list(params?: { from?: string; to?: string }): Promise<CalendarEvent[]> {
    return request<CalendarEvent[]>({ method: 'GET', url: '/calendar', params });
  },
  async create(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return request<CalendarEvent>({ method: 'POST', url: '/calendar', data });
  },
  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return request<CalendarEvent>({ method: 'PATCH', url: `/calendar/${id}`, data });
  },
  async remove(id: string): Promise<void> {
    return request<void>({ method: 'DELETE', url: `/calendar/${id}` });
  },
};

export const revisionService = {
  async list(): Promise<RevisionItem[]> {
    return request<RevisionItem[]>({ method: 'GET', url: '/revisions' });
  },
  async create(data: Partial<RevisionItem>): Promise<RevisionItem> {
    return request<RevisionItem>({ method: 'POST', url: '/revisions', data });
  },
  async markComplete(id: string): Promise<RevisionItem> {
    return request<RevisionItem>({ method: 'POST', url: `/revisions/${id}/complete` });
  },
};

export const chatService = {
  async listConversations(): Promise<Conversation[]> {
    return request<Conversation[]>({ method: 'GET', url: '/chat/conversations' });
  },
  async getConversation(id: string): Promise<Conversation> {
    return request<Conversation>({ method: 'GET', url: `/chat/conversations/${id}` });
  },
  async createConversation(title?: string): Promise<Conversation> {
    return request<Conversation>({ method: 'POST', url: '/chat/conversations', data: { title } });
  },
  async renameConversation(id: string, title: string): Promise<Conversation> {
    return request<Conversation>({ method: 'PATCH', url: `/chat/conversations/${id}`, data: { title } });
  },
  async deleteConversation(id: string): Promise<void> {
    return request<void>({ method: 'DELETE', url: `/chat/conversations/${id}` });
  },
  async togglePin(id: string): Promise<Conversation> {
    return request<Conversation>({ method: 'POST', url: `/chat/conversations/${id}/pin` });
  },
  async sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
    return request<ChatMessage>({
      method: 'POST',
      url: `/chat/conversations/${conversationId}/messages`,
      data: { content },
    });
  },
  /** Returns an Abortable stream placeholder — wire to SSE/WebSocket when backend is ready. */
  async *streamMessage(_conversationId: string, _content: string): AsyncGenerator<string> {
    // TODO: connect to backend streaming endpoint (SSE or WebSocket)
    yield '';
  },
};

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    return request<AppNotification[]>({ method: 'GET', url: '/notifications' });
  },
  async markRead(id: string): Promise<void> {
    return request<void>({ method: 'POST', url: `/notifications/${id}/read` });
  },
  async markAllRead(): Promise<void> {
    return request<void>({ method: 'POST', url: '/notifications/read-all' });
  },
};

export const analyticsService = {
  async weekly(): Promise<AnalyticsDataPoint[]> {
    return request<AnalyticsDataPoint[]>({ method: 'GET', url: '/analytics/weekly' });
  },
  async monthly(): Promise<AnalyticsDataPoint[]> {
    return request<AnalyticsDataPoint[]>({ method: 'GET', url: '/analytics/monthly' });
  },
  async series(): Promise<ActivitySeries[]> {
    return request<ActivitySeries[]>({ method: 'GET', url: '/analytics/series' });
  },
};

export const summaryService = {
  async daily(date?: string): Promise<unknown> {
    return request({ method: 'GET', url: '/summary/daily', params: { date } });
  },
};
