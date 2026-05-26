import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { queryClient } from './lib/queryClient';
import { useThemeStore } from './store/themeStore';
import './index.css';

const ThemeInit = ({ children }) => {
  const { initTheme } = useThemeStore();
  React.useEffect(() => { initTheme(); }, []);
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                style: {
                  background: '#1a1a2e',
                  color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.2)',
                },
                iconTheme: { primary: '#4ade80', secondary: '#1a1a2e' },
              },
              error: {
                style: {
                  background: '#1a1a2e',
                  color: '#f87171',
                  border: '1px solid rgba(248,113,113,0.2)',
                },
                iconTheme: { primary: '#f87171', secondary: '#1a1a2e' },
              },
            }}
          />
        </ThemeInit>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
