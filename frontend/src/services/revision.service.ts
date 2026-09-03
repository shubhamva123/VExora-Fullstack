import { request } from '@/services/api-client';

export interface Revision {
  revision_id: number;
  note_id: number;
  revision_number: number;
  scheduled_date: string;
  completed_date: string | null;
  status: string;
  interval_days: number;
  ease_factor: number;
  quality_score: number | null;
}

export interface CreateRevisionData {
  note_id: number;
  scheduled_date: string;
}

export const revisionService = {
  getRevisions() {
    return request<Revision[]>({
      method: 'GET',
      url: '/revision/',
    });
  },

  getTodayRevisions() {
    return request<Revision[]>({
      method: 'GET',
      url: '/revision/',
    });
  },

  getRevisionsByDate(date: string) {
    return request<Revision[]>({
      method: 'GET',
      url: `/revision/date/${date}`,
    });
  },

  createRevision(data: CreateRevisionData) {
    return request<Revision>({
      method: 'POST',
      url: '/revision/',
      data,
    });
  },

  completeRevision(revisionId: number) {
    return request<Revision>({
      method: 'PATCH',
      url: `/revision/${revisionId}`,
    });
  },
};