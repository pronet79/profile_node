import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import { SupportProvider } from './context/SupportContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <SettingsProvider>
              <SupportProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </SupportProvider>
            </SettingsProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
