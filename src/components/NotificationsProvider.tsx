import React from 'react';
import { NotificationsContext, useNotificationsProvider } from '@/hooks/useNotifications';

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const notificationsValue = useNotificationsProvider();

  return (
    <NotificationsContext.Provider value={notificationsValue}>
      {children}
    </NotificationsContext.Provider>
  );
};