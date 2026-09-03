import { request } from "./api-client";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "todo"
  | "in-progress"
  | "review"
  | "done";

export interface Task {
  id: string;

  title: string;

  description?: string;

  status: TaskStatus;

  priority: string;

  dueDate?: string;

  labels: string[];

  progress: number;

  subtasks: any[];

  createdAt: string;

  updatedAt: string;  
}

export interface UpdateTaskRequest {
  task_title?: string;

  description?: string;

  priority?: string;

  status?: TaskStatus;

  scheduled_date?: string;

  progress?: number;
}

export const tasksService = {
  async list(): Promise<Task[]> {
    return request<Task[]>({
      method: "GET",
      url: "/tasks",
    });
  },

  async get(id: number): Promise<Task> {
    return request<Task>({
      method: "GET",
      url: `/tasks/${id}`,
    });
  },

  async create(data: UpdateTaskRequest): Promise<Task> {
    return request<Task>({
      method: "POST",
      url: "/tasks",
      data,
    });
  },

  async update(
    id: number,
    data: UpdateTaskRequest,
  ): Promise<Task> {
    return request<Task>({
      method: "PATCH",
      url: `/tasks/${id}`,
      data,
    });
  },
  async delete(id: number): Promise<void> {
    return request<void>({
      method: "DELETE",
      url: `/tasks/${id}`,
    });
  },


};


export default tasksService;