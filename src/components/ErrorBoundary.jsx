'use client';
import React from 'react';
import Link from 'next/link';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 24px',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '500px' }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>⚠️</span>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>
              An unexpected error occurred. Please try refreshing the page or go back to the homepage.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn btn-primary"
              >
                🔄 Try Again
              </button>
              <Link href="/" className="btn btn-outline">
                🏠 Go Home
              </Link>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre style={{
                marginTop: '24px',
                padding: '16px',
                background: 'rgba(239,68,68,0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171',
                fontSize: '12px',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
