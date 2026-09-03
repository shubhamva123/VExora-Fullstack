import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { AppNotification } from '@/types';

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

const seed: AppNotification[] = [
  {
    id: 'n1',
    type: 'revision',
    title: 'Revision due tomorrow',
    message: 'Organic Chemistry Chapter 4 is scheduled for revision.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actionUrl: '/app/revision',
  },
  {
    id: 'n2',
    type: 'task',
    title: 'Task completed',
    message: 'You finished "Submit lab report". Nice work!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    actionUrl: '/app/tasks',
  },
  {
    id: 'n3',
    type: 'ai',
    title: 'AI summary ready',
    message: 'Your daily summary is available for review.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    actionUrl: '/app/summary',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(seed);

  const addNotification = useCallback(
    (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => {
      setNotifications((prev) => [
        {
          ...n,
          id: `n${Date.now()}`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [],
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, addNotification, markRead, markAllRead, remove, clear }),
    [notifications, unreadCount, addNotification, markRead, markAllRead, remove, clear],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
