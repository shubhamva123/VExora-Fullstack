import { request } from './api-client';
import type { User } from '@/types';

/**
 * Auth service — placeholder methods.
 * These will be connected to the existing FastAPI backend auth endpoints.
 * Endpoint paths and payloads are intentionally left undefined until the
 * backend contract is confirmed; replace the `TODO` bodies with real calls.
 */
export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await request<{
      access_token: string;
      token_type: string;
    }>({
      method: "POST",
      url: "/auth/login",
      data: {
        email,
        password,
      },
    });

    localStorage.setItem(
      "vexora.auth.token",
      response.access_token,
    );

    return this.getProfile();
  },
  
  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    await request({
      method: "POST",
      url: "/auth/register",
      data: {
        username,
        email,
        password,
      },
    });

    return this.login(email, password);
  },

  async forgotPassword(email: string): Promise<void> {
    // TODO: POST /auth/forgot-password
    return request<void>({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email },
    });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    // TODO: POST /auth/reset-password
    return request<void>({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, password },
    });
  },

  async logout(): Promise<void> {
    // TODO: POST /auth/logout
    return request<void>({ method: 'POST', url: '/auth/logout' });
  },

  async getProfile(): Promise<User> {
    return request<User>({
      method: "GET",
      url: "/auth/me",
    });
  },
  async updateProfile(updates: Partial<User>): Promise<User> {
    // TODO: PATCH /auth/me
    return request<User>({ method: 'PATCH', url: '/auth/me', data: updates });
  },
};
