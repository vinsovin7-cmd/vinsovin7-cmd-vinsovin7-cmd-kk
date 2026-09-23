/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Unknown runtime error' };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[RootErrorBoundary] Caught runtime exception:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('alphaqubit_is_tab_hidden');
      localStorage.removeItem('alphaqubit_active_main_tab');
      window.location.hash = '';
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#090A0E',
          color: '#f3f4f6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#12151E',
            border: '1px solid #C5A059',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>👑</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFD700', marginBottom: '8px' }}>
              AlphaQubit & Franz Messenger Recovery Shield
            </h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px', lineHeight: '1.6' }}>
              An interface rendering anomaly was caught and isolated. Click below to reset state and restore both the AlphaQubit Quantum Ecosystem and Franz Multi-Messenger OS.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#C5A059',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Restore AlphaQubit Ecosystem (/)
              </button>
              <a
                href="/franz"
                style={{
                  backgroundColor: '#1fa2f2',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '13px',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Open Franz Messenger (/franz)
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
