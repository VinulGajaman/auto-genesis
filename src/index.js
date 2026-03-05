import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications, notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mantineTheme } from './theme/mantineTheme';
import { useAppStore } from './store/useAppStore';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mantine core CSS — MUST be imported before any other styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import './styles/global.css';

// React Query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min
      gcTime: 1000 * 60 * 10,     // 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * NotifyBridge — injects the Mantine notifications API into
 * the Zustand store so any component can call showToast()
 * without importing Mantine directly.
 */
function NotifyBridge() {
  const injectNotify = useAppStore((s) => s.injectNotify);

  useEffect(() => {
    injectNotify(({ message, type }) => {
      notifications.show({
        title: type === 'error' ? 'Error' : type === 'warning' ? 'Warning' : 'Success',
        message,
        color: type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'brand',
        autoClose: 3500,
        position: 'top-right',
      });
    });
  }, [injectNotify]);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={mantineTheme} defaultColorScheme="dark">
        <ColorSchemeScript defaultColorScheme="dark" />
        <Notifications position="top-right" zIndex={9999} />
        <NotifyBridge />
        <App />
      </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

reportWebVitals();
