import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { CacheProvider } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import Invoices from '@/pages/Invoices';
import Reports from '@/pages/Reports';
import NotFound from '@/pages/NotFound';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getDirectionCache, getLanguageDirection } from '@/utils/rtl';
import '@/i18n';
import '@/App.css';

const queryClient = new QueryClient();

function App() {
  const { i18n } = useTranslation();
  const direction = getLanguageDirection(i18n.language);
  const cache = getDirectionCache(direction);

  // עדכון כיוון המסמך בהתאם לשפה
  useEffect(() => {
    document.dir = direction;
    document.documentElement.lang = i18n.language;
    document.documentElement.setAttribute('dir', direction);
  }, [direction, i18n.language]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
            </SnackbarProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
