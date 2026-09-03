import { request } from "./api-client";

export interface Note {
  note_id: number;
  user_id: number;

  title: string;
  content: string;

  is_for_revision: boolean;
  next_revision_date: string | null;

  created_at: string;
  updated_at: string;
}

export interface CreateNote {
  title: string;
  content: string;
  is_for_revision: boolean;
  next_revision_date?: string | null;
}

const noteService = {
  getAll() {
    return request<Note[]>({
      method: "GET",
      url: "/notes/",
    });
  },

  create(data: CreateNote) {
    return request<Note>({
      method: "POST",
      url: "/notes/",
      data,
    });
  },

  update(id: number, data: CreateNote) {
    return request<Note>({
      method: "PATCH",
      url: `/notes/${id}`,
      data,
    });
  },

  delete(id: number) {
    return request<void>({
      method: "DELETE",
      url: `/notes/${id}`,
    });
  },
};

export default noteService;