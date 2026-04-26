import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import store from './app/store';
import theme from './app/theme';
import AppShell from './layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import CreateNotePage from './pages/CreateNotePage';
import LiveMonitorPage from './pages/LiveMonitorPage';
import DebugPage from './pages/DebugPage';
import SystemFlowPage from './pages/SystemFlowPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={4000}
        >
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/create" element={<CreateNotePage />} />
                <Route path="/live" element={<LiveMonitorPage />} />
                <Route path="/debug" element={<DebugPage />} />
                <Route path="/debug/:id" element={<DebugPage />} />
                <Route path="/system" element={<SystemFlowPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
