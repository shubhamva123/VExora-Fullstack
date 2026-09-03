import { request } from "./api-client";
import type { CalendarEvent } from "@/types";

export interface CreateCalendarEventRequest {
  title: string;
  type: "task" | "revision" | "reminder" | "study" | "personal";
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  type?: "task" | "revision" | "reminder" | "study" | "personal";
  date?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
}

export const calendarService = {
  async list(): Promise<CalendarEvent[]> {
    return request<CalendarEvent[]>({
      method: "GET",
      url: "/calendar",
    });
  },

  async get(id: number): Promise<CalendarEvent> {
    return request<CalendarEvent>({
      method: "GET",
      url: `/calendar/${id}`,
    });
  },

  async create(
    data: CreateCalendarEventRequest,
  ): Promise<CalendarEvent> {
    return request<CalendarEvent>({
      method: "POST",
      url: "/calendar",
      data,
    });
  },

  async update(
    id: number,
    data: UpdateCalendarEventRequest,
  ): Promise<CalendarEvent> {
    return request<CalendarEvent>({
      method: "PATCH",
      url: `/calendar/${id}`,
      data,
    });
  },

  async delete(id: number): Promise<void> {
    return request<void>({
      method: "DELETE",
      url: `/calendar/${id}`,
    });
  },
};

export default calendarService;